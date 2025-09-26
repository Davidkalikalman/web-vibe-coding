# Multilingual Text Management System - Production Docker Image
# Multi-stage build for optimized production deployment

# =============================================================================
# Base Stage - Python environment
# =============================================================================
FROM python:3.12-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libc-dev \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create application user
RUN useradd --create-home --shell /bin/bash app

# Set working directory
WORKDIR /app

# =============================================================================
# Dependencies Stage
# =============================================================================
FROM base as dependencies

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# =============================================================================
# Development Stage
# =============================================================================
FROM dependencies as development

# Install development dependencies
RUN pip install pytest pytest-cov black flake8 mypy

# Copy source code
COPY . .

# Change ownership to app user
RUN chown -R app:app /app

# Switch to app user
USER app

# Set development environment
ENV ENVIRONMENT=development

# Expose port for development server
EXPOSE 8000

# Development command (can be overridden)
CMD ["python", "src/main.py", "--help"]

# =============================================================================
# Production Stage
# =============================================================================
FROM dependencies as production

# Create necessary directories
RUN mkdir -p /app/logs /app/input /app/output /app/cache && \
    chown -R app:app /app

# Copy source code
COPY src/ /app/src/
COPY config/ /app/config/
COPY env.example /app/

# Change ownership to app user
RUN chown -R app:app /app

# Switch to app user
USER app

# Set production environment
ENV ENVIRONMENT=production \
    LOG_LEVEL=INFO \
    LOG_DIR=/app/logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python src/main.py validate || exit 1

# Production command
CMD ["python", "src/main.py", "translate", "--input", "/app/input", "--output", "/app/output"]

# =============================================================================
# Testing Stage
# =============================================================================
FROM development as testing

# Copy test files
COPY tests/ /app/tests/

# Run tests as part of build
RUN python -m pytest tests/ -v --cov=src --cov-report=term-missing

# =============================================================================
# Final Stage Selection
# =============================================================================
# Default to production
FROM production

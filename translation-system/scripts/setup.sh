#!/bin/bash

# Setup script for Multilingual Text Management System
# Initializes the environment and prepares the system for first use

set -e

echo "🌍 Multilingual Text Management System - Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running in project directory
if [ ! -f "requirements.txt" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_step "1. Checking system requirements..."

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 8 ]; then
        print_status "Python $PYTHON_VERSION found"
    else
        print_error "Python 3.8+ required. Found: $PYTHON_VERSION"
        exit 1
    fi
else
    print_error "Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    print_status "Docker found: $(docker --version)"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not found. Local installation only."
    DOCKER_AVAILABLE=false
fi

# Check Docker Compose (optional)
if command -v docker-compose &> /dev/null; then
    print_status "Docker Compose found: $(docker-compose --version)"
    DOCKER_COMPOSE_AVAILABLE=true
else
    print_warning "Docker Compose not found."
    DOCKER_COMPOSE_AVAILABLE=false
fi

print_step "2. Setting up directories..."

# Create necessary directories
mkdir -p input output logs cache config
mkdir -p dev-input dev-output batch-input batch-output
mkdir -p ftp-data test-results

print_status "Created directory structure"

print_step "3. Setting up environment configuration..."

# Copy environment template if .env doesn't exist
if [ ! -f ".env" ]; then
    cp env.example .env
    print_status "Created .env file from template"
    print_warning "Please edit .env file with your configuration"
else
    print_status ".env file already exists"
fi

# Create local configuration if it doesn't exist
if [ ! -f "config/local.json" ]; then
    cp config/config.json config/local.json
    print_status "Created local configuration file"
else
    print_status "Local configuration file already exists"
fi

print_step "4. Setting up Python environment..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    print_status "Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate
print_status "Activated virtual environment"

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install requirements
print_status "Installing Python dependencies..."
pip install -r requirements.txt

print_step "5. Running configuration validation..."

# Test configuration
python src/main.py validate --config config/local.json || {
    print_warning "Configuration validation failed. Please check your settings."
}

print_step "6. Setting up Git hooks (if applicable)..."

# Setup pre-commit hooks if .git exists
if [ -d ".git" ]; then
    if command -v pre-commit &> /dev/null; then
        pre-commit install
        print_status "Pre-commit hooks installed"
    else
        print_warning "pre-commit not found. Install with: pip install pre-commit"
    fi
fi

print_step "7. Creating sample files..."

# Create sample input files
cat > input/sample.txt << EOF
Hello World!

This is a sample text file for translation testing.
The multilingual text management system will translate this content into multiple languages.

Features:
- Automatic translation
- FTP integration
- Multiple file formats
- Parallel processing
EOF

cat > input/sample.md << EOF
# Sample Markdown File

This is a **sample markdown file** for testing the translation system.

## Features

- *Automatic translation* with formatting preservation
- FTP integration for remote file management
- Support for multiple file formats
- Parallel processing capabilities

### Code Example

\`\`\`python
# This code block will not be translated
print("Hello, World!")
\`\`\`

For more information, visit [our website](https://example.com).
EOF

cat > input/sample.json << EOF
{
  "application": {
    "name": "Translation System",
    "description": "Multilingual text management with FTP integration",
    "version": "1.0.0"
  },
  "messages": {
    "welcome": "Welcome to the translation system",
    "processing": "Processing files for translation",
    "complete": "Translation completed successfully"
  },
  "config": {
    "max_workers": 4,
    "timeout": 30,
    "api_endpoint": "https://api.example.com"
  }
}
EOF

print_status "Created sample input files"

print_step "8. Setup complete!"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your FTP and translation service credentials"
echo "2. Test the system: python src/main.py translate --input input --output output"
echo "3. For Docker usage: docker-compose up -d"
echo ""
echo "Available commands:"
echo "- python src/main.py translate --input input --output output"
echo "- python src/main.py batch --input batch-input --recursive"
echo "- python src/main.py validate"
echo ""

if [ "$DOCKER_AVAILABLE" = true ] && [ "$DOCKER_COMPOSE_AVAILABLE" = true ]; then
    echo "Docker commands:"
    echo "- docker-compose up -d                           # Production"
    echo "- docker-compose -f docker-compose.dev.yml --profile development up  # Development"
    echo "- docker-compose --profile batch up translation-batch  # Batch processing"
    echo ""
fi

echo "For detailed documentation, see README.md"

# Deactivate virtual environment
deactivate

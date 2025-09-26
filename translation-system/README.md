# Multilingual Text Management System

A comprehensive Python-based solution for automated multilingual text translation and management using FTP as the primary file transfer mechanism.

## 🌍 Language Support

- **Slovak** (sk) 
- **English** (en) - Primary source language
- **Hungarian** (hu)
- **German** (de)
- **Polish** (pl)

## ✨ Features

### Core Functionality
- **Automated Translation Workflow** - Complete end-to-end translation pipeline
- **FTP Integration** - Secure file upload/download with SSL/TLS support
- **Multiple File Formats** - Support for TXT, MD, HTML, JSON, and XML files
- **Parallel Processing** - Multi-threaded translation for improved performance
- **Formatting Preservation** - Maintains original text structure and formatting

### Translation Services
- **Google Translate** - Primary translation service with fallback support
- **DeepL** - High-quality professional translations (API key required)
- **OpenAI GPT** - AI-powered context-aware translations (API key required)
- **Microsoft Translator** - Enterprise-grade translation service

### Advanced Features
- **Translation Caching** - Reduces API calls and improves performance
- **Retry Logic** - Robust error handling with configurable retry attempts
- **Batch Processing** - Process multiple directories recursively
- **Real-time Monitoring** - Comprehensive logging with JSON structured output
- **Docker Support** - Production-ready containerization

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ or Docker
- FTP server access
- Translation service API key (optional, for premium services)

### Installation

#### Option 1: Local Installation
```bash
# Clone the repository
git clone <repository-url>
cd translation-system

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your configuration
```

#### Option 2: Docker Installation
```bash
# Clone the repository
git clone <repository-url>
cd translation-system

# Configure environment
cp env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose up -d
```

### Basic Usage

#### Command Line Interface
```bash
# Translate files in a directory
python src/main.py translate --input ./content --output ./translated

# Batch process multiple directories
python src/main.py batch --input ./projects --recursive

# Upload translations to FTP server
python src/main.py translate --input ./content --ftp-upload --remote-path translations

# Validate configuration
python src/main.py validate
```

#### Docker Usage
```bash
# Production deployment
docker-compose up -d

# Development mode
docker-compose -f docker-compose.dev.yml --profile development up

# Batch processing
docker-compose --profile batch up translation-batch

# Run with monitoring
docker-compose --profile monitoring up -d
```

## 📋 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# FTP Configuration
FTP_HOST=your-ftp-server.com
FTP_USERNAME=your-username
FTP_PASSWORD=your-password
FTP_USE_TLS=true

# Translation Service
TRANSLATION_SERVICE=google
TRANSLATION_API_KEY=your-api-key
SOURCE_LANGUAGE=en
TRANSLATION_LANGUAGES=sk,hu,de,pl

# Processing Settings
PARALLEL_WORKERS=4
MAX_FILE_SIZE=10485760
```

### Configuration File

Alternatively, use `config/config.json`:

```json
{
  "ftp": {
    "host": "your-ftp-server.com",
    "use_tls": true
  },
  "translation": {
    "service": "google",
    "source_language": "en",
    "target_languages": ["sk", "hu", "de", "pl"]
  }
}
```

## 🔧 Advanced Usage

### Parallel Processing
```bash
# Process with custom worker count
python src/main.py translate --input ./content --workers 8 --parallel

# Sequential processing for debugging
python src/main.py translate --input ./content --no-parallel
```

### File Pattern Filtering
```bash
# Process specific file types
python src/main.py translate --input ./content --patterns "*.md" "*.html"

# Exclude certain files
python src/main.py translate --input ./content --exclude "*.tmp" "*_backup.*"
```

### FTP Operations
```bash
# Download files from FTP first, then translate
python src/main.py translate --input ./remote-files --ftp-download --ftp-upload

# Custom remote path
python src/main.py translate --input ./content --ftp-upload --remote-path "translations/$(date +%Y%m%d)"
```

### Output Formats
```bash
# JSON output for automation
python src/main.py translate --input ./content --output-format json

# Get current workflow status
python src/main.py status --output-format json
```

## 🐳 Docker Deployment

### Production Deployment
```bash
# Start production services
docker-compose up -d

# View logs
docker-compose logs -f translation-system

# Scale processing
docker-compose up --scale translation-system=3
```

### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml --profile development up

# Start with FTP server for testing
docker-compose -f docker-compose.dev.yml --profile development --profile ftp up

# Run tests
docker-compose -f docker-compose.dev.yml --profile testing up translation-test
```

### Volume Mounts
- `./input:/app/input` - Input files (read-only)
- `./output:/app/output` - Translated output files
- `./logs:/app/logs` - Application logs
- `./cache:/app/cache` - Translation cache
- `./config:/app/config` - Configuration files (read-only)

## 🏗️ Architecture

### Core Components

```
translation-system/
├── src/
│   ├── core/
│   │   ├── config_manager.py      # Configuration management
│   │   └── translation_workflow.py # Main workflow orchestration
│   ├── services/
│   │   ├── ftp_client.py          # Secure FTP operations
│   │   ├── translation_service.py  # Translation backends
│   │   └── file_processor.py      # File format processors
│   ├── utils/
│   │   └── logging_setup.py       # Comprehensive logging
│   └── main.py                    # CLI application
├── config/
│   └── config.json               # Configuration template
├── docker/
│   ├── Dockerfile                # Multi-stage Docker build
│   ├── docker-compose.yml        # Production deployment
│   └── docker-compose.dev.yml    # Development environment
└── docs/
    └── README.md                 # This file
```

### Workflow Process

1. **File Discovery** - Scan input directory for supported files
2. **FTP Download** - Optional download from remote server
3. **Content Extraction** - Parse files and extract translatable content
4. **Translation** - Process content through translation service
5. **Content Reconstruction** - Rebuild files with translations
6. **FTP Upload** - Optional upload to remote server
7. **Cleanup** - Remove temporary files

## 📊 Monitoring and Logging

### Log Files
- `logs/translation_system.log` - Standard application logs
- `logs/translation_system.json` - Structured JSON logs for analysis
- `logs/workflow_*.log` - Individual workflow logs

### Monitoring
```bash
# Real-time log monitoring
tail -f logs/translation_system.log

# JSON log analysis
cat logs/translation_system.json | jq '.message'

# Performance metrics
grep "performance_metric" logs/translation_system.json | jq
```

### Health Checks
```bash
# Manual health check
python src/main.py validate

# Docker health check
docker exec translation-system-main python src/main.py validate
```

## 🔒 Security

### FTP Security
- SSL/TLS encryption for secure connections
- Credential management via environment variables
- Connection timeout and retry configuration
- Support for both FTPS and SFTP protocols

### API Security
- Secure API key storage in environment variables
- Rate limiting and retry logic to prevent abuse
- Encryption for sensitive configuration data
- Network isolation in Docker environments

### File Security
- Input file validation and size limits
- Secure temporary file handling
- Backup creation before processing
- Controlled file permissions in containers

## 🧪 Testing

### Local Testing
```bash
# Install test dependencies
pip install pytest pytest-cov

# Run tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=src --cov-report=html
```

### Docker Testing
```bash
# Run test suite in container
docker-compose -f docker-compose.dev.yml --profile testing up translation-test

# Interactive testing
docker-compose -f docker-compose.dev.yml --profile development run translation-dev pytest
```

## 🚀 Performance Optimization

### Translation Caching
- Automatic caching of translations to reduce API calls
- File-based cache with configurable size limits
- Cache invalidation and cleanup policies

### Parallel Processing
- Multi-threaded file processing
- Configurable worker pool size
- Memory-efficient batch processing

### Resource Management
- File size limits to prevent memory issues
- Connection pooling for FTP operations
- Graceful error handling and recovery

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd translation-system

# Setup development environment
docker-compose -f docker-compose.dev.yml --profile development up -d

# Connect to development container
docker exec -it translation-dev bash

# Install development dependencies
pip install -r requirements.txt
pip install pytest black flake8 mypy
```

### Code Quality
```bash
# Format code
black src/ tests/

# Lint code
flake8 src/ tests/

# Type checking
mypy src/
```

### Testing Guidelines
- Write unit tests for all new functionality
- Include integration tests for FTP and translation services
- Test error handling and edge cases
- Maintain test coverage above 80%

## 📚 API Reference

### CLI Commands

#### `translate`
Translate files in a directory
```bash
python src/main.py translate [OPTIONS]
```
- `--input, -i` - Input directory or file (required)
- `--output, -o` - Output directory
- `--patterns` - File patterns to include
- `--exclude` - File patterns to exclude
- `--ftp-upload` - Upload translated files to FTP
- `--ftp-download` - Download files from FTP first
- `--remote-path` - Remote path for FTP operations
- `--workers` - Number of parallel workers
- `--no-parallel` - Disable parallel processing

#### `batch`
Batch process multiple directories
```bash
python src/main.py batch [OPTIONS]
```
- `--input, -i` - Base directory (required)
- `--recursive, -r` - Process directories recursively

#### `validate`
Validate system configuration
```bash
python src/main.py validate
```

#### `status`
Get current workflow status
```bash
python src/main.py status [--output-format json]
```

### Configuration API

The system uses a hierarchical configuration system:
1. Command-line arguments (highest priority)
2. Environment variables
3. Configuration file
4. Default values (lowest priority)

## 🐛 Troubleshooting

### Common Issues

#### FTP Connection Failed
```
Error: Could not establish FTP connection
```
**Solution:**
- Verify FTP credentials in `.env` file
- Check firewall settings for FTP ports
- Try SFTP if FTPS fails: `FTP_USE_TLS=false`

#### Translation Service Error
```
Error: Translation service failed
```
**Solution:**
- Verify API key configuration
- Check service quota and rate limits
- Try fallback service: `TRANSLATION_SERVICE=google`

#### Memory Issues
```
Error: Memory allocation failed
```
**Solution:**
- Reduce parallel workers: `--workers 2`
- Lower batch size: `BATCH_SIZE=5`
- Increase Docker memory limits

### Debug Mode
```bash
# Enable debug logging
python src/main.py translate --input ./content --log-level DEBUG

# Verbose output
python src/main.py translate --input ./content --verbose

# Disable parallel processing for debugging
python src/main.py translate --input ./content --no-parallel
```

### Log Analysis
```bash
# Find error messages
grep "ERROR" logs/translation_system.log

# Check translation failures
grep "translation_failed" logs/translation_system.json | jq

# Monitor performance
grep "performance_metric" logs/translation_system.json | jq '.metric_name, .metric_value'
```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Check the troubleshooting section above
- Review the logs in `logs/` directory
- Use the `validate` command to check configuration
- Run with `--verbose` flag for detailed output

## 🔄 Changelog

### Version 1.0.0
- Initial release with core translation functionality
- FTP integration with SSL/TLS support
- Multi-format file processing (TXT, MD, HTML, JSON)
- Docker containerization
- Comprehensive logging and monitoring
- Parallel processing capabilities
- Translation caching system

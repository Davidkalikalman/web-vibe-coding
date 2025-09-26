# Quick Start Guide

Get your Multilingual Text Management System up and running in minutes!

## 🚀 5-Minute Setup

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd translation-system

# Run the automated setup
./scripts/setup.sh
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp env.example .env

# Edit configuration (minimum required settings)
nano .env
```

**Minimum required settings:**
```env
FTP_HOST=your-ftp-server.com
FTP_USERNAME=your-username
FTP_PASSWORD=your-password
TRANSLATION_SERVICE=google
```

### Step 3: Create Sample Content
```bash
# The setup script already created sample files in input/
# Add your own files to input/ directory
echo "Hello, world! This is a test translation." > input/my-file.txt
```

### Step 4: Run First Translation
```bash
# Activate virtual environment
source venv/bin/activate

# Translate sample files
python src/main.py translate --input input --output output

# Check results
ls output/
```

## 🐳 Docker Quick Start

If you prefer Docker:

```bash
# Configure environment
cp env.example .env
# Edit .env with your settings

# Start with Docker
docker-compose up -d

# Check logs
docker-compose logs -f translation-system

# View results
ls output/
```

## 📋 Basic Commands

### Translate Files
```bash
# Basic translation
python src/main.py translate --input input --output output

# Specific file types only
python src/main.py translate --input input --patterns "*.md" "*.html"

# With FTP upload
python src/main.py translate --input input --ftp-upload --remote-path translations
```

### Batch Processing
```bash
# Process multiple directories
python src/main.py batch --input projects --recursive
```

### System Validation
```bash
# Check configuration
python src/main.py validate

# Get system status
python src/main.py status
```

## 🔧 Common Configurations

### Google Translate (Default)
```env
TRANSLATION_SERVICE=google
# No API key required for basic usage
```

### DeepL (Professional)
```env
TRANSLATION_SERVICE=deepl
DEEPL_API_KEY=your-deepl-api-key
```

### OpenAI GPT (Advanced)
```env
TRANSLATION_SERVICE=openai
OPENAI_API_KEY=your-openai-api-key
```

### SFTP instead of FTP
```env
FTP_HOST=your-sftp-server.com
FTP_PORT=22
FTP_USE_TLS=false  # SFTP uses SSH, not TLS
```

## 📁 File Structure

After setup, your directory will look like:
```
translation-system/
├── input/           # Put files to translate here
├── output/          # Translated files appear here
├── logs/            # Application logs
├── cache/           # Translation cache
├── config/          # Configuration files
├── src/             # Source code
├── scripts/         # Utility scripts
├── tests/           # Test suite
└── .env             # Your configuration
```

## 🔍 Check Results

### View Translated Files
```bash
# List output files
ls -la output/

# Check translations for each language
ls output/*_sk.*  # Slovak translations
ls output/*_hu.*  # Hungarian translations
ls output/*_de.*  # German translations
ls output/*_pl.*  # Polish translations
```

### Check Logs
```bash
# View latest log entries
tail -f logs/translation_system.log

# Check for errors
grep "ERROR" logs/translation_system.log

# View JSON formatted logs
cat logs/translation_system.json | jq '.message'
```

## ⚡ Performance Tips

### Faster Processing
```bash
# Use more parallel workers
python src/main.py translate --input input --workers 8

# Process in batches
BATCH_SIZE=20 python src/main.py translate --input input
```

### Reduce API Calls
```bash
# Enable caching (default)
TRANSLATION_CACHE=true

# Cache persists between runs
```

## 🚨 Troubleshooting

### Common Issues

**FTP Connection Failed**
```bash
# Test FTP connection
python src/main.py validate

# Check credentials in .env file
# Try SFTP if FTPS fails: FTP_USE_TLS=false FTP_PORT=22
```

**Translation Service Error**
```bash
# Check API key configuration
echo $TRANSLATION_API_KEY

# Try Google Translate (no API key needed)
TRANSLATION_SERVICE=google python src/main.py translate --input input
```

**Permission Denied**
```bash
# Fix file permissions
chmod +x scripts/*.sh
chmod 600 .env

# Create missing directories
mkdir -p input output logs cache
```

### Getting Help
```bash
# View all available options
python src/main.py --help
python src/main.py translate --help

# Enable debug logging
python src/main.py translate --input input --log-level DEBUG
```

## 🎯 Next Steps

1. **Add Your Content**: Put your files in the `input/` directory
2. **Configure Languages**: Edit `TRANSLATION_LANGUAGES` in `.env`
3. **Setup FTP**: Configure your FTP server details
4. **Automate**: Use the batch processing features
5. **Monitor**: Check logs and set up monitoring
6. **Scale**: Use Docker for production deployment

## 📖 Learn More

- [Full Documentation](README.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Configuration Options](config/config.json)
- [Example Scripts](scripts/)

## 🆘 Support

If you encounter issues:
1. Check the logs: `tail -f logs/translation_system.log`
2. Validate configuration: `python src/main.py validate`
3. Try with debug logging: `--log-level DEBUG`
4. Check the troubleshooting section in the full README

Happy translating! 🌍

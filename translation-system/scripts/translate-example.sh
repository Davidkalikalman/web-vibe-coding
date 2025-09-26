#!/bin/bash

# Example translation script for Multilingual Text Management System
# Demonstrates various usage patterns and command options

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🌍 Translation System - Example Usage${NC}"
echo "========================================"

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Check if virtual environment exists and activate it
if [ -d "venv" ]; then
    echo -e "${GREEN}Activating virtual environment...${NC}"
    source venv/bin/activate
fi

# Example 1: Basic translation
echo -e "\n${YELLOW}Example 1: Basic Translation${NC}"
echo "Translating files in input/ directory to all configured languages"
python src/main.py translate \
    --input input \
    --output output/basic \
    --log-level INFO

# Example 2: Specific file patterns
echo -e "\n${YELLOW}Example 2: Specific File Patterns${NC}"
echo "Translating only Markdown and HTML files"
python src/main.py translate \
    --input input \
    --output output/filtered \
    --patterns "*.md" "*.html" \
    --log-level INFO

# Example 3: Parallel processing with custom workers
echo -e "\n${YELLOW}Example 3: Parallel Processing${NC}"
echo "Using 2 parallel workers for translation"
python src/main.py translate \
    --input input \
    --output output/parallel \
    --workers 2 \
    --parallel \
    --log-level INFO

# Example 4: JSON output for automation
echo -e "\n${YELLOW}Example 4: JSON Output for Automation${NC}"
echo "Getting results in JSON format"
python src/main.py translate \
    --input input \
    --output output/json-demo \
    --output-format json \
    --log-level WARNING

# Example 5: Configuration validation
echo -e "\n${YELLOW}Example 5: Configuration Validation${NC}"
echo "Validating system configuration"
python src/main.py validate

# Example 6: Batch processing (if directories exist)
if [ -d "batch-input" ] && [ "$(ls -A batch-input)" ]; then
    echo -e "\n${YELLOW}Example 6: Batch Processing${NC}"
    echo "Processing multiple directories recursively"
    python src/main.py batch \
        --input batch-input \
        --recursive \
        --output-format text
fi

# Example 7: FTP upload simulation (without actual FTP)
echo -e "\n${YELLOW}Example 7: FTP Upload Simulation${NC}"
echo "Simulating FTP upload (will fail if no FTP configured - this is expected)"
python src/main.py translate \
    --input input \
    --output output/ftp-demo \
    --ftp-upload \
    --remote-path "translations/$(date +%Y%m%d)" \
    --log-level ERROR || echo "FTP upload failed (expected if not configured)"

echo -e "\n${GREEN}✅ Example demonstrations completed!${NC}"
echo ""
echo "Check the following directories for results:"
echo "- output/basic/     - Basic translation example"
echo "- output/filtered/  - Filtered file patterns"
echo "- output/parallel/  - Parallel processing example"
echo "- output/json-demo/ - JSON output example"
echo "- output/ftp-demo/  - FTP simulation example"
echo ""
echo "Log files are in: logs/"
echo ""
echo "To view detailed logs:"
echo "tail -f logs/translation_system.log"
echo ""
echo "To view JSON logs:"
echo "cat logs/translation_system.json | jq '.message'"

# Deactivate virtual environment if it was activated
if [ -n "$VIRTUAL_ENV" ]; then
    deactivate
fi

#!/bin/bash

# Vila Mlynica Website Testing Bot Runner
# This script sets up and runs comprehensive testing

echo "🏔️ Vila Mlynica Website Testing Bot"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm is installed: $(npm --version)"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Create reports directory if it doesn't exist
mkdir -p reports
print_status "Reports will be saved in: $(pwd)/reports/"

# Parse command line arguments
HEADLESS=false
MOBILE_ONLY=false
DESKTOP_ONLY=false
PERFORMANCE_ONLY=false
CUSTOM_URL=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --headless)
            HEADLESS=true
            shift
            ;;
        --mobile-only)
            MOBILE_ONLY=true
            shift
            ;;
        --desktop-only)
            DESKTOP_ONLY=true
            shift
            ;;
        --performance-only)
            PERFORMANCE_ONLY=true
            shift
            ;;
        --url)
            CUSTOM_URL="$2"
            shift 2
            ;;
        --help)
            echo ""
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --headless           Run tests in headless mode (no browser window)"
            echo "  --mobile-only        Test only mobile screen sizes"
            echo "  --desktop-only       Test only desktop screen sizes"
            echo "  --performance-only   Run only performance tests"
            echo "  --url URL            Test custom URL instead of vilamlynica.sk"
            echo "  --help               Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                          # Run all tests with browser window"
            echo "  $0 --headless               # Run all tests without browser window"
            echo "  $0 --mobile-only            # Test only mobile devices"
            echo "  $0 --url http://localhost:8000  # Test local development server"
            echo ""
            exit 0
            ;;
        *)
            print_warning "Unknown option: $1"
            shift
            ;;
    esac
done

# Set environment variables
export HEADLESS=$HEADLESS
export MOBILE_ONLY=$MOBILE_ONLY
export DESKTOP_ONLY=$DESKTOP_ONLY
export PERFORMANCE_ONLY=$PERFORMANCE_ONLY

if [ ! -z "$CUSTOM_URL" ]; then
    export CUSTOM_URL=$CUSTOM_URL
    print_status "Testing custom URL: $CUSTOM_URL"
fi

# Display test configuration
echo ""
print_status "Test Configuration:"
echo "  - Headless mode: $HEADLESS"
echo "  - Mobile only: $MOBILE_ONLY"
echo "  - Desktop only: $DESKTOP_ONLY"
echo "  - Performance only: $PERFORMANCE_ONLY"
if [ ! -z "$CUSTOM_URL" ]; then
    echo "  - Custom URL: $CUSTOM_URL"
else
    echo "  - Target URL: https://vilamlynica.sk"
fi
echo ""

# Run the tests
print_status "Starting comprehensive website testing..."
echo ""

# Run the test bot
node test-bot.js

# Check if tests completed successfully
if [ $? -eq 0 ]; then
    print_success "Testing completed successfully!"
    echo ""
    
    # Move reports to reports directory
    if [ -f "test-report.html" ]; then
        mv test-report.html reports/test-report-$(date +%Y%m%d-%H%M%S).html
        print_success "HTML report saved in reports/"
    fi
    
    if [ -f "test-report.json" ]; then
        mv test-report.json reports/test-report-$(date +%Y%m%d-%H%M%S).json
        print_success "JSON report saved in reports/"
    fi
    
    # Show latest report
    LATEST_REPORT=$(ls -t reports/test-report-*.html 2>/dev/null | head -n1)
    if [ ! -z "$LATEST_REPORT" ]; then
        print_status "Latest report: $LATEST_REPORT"
        
        # Try to open the report in default browser (macOS)
        if command -v open &> /dev/null; then
            print_status "Opening report in browser..."
            open "$LATEST_REPORT"
        fi
    fi
    
else
    print_error "Testing failed with errors"
    exit 1
fi

echo ""
print_success "🎉 Vila Mlynica testing completed!"
echo "📊 Check the reports directory for detailed results."

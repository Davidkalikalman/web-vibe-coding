# 🧪 Vila Mlynica Comprehensive Testing Bot

A powerful automated testing system that thoroughly tests your Vila Mlynica website across all devices, screen sizes, and functionality.

## 🎯 What It Tests

### **📱 Device & Screen Testing**
- **8 Different Screen Sizes**: Mobile portrait/landscape, tablets, desktop sizes, ultra-wide
- **Responsive Design**: Tests viewport behavior across all sizes
- **Touch Interactions**: Mobile-specific touch events and gestures

### **🌐 Complete Page Coverage**
- **All Main Pages**: Homepage, Accommodation, Restaurant, Gallery, Contact
- **Navigation Testing**: All menu links and navigation flows
- **Form Testing**: Contact forms, booking buttons, validation

### **🌍 Multilingual Testing**
- **5 Languages**: Slovak, English, Polish, Hungarian, German
- **Translation Coverage**: Tests all data-lang attributes
- **Language Switching**: Validates language switcher functionality

### **🖼️ Gallery & Media Testing**
- **Image Loading**: Tests all 25+ gallery images
- **Lazy Loading**: Validates performance optimization
- **Category Filtering**: Tests gallery category filters
- **Alt Text**: Accessibility compliance for all images

### **⚡ Performance Testing**
- **Load Times**: Measures page load performance
- **Resource Loading**: Tests CSS, JS, and image loading
- **Service Worker**: PWA functionality testing
- **Caching**: Tests browser and service worker caching

### **🔍 SEO & Accessibility**
- **Meta Tags**: Title, description, Open Graph tags
- **Structured Data**: JSON-LD schema validation
- **Heading Hierarchy**: H1-H6 structure testing
- **ARIA Attributes**: Accessibility compliance

### **📊 Advanced Testing**
- **PWA Features**: Service worker registration, manifest
- **Form Validation**: Input validation and error handling
- **Error Handling**: JavaScript error detection
- **Load Testing**: Rapid navigation and stress testing

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
# Navigate to your web directory
cd /Users/mac/Downloads/web

# Install required packages
npm install
```

### **2. Run All Tests**
```bash
# Run comprehensive testing (with browser window)
./run-tests.sh

# Run in headless mode (faster, no browser window)
./run-tests.sh --headless
```

### **3. View Results**
- **HTML Report**: Opens automatically in your browser
- **JSON Data**: Detailed test data for analysis
- **Console Output**: Real-time test progress

## 📋 Testing Options

### **Screen Size Testing**
```bash
# Test only mobile devices
./run-tests.sh --mobile-only

# Test only desktop sizes
./run-tests.sh --desktop-only
```

### **Performance Focus**
```bash
# Run only performance tests
./run-tests.sh --performance-only
```

### **Custom URL Testing**
```bash
# Test local development server
./run-tests.sh --url http://localhost:8000

# Test staging environment
./run-tests.sh --url https://staging.vilamlynica.sk
```

### **Headless Mode**
```bash
# Run without browser window (faster)
./run-tests.sh --headless
```

## 📊 Test Categories

### **🔗 CONNECTIVITY**
- Basic connection testing
- HTTPS verification
- SSL certificate validation

### **📱 RESPONSIVE**
- Viewport meta tag testing
- Mobile navigation testing
- Screen size adaptation

### **🧭 NAVIGATION**
- Navigation link testing
- Menu functionality
- Link accessibility

### **🖼️ IMAGES**
- Image loading verification
- Alt text validation
- Lazy loading testing

### **🌐 MULTILINGUAL**
- Language switcher testing
- Translation file validation
- Data-lang attribute testing

### **🖼️ GALLERY**
- Gallery image testing
- Category filtering
- Modal functionality

### **📝 FORMS**
- Form field validation
- Submission testing
- Error message testing

### **🎯 INTERACTIONS**
- Button functionality
- Modal testing
- User interaction flows

### **⚡ PERFORMANCE**
- Page load times
- Resource optimization
- Memory usage

### **🔍 SEO**
- Meta tag validation
- Structured data testing
- Heading hierarchy

### **♿ ACCESSIBILITY**
- ARIA attribute testing
- Keyboard navigation
- Screen reader compatibility

### **🔧 PWA**
- Service worker testing
- Manifest validation
- Offline functionality

### **📱 MOBILE**
- Touch event testing
- Mobile-specific features
- Viewport optimization

### **🚀 LOAD_TEST**
- Rapid navigation testing
- Concurrent request handling
- Stress testing

## 📈 Understanding Results

### **Test Statuses**
- ✅ **PASSED**: Test completed successfully
- ❌ **FAILED**: Test failed and needs attention
- ⚠️ **WARNING**: Test passed but has minor issues
- ℹ️ **INFO**: Informational test result

### **Report Sections**
1. **Summary Dashboard**: Overview of all test results
2. **Category Breakdown**: Tests organized by functionality
3. **Detailed Results**: Individual test results with timestamps
4. **Performance Metrics**: Load times and resource usage

## 🛠️ Advanced Configuration

### **Environment Variables**
```bash
# Run in headless mode
export HEADLESS=true

# Test only mobile
export MOBILE_ONLY=true

# Custom URL
export CUSTOM_URL=https://your-site.com
```

### **Customizing Tests**
Edit `test-bot.js` to:
- Add new screen sizes
- Include additional pages
- Modify test criteria
- Add custom validations

## 🔧 Troubleshooting

### **Common Issues**

**Puppeteer Installation**
```bash
# If Puppeteer fails to install
npm install puppeteer --unsafe-perm=true --allow-root
```

**Permission Errors**
```bash
# Make script executable
chmod +x run-tests.sh
```

**Memory Issues**
```bash
# Run with more memory
node --max-old-space-size=4096 test-bot.js
```

### **Browser Issues**
- Ensure Chrome/Chromium is installed
- Update to latest browser version
- Check system permissions

## 📁 File Structure

```
/Users/mac/Downloads/web/
├── test-bot.js           # Main testing bot
├── package.json          # Dependencies and scripts
├── run-tests.sh          # Test runner script
├── reports/              # Generated test reports
│   ├── test-report-*.html
│   └── test-report-*.json
└── README-TESTING.md     # This documentation
```

## 🎯 Best Practices

### **Regular Testing**
- Run tests before deployment
- Test after major changes
- Schedule weekly automated runs

### **Performance Monitoring**
- Monitor load times
- Track performance regressions
- Optimize based on results

### **Cross-Device Testing**
- Test on real devices
- Validate responsive design
- Check touch interactions

## 🔄 Integration

### **CI/CD Integration**
```yaml
# GitHub Actions example
name: Website Testing
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: ./run-tests.sh --headless
```

### **Scheduled Testing**
```bash
# Add to crontab for daily testing
0 2 * * * cd /path/to/web && ./run-tests.sh --headless
```

## 📞 Support

For issues or questions:
- Check the console output for detailed error messages
- Review the HTML report for visual test results
- Examine the JSON report for detailed test data

## 🎉 Success Metrics

Your Vila Mlynica website should achieve:
- ✅ **90%+ Pass Rate** across all tests
- ✅ **All Critical Tests Passing** (connectivity, navigation, forms)
- ✅ **Performance Targets Met** (load times < 3 seconds)
- ✅ **Accessibility Compliance** (WCAG 2.1 AA standards)

---

**🏔️ Vila Mlynica Testing Bot - Ensuring Excellence Across All Devices** 🚀

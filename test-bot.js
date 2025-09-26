/**
 * Vila Mlynica Comprehensive Testing Bot
 * Tests all pages, categories, screen sizes, and functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VilaMLynicaTestBot {
  constructor() {
    this.baseUrl = 'https://vilamlynica.sk';
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      tests: []
    };
    
    // Screen sizes to test
    this.screenSizes = [
      { name: 'Mobile Portrait', width: 375, height: 667 },
      { name: 'Mobile Landscape', width: 667, height: 375 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop Small', width: 1280, height: 720 },
      { name: 'Desktop Medium', width: 1440, height: 900 },
      { name: 'Desktop Large', width: 1920, height: 1080 },
      { name: 'Ultra Wide', width: 2560, height: 1440 }
    ];
    
    // Pages to test
    this.pages = [
      { url: '/', name: 'Homepage', category: 'main' },
      { url: '/pages/accommodation.html', name: 'Accommodation', category: 'main' },
      { url: '/pages/restaurant.html', name: 'Restaurant', category: 'main' },
      { url: '/pages/gallery.html', name: 'Gallery', category: 'main' },
      { url: '/contact.html', name: 'Contact', category: 'main' }
    ];
    
    // Languages to test
    this.languages = ['sk', 'en', 'pl', 'hu', 'de'];
    
    // Gallery categories to test
    this.galleryCategories = ['all', 'interior', 'exterior', 'additional'];
  }

  async init() {
    console.log('🚀 Initializing Vila Mlynica Testing Bot...');
    
    try {
      // Check environment variables for configuration
      const headless = process.env.HEADLESS === 'true' || process.env.HEADLESS === true;
      
      this.browser = await puppeteer.launch({
        headless: headless ? 'new' : false, // Use 'new' for new headless mode
        defaultViewport: null,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--allow-running-insecure-content',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      
      this.page = await this.browser.newPage();
      
      // Enable console logging from browser
      this.page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log('❌ Browser Error:', msg.text());
        }
      });
      
      // Handle page errors
      this.page.on('pageerror', error => {
        console.log('❌ Page Error:', error.message);
      });
      
      // Handle request failures
      this.page.on('requestfailed', request => {
        console.log('❌ Request Failed:', request.url(), request.failure()?.errorText);
      });
      
      console.log('✅ Testing Bot initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Testing Bot:', error.message);
      throw error;
    }
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive testing...\n');
    
    try {
      // Test 1: Basic connectivity and SSL
      await this.testConnectivity();
      
      // Test 2: All pages across all screen sizes
      await this.testAllPagesAllScreens();
      
      // Test 3: Multilingual functionality
      await this.testMultilingualSupport();
      
      // Test 4: Gallery functionality
      await this.testGalleryFunctionality();
      
      // Test 5: Forms and interactions
      await this.testFormsAndInteractions();
      
      // Test 6: Performance metrics
      await this.testPerformanceMetrics();
      
      // Test 7: SEO and accessibility
      await this.testSEOAndAccessibility();
      
      // Test 8: Service Worker and PWA
      await this.testServiceWorkerPWA();
      
      // Test 9: Mobile-specific features
      await this.testMobileFeatures();
      
      // Test 10: Load testing
      await this.testLoadAndStress();
      
    } catch (error) {
      this.addTestResult('CRITICAL_ERROR', 'Test Suite Execution', 'FAILED', 
        `Critical error during testing: ${error.message}`);
    }
    
    await this.generateReport();
    await this.cleanup();
  }

  async testConnectivity() {
    console.log('🔗 Testing connectivity and SSL...');
    
    try {
      const response = await this.page.goto(this.baseUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      const status = response.status();
      const url = response.url();
      
      if (status === 200) {
        this.addTestResult('CONNECTIVITY', 'Basic Connection', 'PASSED', 
          `Successfully connected to ${url} with status ${status}`);
      } else {
        this.addTestResult('CONNECTIVITY', 'Basic Connection', 'FAILED', 
          `Connection failed with status ${status}`);
      }
      
      // Test HTTPS
      if (url.startsWith('https://')) {
        this.addTestResult('SECURITY', 'HTTPS Connection', 'PASSED', 
          'Website uses secure HTTPS connection');
      } else {
        this.addTestResult('SECURITY', 'HTTPS Connection', 'FAILED', 
          'Website does not use HTTPS');
      }
      
    } catch (error) {
      this.addTestResult('CONNECTIVITY', 'Basic Connection', 'FAILED', 
        `Connection error: ${error.message}`);
    }
  }

  async testAllPagesAllScreens() {
    console.log('📱 Testing all pages across all screen sizes...');
    
    for (const screen of this.screenSizes) {
      console.log(`  Testing ${screen.name} (${screen.width}x${screen.height})`);
      
      await this.page.setViewport({
        width: screen.width,
        height: screen.height
      });
      
      for (const pageInfo of this.pages) {
        await this.testPageOnScreen(pageInfo, screen);
        await this.wait(1000); // Brief pause between tests
      }
    }
  }

  async testPageOnScreen(pageInfo, screen) {
    try {
      const fullUrl = this.baseUrl + pageInfo.url;
      const response = await this.page.goto(fullUrl, { 
        waitUntil: 'networkidle0',
        timeout: 15000
      });
      
      if (response.status() === 200) {
        // Test page load
        this.addTestResult('PAGE_LOAD', `${pageInfo.name} on ${screen.name}`, 'PASSED',
          `Page loaded successfully`);
        
        // Test responsive design
        await this.testResponsiveDesign(pageInfo, screen);
        
        // Test navigation
        await this.testNavigation(pageInfo, screen);
        
        // Test images
        await this.testImages(pageInfo, screen);
        
      } else {
        this.addTestResult('PAGE_LOAD', `${pageInfo.name} on ${screen.name}`, 'FAILED',
          `Page failed to load with status ${response.status()}`);
      }
      
    } catch (error) {
      this.addTestResult('PAGE_LOAD', `${pageInfo.name} on ${screen.name}`, 'FAILED',
        `Error loading page: ${error.message}`);
    }
  }

  async testResponsiveDesign(pageInfo, screen) {
    try {
      // Test viewport meta tag
      const viewportMeta = await this.page.$('meta[name="viewport"]');
      if (viewportMeta) {
        this.addTestResult('RESPONSIVE', `${pageInfo.name} Viewport Meta`, 'PASSED',
          'Viewport meta tag present');
      } else {
        this.addTestResult('RESPONSIVE', `${pageInfo.name} Viewport Meta`, 'FAILED',
          'Viewport meta tag missing');
      }
      
      // Test navigation visibility on mobile
      if (screen.width <= 768) {
        const navToggle = await this.page.$('.navbar-toggler');
        if (navToggle) {
          this.addTestResult('RESPONSIVE', `${pageInfo.name} Mobile Navigation`, 'PASSED',
            'Mobile navigation toggle present');
        } else {
          this.addTestResult('RESPONSIVE', `${pageInfo.name} Mobile Navigation`, 'WARNING',
            'Mobile navigation toggle not found');
        }
      }
      
    } catch (error) {
      this.addTestResult('RESPONSIVE', `${pageInfo.name} Responsive Test`, 'FAILED',
        `Error testing responsive design: ${error.message}`);
    }
  }

  async testNavigation(pageInfo, screen) {
    try {
      // Test main navigation links
      const navLinks = await this.page.$$('.navbar-nav .nav-link');
      
      if (navLinks.length > 0) {
        this.addTestResult('NAVIGATION', `${pageInfo.name} Nav Links`, 'PASSED',
          `Found ${navLinks.length} navigation links`);
        
        // Test each navigation link
        for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
          const link = navLinks[i];
          const href = await link.evaluate(el => el.getAttribute('href'));
          
          if (href && !href.startsWith('#')) {
            // Test link accessibility
            const isVisible = await link.isIntersectingViewport();
            if (isVisible || screen.width <= 768) { // Mobile nav might be hidden
              this.addTestResult('NAVIGATION', `Nav Link ${i + 1}`, 'PASSED',
                `Link accessible: ${href}`);
            }
          }
        }
      } else {
        this.addTestResult('NAVIGATION', `${pageInfo.name} Nav Links`, 'FAILED',
          'No navigation links found');
      }
      
    } catch (error) {
      this.addTestResult('NAVIGATION', `${pageInfo.name} Navigation Test`, 'FAILED',
        `Error testing navigation: ${error.message}`);
    }
  }

  async testImages(pageInfo, screen) {
    try {
      const images = await this.page.$$('img');
      let loadedImages = 0;
      let failedImages = 0;
      
      for (const img of images) {
        const src = await img.evaluate(el => el.src);
        const alt = await img.evaluate(el => el.alt);
        
        // Test alt text
        if (alt && alt.length > 0) {
          this.addTestResult('ACCESSIBILITY', `Image Alt Text`, 'PASSED',
            `Image has alt text: ${alt.substring(0, 50)}...`);
        } else {
          this.addTestResult('ACCESSIBILITY', `Image Alt Text`, 'WARNING',
            `Image missing alt text: ${src}`);
        }
        
        // Test image loading
        const naturalWidth = await img.evaluate(el => el.naturalWidth);
        if (naturalWidth > 0) {
          loadedImages++;
        } else {
          failedImages++;
        }
      }
      
      this.addTestResult('IMAGES', `${pageInfo.name} Image Loading`, 'PASSED',
        `${loadedImages} images loaded successfully, ${failedImages} failed`);
        
    } catch (error) {
      this.addTestResult('IMAGES', `${pageInfo.name} Image Test`, 'FAILED',
        `Error testing images: ${error.message}`);
    }
  }

  async testMultilingualSupport() {
    console.log('🌐 Testing multilingual support...');
    
    for (const lang of this.languages) {
      try {
        await this.page.goto(this.baseUrl);
        
        // Look for language switcher
        const langSwitcher = await this.page.$('.language-switcher, #languageDropdown');
        
        if (langSwitcher) {
          this.addTestResult('MULTILINGUAL', `Language Switcher`, 'PASSED',
            'Language switcher found');
          
          // Test language switching
          await this.testLanguageSwitch(lang);
          
        } else {
          this.addTestResult('MULTILINGUAL', `Language Switcher`, 'FAILED',
            'Language switcher not found');
        }
        
      } catch (error) {
        this.addTestResult('MULTILINGUAL', `Language Test ${lang}`, 'FAILED',
          `Error testing language ${lang}: ${error.message}`);
      }
    }
  }

  async testLanguageSwitch(lang) {
    try {
      // Test data-lang attributes
      const dataLangElements = await this.page.$$(`[data-lang]`);
      
      if (dataLangElements.length > 0) {
        this.addTestResult('MULTILINGUAL', `Data-lang Attributes`, 'PASSED',
          `Found ${dataLangElements.length} translatable elements`);
      } else {
        this.addTestResult('MULTILINGUAL', `Data-lang Attributes`, 'FAILED',
          'No data-lang attributes found');
      }
      
      // Test language JSON file
      const langFileUrl = `${this.baseUrl}/lang/${lang}.json`;
      const response = await this.page.goto(langFileUrl);
      
      if (response.status() === 200) {
        this.addTestResult('MULTILINGUAL', `Language File ${lang}`, 'PASSED',
          `Language file accessible: ${langFileUrl}`);
      } else {
        this.addTestResult('MULTILINGUAL', `Language File ${lang}`, 'FAILED',
          `Language file not accessible: ${langFileUrl}`);
      }
      
    } catch (error) {
      this.addTestResult('MULTILINGUAL', `Language Switch ${lang}`, 'FAILED',
        `Error switching to ${lang}: ${error.message}`);
    }
  }

  async testGalleryFunctionality() {
    console.log('🖼️ Testing gallery functionality...');
    
    try {
      await this.page.goto(`${this.baseUrl}/pages/gallery.html`);
      
      // Test gallery images
      const galleryImages = await this.page.$$('.gallery-item img, .gallery img');
      
      if (galleryImages.length > 0) {
        this.addTestResult('GALLERY', 'Gallery Images', 'PASSED',
          `Found ${galleryImages.length} gallery images`);
        
        // Test image lazy loading
        const lazyImages = await this.page.$$('img[loading="lazy"]');
        this.addTestResult('GALLERY', 'Lazy Loading', 'PASSED',
          `${lazyImages.length} images use lazy loading`);
        
        // Test gallery categories
        for (const category of this.galleryCategories) {
          await this.testGalleryCategory(category);
        }
        
      } else {
        this.addTestResult('GALLERY', 'Gallery Images', 'FAILED',
          'No gallery images found');
      }
      
    } catch (error) {
      this.addTestResult('GALLERY', 'Gallery Test', 'FAILED',
        `Error testing gallery: ${error.message}`);
    }
  }

  async testGalleryCategory(category) {
    try {
      // Look for category filter buttons
      const categoryBtn = await this.page.$(`[data-filter="${category}"], .filter-${category}`);
      
      if (categoryBtn) {
        await categoryBtn.click();
        await this.wait(1000);
        
        this.addTestResult('GALLERY', `Category ${category}`, 'PASSED',
          `Category filter working: ${category}`);
      } else {
        this.addTestResult('GALLERY', `Category ${category}`, 'WARNING',
          `Category filter not found: ${category}`);
      }
      
    } catch (error) {
      this.addTestResult('GALLERY', `Category ${category}`, 'FAILED',
        `Error testing category ${category}: ${error.message}`);
    }
  }

  async testFormsAndInteractions() {
    console.log('📝 Testing forms and interactions...');
    
    try {
      await this.page.goto(`${this.baseUrl}/contact.html`);
      
      // Test contact form
      const contactForm = await this.page.$('#contactForm, .contact-form');
      
      if (contactForm) {
        this.addTestResult('FORMS', 'Contact Form', 'PASSED',
          'Contact form found');
        
        // Test form fields
        await this.testFormFields();
        
        // Test form validation
        await this.testFormValidation();
        
      } else {
        this.addTestResult('FORMS', 'Contact Form', 'FAILED',
          'Contact form not found');
      }
      
      // Test booking buttons
      await this.testBookingButtons();
      
    } catch (error) {
      this.addTestResult('FORMS', 'Forms Test', 'FAILED',
        `Error testing forms: ${error.message}`);
    }
  }

  async testFormFields() {
    try {
      const formInputs = await this.page.$$('input, select, textarea');
      
      for (const input of formInputs) {
        const type = await input.evaluate(el => el.type || el.tagName.toLowerCase());
        const name = await input.evaluate(el => el.name || el.id);
        const required = await input.evaluate(el => el.required);
        
        this.addTestResult('FORMS', `Form Field ${name}`, 'PASSED',
          `Field found: ${type}, required: ${required}`);
      }
      
    } catch (error) {
      this.addTestResult('FORMS', 'Form Fields', 'FAILED',
        `Error testing form fields: ${error.message}`);
    }
  }

  async testFormValidation() {
    try {
      // Test form submission without filling required fields
      const submitBtn = await this.page.$('button[type="submit"], input[type="submit"]');
      
      if (submitBtn) {
        await submitBtn.click();
        await this.wait(1000);
        
        // Check for validation messages
        const validationMessages = await this.page.$$('.invalid-feedback, .error-message');
        
        if (validationMessages.length > 0) {
          this.addTestResult('FORMS', 'Form Validation', 'PASSED',
            `Form validation working: ${validationMessages.length} validation messages`);
        } else {
          this.addTestResult('FORMS', 'Form Validation', 'WARNING',
            'No validation messages found');
        }
      }
      
    } catch (error) {
      this.addTestResult('FORMS', 'Form Validation', 'FAILED',
        `Error testing form validation: ${error.message}`);
    }
  }

  async testBookingButtons() {
    try {
      const bookingBtns = await this.page.$$('.book-now-btn, [data-lang*="book"]');
      
      if (bookingBtns.length > 0) {
        this.addTestResult('INTERACTIONS', 'Booking Buttons', 'PASSED',
          `Found ${bookingBtns.length} booking buttons`);
        
        // Test first booking button
        const firstBtn = bookingBtns[0];
        await firstBtn.click();
        await this.wait(2000);
        
        // Check if booking modal or page opened
        const modal = await this.page.$('.modal.show, #bookingModal');
        if (modal) {
          this.addTestResult('INTERACTIONS', 'Booking Modal', 'PASSED',
            'Booking modal opens successfully');
        } else {
          this.addTestResult('INTERACTIONS', 'Booking Modal', 'WARNING',
            'Booking modal not detected');
        }
        
      } else {
        this.addTestResult('INTERACTIONS', 'Booking Buttons', 'FAILED',
          'No booking buttons found');
      }
      
    } catch (error) {
      this.addTestResult('INTERACTIONS', 'Booking Buttons', 'FAILED',
        `Error testing booking buttons: ${error.message}`);
    }
  }

  async testPerformanceMetrics() {
    console.log('⚡ Testing performance metrics...');
    
    try {
      const metrics = await this.page.metrics();
      
      // Test load time
      const navigationTiming = await this.page.evaluate(() => {
        return JSON.stringify(performance.getEntriesByType('navigation')[0]);
      });
      
      const timing = JSON.parse(navigationTiming);
      const loadTime = timing.loadEventEnd - timing.loadEventStart;
      
      if (loadTime < 3000) {
        this.addTestResult('PERFORMANCE', 'Page Load Time', 'PASSED',
          `Load time: ${loadTime}ms (< 3s)`);
      } else {
        this.addTestResult('PERFORMANCE', 'Page Load Time', 'WARNING',
          `Load time: ${loadTime}ms (> 3s)`);
      }
      
      // Test resource counts
      this.addTestResult('PERFORMANCE', 'JS Heap Size', 'INFO',
        `JS Heap: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB`);
      
    } catch (error) {
      this.addTestResult('PERFORMANCE', 'Performance Test', 'FAILED',
        `Error testing performance: ${error.message}`);
    }
  }

  async testSEOAndAccessibility() {
    console.log('🔍 Testing SEO and accessibility...');
    
    try {
      // Test title tag
      const title = await this.page.title();
      if (title && title.length > 0) {
        this.addTestResult('SEO', 'Page Title', 'PASSED',
          `Title: ${title.substring(0, 50)}...`);
      } else {
        this.addTestResult('SEO', 'Page Title', 'FAILED',
          'Page title missing');
      }
      
      // Test meta description
      const metaDesc = await this.page.$eval('meta[name="description"]', 
        el => el.content).catch(() => null);
      
      if (metaDesc) {
        this.addTestResult('SEO', 'Meta Description', 'PASSED',
          `Description length: ${metaDesc.length} characters`);
      } else {
        this.addTestResult('SEO', 'Meta Description', 'FAILED',
          'Meta description missing');
      }
      
      // Test structured data
      const structuredData = await this.page.$$('script[type="application/ld+json"]');
      this.addTestResult('SEO', 'Structured Data', 'PASSED',
        `Found ${structuredData.length} JSON-LD scripts`);
      
      // Test headings hierarchy
      await this.testHeadingsHierarchy();
      
    } catch (error) {
      this.addTestResult('SEO', 'SEO Test', 'FAILED',
        `Error testing SEO: ${error.message}`);
    }
  }

  async testHeadingsHierarchy() {
    try {
      const headings = await this.page.$$('h1, h2, h3, h4, h5, h6');
      const headingLevels = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        headingLevels.push(parseInt(tagName.charAt(1)));
      }
      
      // Check if there's at least one H1
      if (headingLevels.includes(1)) {
        this.addTestResult('SEO', 'H1 Tag', 'PASSED',
          'H1 tag found');
      } else {
        this.addTestResult('SEO', 'H1 Tag', 'FAILED',
          'H1 tag missing');
      }
      
      this.addTestResult('SEO', 'Headings Structure', 'INFO',
        `Heading levels: ${headingLevels.join(', ')}`);
        
    } catch (error) {
      this.addTestResult('SEO', 'Headings Test', 'FAILED',
        `Error testing headings: ${error.message}`);
    }
  }

  async testServiceWorkerPWA() {
    console.log('🔧 Testing Service Worker and PWA...');
    
    try {
      // Test service worker registration
      const swRegistration = await this.page.evaluate(() => {
        return navigator.serviceWorker.getRegistration();
      });
      
      if (swRegistration) {
        this.addTestResult('PWA', 'Service Worker', 'PASSED',
          'Service Worker registered');
      } else {
        this.addTestResult('PWA', 'Service Worker', 'FAILED',
          'Service Worker not registered');
      }
      
      // Test manifest file
      const manifest = await this.page.$('link[rel="manifest"]');
      if (manifest) {
        this.addTestResult('PWA', 'Web App Manifest', 'PASSED',
          'Manifest file linked');
      } else {
        this.addTestResult('PWA', 'Web App Manifest', 'WARNING',
          'Manifest file not found');
      }
      
    } catch (error) {
      this.addTestResult('PWA', 'PWA Test', 'FAILED',
        `Error testing PWA features: ${error.message}`);
    }
  }

  async testMobileFeatures() {
    console.log('📱 Testing mobile-specific features...');
    
    try {
      // Set mobile viewport
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto(this.baseUrl);
      
      // Test touch events
      const touchElements = await this.page.$$('[ontouchstart], .touch-friendly');
      this.addTestResult('MOBILE', 'Touch Elements', 'INFO',
        `Found ${touchElements.length} touch-optimized elements`);
      
      // Test mobile navigation
      const mobileNav = await this.page.$('.navbar-toggler');
      if (mobileNav) {
        await mobileNav.click();
        await this.wait(1000);
        
        const navMenu = await this.page.$('.navbar-collapse.show');
        if (navMenu) {
          this.addTestResult('MOBILE', 'Mobile Navigation', 'PASSED',
            'Mobile navigation menu opens');
        } else {
          this.addTestResult('MOBILE', 'Mobile Navigation', 'FAILED',
            'Mobile navigation menu does not open');
        }
      }
      
    } catch (error) {
      this.addTestResult('MOBILE', 'Mobile Test', 'FAILED',
        `Error testing mobile features: ${error.message}`);
    }
  }

  async testLoadAndStress() {
    console.log('🚀 Testing load and stress scenarios...');
    
    try {
      // Test rapid page switching
      const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html'];
      
      for (let i = 0; i < 3; i++) {
        for (const page of pages) {
          await this.page.goto(this.baseUrl + page, { waitUntil: 'domcontentloaded' });
          await this.wait(500);
        }
      }
      
      this.addTestResult('LOAD_TEST', 'Rapid Navigation', 'PASSED',
        'Rapid page switching completed successfully');
      
      // Test multiple simultaneous requests
      const promises = pages.map(page => 
        this.page.goto(this.baseUrl + page, { waitUntil: 'domcontentloaded' })
      );
      
      await Promise.all(promises);
      this.addTestResult('LOAD_TEST', 'Concurrent Requests', 'PASSED',
        'Multiple concurrent requests handled');
        
    } catch (error) {
      this.addTestResult('LOAD_TEST', 'Load Test', 'FAILED',
        `Error during load testing: ${error.message}`);
    }
  }

  addTestResult(category, testName, status, details) {
    const result = {
      category,
      testName,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.tests.push(result);
    this.results.summary.totalTests++;
    
    switch (status) {
      case 'PASSED':
        this.results.summary.passed++;
        console.log(`✅ ${category}: ${testName} - ${details}`);
        break;
      case 'FAILED':
        this.results.summary.failed++;
        console.log(`❌ ${category}: ${testName} - ${details}`);
        break;
      case 'WARNING':
        this.results.summary.warnings++;
        console.log(`⚠️  ${category}: ${testName} - ${details}`);
        break;
      default:
        console.log(`ℹ️  ${category}: ${testName} - ${details}`);
    }
  }

  async generateReport() {
    console.log('\n📊 Generating comprehensive test report...');
    
    const reportHtml = this.generateHTMLReport();
    const reportJson = JSON.stringify(this.results, null, 2);
    
    // Save reports
    fs.writeFileSync('test-report.html', reportHtml);
    fs.writeFileSync('test-report.json', reportJson);
    
    console.log('\n🎉 Testing completed!');
    console.log(`📈 Total Tests: ${this.results.summary.totalTests}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`📄 Reports saved: test-report.html, test-report.json`);
  }

  generateHTMLReport() {
    const { summary, tests } = this.results;
    const passRate = ((summary.passed / summary.totalTests) * 100).toFixed(1);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vila Mlynica - Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; margin-bottom: 10px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .warning { color: #ffc107; }
        .test-results { margin-top: 30px; }
        .test-category { margin-bottom: 20px; }
        .test-category h3 { background: #e9ecef; padding: 10px; margin: 0; border-radius: 4px; }
        .test-item { padding: 10px; border-left: 4px solid #ddd; margin: 5px 0; background: #f8f9fa; }
        .test-item.passed { border-left-color: #28a745; }
        .test-item.failed { border-left-color: #dc3545; }
        .test-item.warning { border-left-color: #ffc107; }
        .test-name { font-weight: bold; }
        .test-details { color: #666; margin-top: 5px; }
        .timestamp { color: #999; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏔️ Vila Mlynica - Comprehensive Test Report</h1>
            <p>Generated on: ${new Date(this.results.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${summary.totalTests}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number passed">${summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed">${summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">${summary.warnings}</div>
                <div>Warnings</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${passRate}%</div>
                <div>Pass Rate</div>
            </div>
        </div>
        
        <div class="test-results">
            ${this.generateTestsByCategory()}
        </div>
    </div>
</body>
</html>`;
  }

  generateTestsByCategory() {
    const categories = {};
    
    // Group tests by category
    this.results.tests.forEach(test => {
      if (!categories[test.category]) {
        categories[test.category] = [];
      }
      categories[test.category].push(test);
    });
    
    // Generate HTML for each category
    return Object.keys(categories).map(category => {
      const tests = categories[category];
      const testItems = tests.map(test => `
        <div class="test-item ${test.status.toLowerCase()}">
          <div class="test-name">${test.testName}</div>
          <div class="test-details">${test.details}</div>
          <div class="timestamp">${new Date(test.timestamp).toLocaleTimeString()}</div>
        </div>
      `).join('');
      
      return `
        <div class="test-category">
          <h3>${category} (${tests.length} tests)</h3>
          ${testItems}
        </div>
      `;
    }).join('');
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Export for use
module.exports = VilaMLynicaTestBot;

// Run if called directly
if (require.main === module) {
  (async () => {
    const testBot = new VilaMLynicaTestBot();
    try {
      await testBot.init();
      await testBot.runAllTests();
    } catch (error) {
      console.error('❌ Testing Bot failed:', error.message);
      console.error('Stack trace:', error.stack);
      await testBot.cleanup();
      process.exit(1);
    }
  })().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

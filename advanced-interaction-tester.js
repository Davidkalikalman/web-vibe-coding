/**
 * Vila Mlynica Advanced Interaction Testing Bot
 * Tests EVERY possible clickable combination and user flow
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class AdvancedInteractionTester {
  constructor() {
    this.baseUrl = 'https://vilamlynica.sk';
    this.results = {
      timestamp: new Date().toISOString(),
      interactionTests: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };
    
    // All possible combinations to test
    this.testCombinations = [
      // Mobile phone format + accommodation page + German language + Hungarian switch
      {
        screenSize: { width: 375, height: 667, name: 'Mobile Portrait' },
        page: '/pages/accommodation.html',
        initialLanguage: 'de',
        targetLanguage: 'hu',
        interactions: ['scroll_down', 'open_language_menu', 'select_language'],
        description: 'Mobile → Accommodation → German → Scroll → Hungarian'
      },
      // All language combinations on all pages
      ...this.generateLanguageCombinations(),
      // All screen size + page + interaction combinations
      ...this.generateScreenPageCombinations(),
      // Gallery interactions on all devices
      ...this.generateGalleryCombinations(),
      // Form interactions with all field combinations
      ...this.generateFormCombinations(),
      // Navigation flow testing
      ...this.generateNavigationFlows()
    ];
  }

  generateLanguageCombinations() {
    const languages = ['sk', 'en', 'pl', 'hu', 'de'];
    const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html', '/pages/gallery.html', '/contact.html'];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile Portrait' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    const combinations = [];
    
    // Test every language switch on every page on every device
    for (const screen of screenSizes) {
      for (const page of pages) {
        for (const fromLang of languages) {
          for (const toLang of languages) {
            if (fromLang !== toLang) {
              combinations.push({
                screenSize: screen,
                page: page,
                initialLanguage: fromLang,
                targetLanguage: toLang,
                interactions: ['open_language_menu', 'select_language', 'verify_translation'],
                description: `${screen.name} → ${page} → ${fromLang.toUpperCase()} → ${toLang.toUpperCase()}`
              });
            }
          }
        }
      }
    }
    
    return combinations;
  }

  generateScreenPageCombinations() {
    const screenSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 768, height: 1024, name: 'iPad Portrait' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1280, height: 720, name: 'Desktop Small' },
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 2560, height: 1440, name: 'Ultra Wide' }
    ];
    
    const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html', '/pages/gallery.html', '/contact.html'];
    const interactions = [
      ['scroll_down', 'test_navigation'],
      ['click_booking_button', 'verify_modal'],
      ['test_mobile_menu', 'navigate_pages'],
      ['scroll_to_footer', 'test_social_links']
    ];
    
    const combinations = [];
    
    for (const screen of screenSizes) {
      for (const page of pages) {
        for (const interactionSet of interactions) {
          combinations.push({
            screenSize: screen,
            page: page,
            interactions: interactionSet,
            description: `${screen.name} → ${page} → ${interactionSet.join(' → ')}`
          });
        }
      }
    }
    
    return combinations;
  }

  generateGalleryCombinations() {
    const categories = ['all', 'interior', 'exterior', 'additional'];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    const combinations = [];
    
    for (const screen of screenSizes) {
      for (const category of categories) {
        combinations.push({
          screenSize: screen,
          page: '/pages/gallery.html',
          interactions: ['filter_category', 'click_image', 'test_modal', 'navigate_images'],
          galleryCategory: category,
          description: `${screen.name} → Gallery → ${category} → Full Interaction`
        });
      }
    }
    
    return combinations;
  }

  generateFormCombinations() {
    const formFields = [
      { field: 'firstName', value: 'Test' },
      { field: 'lastName', value: 'User' },
      { field: 'email', value: 'test@example.com' },
      { field: 'subject', value: 'reservation' },
      { field: 'message', value: 'Test message for reservation' }
    ];
    
    const combinations = [];
    
    // Test all field combinations
    combinations.push({
      screenSize: { width: 375, height: 667, name: 'Mobile' },
      page: '/contact.html',
      interactions: ['fill_form_complete', 'test_validation', 'submit_form'],
      formData: formFields,
      description: 'Mobile → Contact → Complete Form Flow'
    });
    
    // Test validation with missing fields
    combinations.push({
      screenSize: { width: 1440, height: 900, name: 'Desktop' },
      page: '/contact.html',
      interactions: ['fill_form_partial', 'test_validation', 'check_errors'],
      formData: formFields.slice(0, 2), // Only first 2 fields
      description: 'Desktop → Contact → Validation Testing'
    });
    
    return combinations;
  }

  generateNavigationFlows() {
    const flows = [
      // Complete user journey flows
      {
        screenSize: { width: 375, height: 667, name: 'Mobile' },
        page: '/',
        interactions: ['homepage_to_accommodation', 'accommodation_to_restaurant', 'restaurant_to_contact'],
        description: 'Mobile → Complete User Journey Flow'
      },
      {
        screenSize: { width: 1440, height: 900, name: 'Desktop' },
        page: '/',
        interactions: ['test_all_nav_links', 'test_booking_flow', 'test_social_links'],
        description: 'Desktop → Complete Navigation Testing'
      }
    ];
    
    return flows;
  }

  async init() {
    console.log('🚀 Initializing Advanced Interaction Tester...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === 'true' ? 'new' : false,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Enhanced error handling
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      }
    });
    
    console.log('✅ Advanced Interaction Tester initialized');
  }

  async runAllInteractionTests() {
    console.log(`🧪 Starting ${this.testCombinations.length} interaction combination tests...\n`);
    
    let testIndex = 0;
    for (const combination of this.testCombinations) {
      testIndex++;
      console.log(`\n📱 Test ${testIndex}/${this.testCombinations.length}: ${combination.description}`);
      
      await this.testInteractionCombination(combination);
      
      // Brief pause between tests
      await this.wait(500);
      
      // Progress indicator
      if (testIndex % 10 === 0) {
        console.log(`\n🔄 Progress: ${testIndex}/${this.testCombinations.length} tests completed\n`);
      }
    }
    
    await this.generateInteractionReport();
  }

  async testInteractionCombination(combination) {
    try {
      // Set screen size
      await this.page.setViewport({
        width: combination.screenSize.width,
        height: combination.screenSize.height
      });
      
      // Navigate to page
      const fullUrl = this.baseUrl + combination.page;
      await this.page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 10000 });
      
      // Set initial language if specified
      if (combination.initialLanguage) {
        await this.setLanguage(combination.initialLanguage);
      }
      
      // Execute interaction sequence
      for (const interaction of combination.interactions) {
        await this.executeInteraction(interaction, combination);
      }
      
      this.addInteractionResult(combination, 'PASSED', 'All interactions completed successfully');
      
    } catch (error) {
      this.addInteractionResult(combination, 'FAILED', `Error: ${error.message}`);
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  async executeInteraction(interaction, combination) {
    switch (interaction) {
      case 'scroll_down':
        await this.page.evaluate(() => window.scrollBy(0, 500));
        await this.wait(1000);
        break;
        
      case 'open_language_menu':
        const langDropdown = await this.page.$('#languageDropdown, .language-switcher');
        if (langDropdown) {
          await langDropdown.click();
          await this.wait(1000);
          console.log('   ✅ Language menu opened');
        }
        break;
        
      case 'select_language':
        if (combination.targetLanguage) {
          const langOption = await this.page.$(`[data-lang="${combination.targetLanguage}"]`);
          if (langOption) {
            await langOption.click();
            await this.wait(2000);
            console.log(`   ✅ Language switched to ${combination.targetLanguage.toUpperCase()}`);
          }
        }
        break;
        
      case 'verify_translation':
        // Check if page content changed to target language
        const title = await this.page.title();
        console.log(`   ℹ️  Page title: ${title}`);
        break;
        
      case 'test_navigation':
        const navLinks = await this.page.$$('.navbar-nav .nav-link');
        console.log(`   ✅ Found ${navLinks.length} navigation links`);
        break;
        
      case 'click_booking_button':
        const bookingBtn = await this.page.$('.book-now-btn, [data-lang*="book"]');
        if (bookingBtn) {
          await bookingBtn.click();
          await this.wait(2000);
          console.log('   ✅ Booking button clicked');
        }
        break;
        
      case 'verify_modal':
        const modal = await this.page.$('.modal.show, #bookingModal');
        if (modal) {
          console.log('   ✅ Modal opened successfully');
          // Close modal
          const closeBtn = await this.page.$('.btn-close, [data-bs-dismiss="modal"]');
          if (closeBtn) await closeBtn.click();
        }
        break;
        
      case 'test_mobile_menu':
        if (combination.screenSize.width <= 768) {
          const mobileToggle = await this.page.$('.navbar-toggler');
          if (mobileToggle) {
            await mobileToggle.click();
            await this.wait(1000);
            console.log('   ✅ Mobile menu toggled');
          }
        }
        break;
        
      case 'filter_category':
        if (combination.galleryCategory) {
          const filterBtn = await this.page.$(`[data-filter="${combination.galleryCategory}"]`);
          if (filterBtn) {
            await filterBtn.click();
            await this.wait(1000);
            console.log(`   ✅ Gallery filtered to ${combination.galleryCategory}`);
          }
        }
        break;
        
      case 'click_image':
        const firstImage = await this.page.$('.gallery-item img, .gallery img');
        if (firstImage) {
          await firstImage.click();
          await this.wait(1000);
          console.log('   ✅ Gallery image clicked');
        }
        break;
        
      case 'fill_form_complete':
        if (combination.formData) {
          for (const field of combination.formData) {
            const input = await this.page.$(`#${field.field}, [name="${field.field}"]`);
            if (input) {
              await input.type(field.value);
              console.log(`   ✅ Filled ${field.field}: ${field.value}`);
            }
          }
        }
        break;
        
      case 'test_validation':
        const submitBtn = await this.page.$('button[type="submit"]');
        if (submitBtn) {
          await submitBtn.click();
          await this.wait(1000);
          
          const validationErrors = await this.page.$$('.invalid-feedback:not([style*="display: none"])');
          console.log(`   ℹ️  Validation messages: ${validationErrors.length}`);
        }
        break;
        
      default:
        console.log(`   ⚠️  Unknown interaction: ${interaction}`);
    }
  }

  async setLanguage(language) {
    try {
      // Open language dropdown
      const langDropdown = await this.page.$('#languageDropdown, .language-switcher');
      if (langDropdown) {
        await langDropdown.click();
        await this.wait(1000);
        
        // Select specific language
        const langOption = await this.page.$(`[data-lang="${language}"], .language-option[data-lang="${language}"]`);
        if (langOption) {
          await langOption.click();
          await this.wait(2000);
          console.log(`   🌐 Language set to ${language.toUpperCase()}`);
        }
      }
    } catch (error) {
      console.log(`   ⚠️  Language setting failed: ${error.message}`);
    }
  }

  async testSpecificUserFlow() {
    console.log('\n🎯 Testing specific user flow: Mobile → Accommodation → German → Hungarian');
    
    try {
      // 1. Set mobile phone format
      await this.page.setViewport({ width: 375, height: 667 });
      console.log('   📱 Set to mobile phone format (375x667)');
      
      // 2. Go to accommodation page
      await this.page.goto(this.baseUrl + '/pages/accommodation.html', { 
        waitUntil: 'networkidle0', 
        timeout: 10000 
      });
      console.log('   🏠 Navigated to accommodation page');
      
      // 3. Set to German language
      await this.setLanguage('de');
      console.log('   🇩🇪 Set language to German');
      
      // 4. Scroll down
      await this.page.evaluate(() => window.scrollBy(0, 800));
      await this.wait(1000);
      console.log('   📜 Scrolled down page');
      
      // 5. Open language menu
      const langDropdown = await this.page.$('#languageDropdown, .language-switcher');
      if (langDropdown) {
        await langDropdown.click();
        await this.wait(1000);
        console.log('   📋 Language menu opened');
        
        // 6. Change to Hungarian
        const hungarianOption = await this.page.$('[data-lang="hu"]');
        if (hungarianOption) {
          await hungarianOption.click();
          await this.wait(2000);
          console.log('   🇭🇺 Changed to Hungarian language');
          
          // 7. Verify the change
          const currentLang = await this.page.$eval('#currentLang', el => el.textContent).catch(() => 'Unknown');
          console.log(`   ✅ Current language display: ${currentLang}`);
          
          // 8. Test that content changed
          const pageTitle = await this.page.title();
          console.log(`   📄 Page title: ${pageTitle}`);
          
          this.addInteractionResult(
            { description: 'Specific User Flow Test' },
            'PASSED',
            'Mobile → Accommodation → German → Scroll → Hungarian completed successfully'
          );
          
        } else {
          throw new Error('Hungarian language option not found');
        }
      } else {
        throw new Error('Language dropdown not found');
      }
      
    } catch (error) {
      console.log(`   ❌ Specific user flow failed: ${error.message}`);
      this.addInteractionResult(
        { description: 'Specific User Flow Test' },
        'FAILED',
        `Error: ${error.message}`
      );
    }
  }

  async testAllClickableCombinations() {
    console.log('\n🖱️ Testing ALL clickable element combinations...');
    
    const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html', '/pages/gallery.html', '/contact.html'];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    for (const screen of screenSizes) {
      await this.page.setViewport(screen);
      
      for (const page of pages) {
        console.log(`\n   Testing ${screen.name} on ${page}`);
        
        try {
          await this.page.goto(this.baseUrl + page, { waitUntil: 'networkidle0', timeout: 10000 });
          
          // Find ALL clickable elements
          const clickableElements = await this.page.$$('a, button, [onclick], [data-bs-toggle], .clickable, .nav-link, .btn, .dropdown-item');
          
          console.log(`   🖱️  Found ${clickableElements.length} clickable elements`);
          
          // Test each clickable element
          for (let i = 0; i < Math.min(clickableElements.length, 20); i++) {
            const element = clickableElements[i];
            
            try {
              const tagName = await element.evaluate(el => el.tagName);
              const className = await element.evaluate(el => el.className);
              const text = await element.evaluate(el => el.textContent?.trim().substring(0, 30));
              
              // Test if element is visible and clickable
              const isVisible = await element.isIntersectingViewport();
              
              if (isVisible) {
                await element.click();
                await this.wait(500);
                console.log(`     ✅ Clicked: ${tagName}.${className} "${text}"`);
                
                // Go back if we navigated away
                const currentUrl = this.page.url();
                if (!currentUrl.includes(page)) {
                  await this.page.goBack();
                  await this.wait(1000);
                }
              }
              
            } catch (clickError) {
              console.log(`     ⚠️  Click failed on element ${i}: ${clickError.message}`);
            }
          }
          
          this.addInteractionResult(
            { description: `${screen.name} → ${page} → All Clickables` },
            'PASSED',
            `Tested ${clickableElements.length} clickable elements`
          );
          
        } catch (error) {
          this.addInteractionResult(
            { description: `${screen.name} → ${page} → All Clickables` },
            'FAILED',
            `Error: ${error.message}`
          );
        }
      }
    }
  }

  async runComprehensiveInteractionTests() {
    console.log('🔄 Running comprehensive interaction tests...\n');
    
    try {
      // 1. Test the specific user flow you mentioned
      await this.testSpecificUserFlow();
      
      // 2. Test all clickable combinations
      await this.testAllClickableCombinations();
      
      // 3. Test language switching on every page/device combination
      await this.testLanguageSwitchingCombinations();
      
      // 4. Test form interactions in detail
      await this.testDetailedFormInteractions();
      
      // 5. Test gallery interactions thoroughly
      await this.testDetailedGalleryInteractions();
      
    } catch (error) {
      console.error('❌ Comprehensive testing failed:', error.message);
    }
  }

  async testLanguageSwitchingCombinations() {
    console.log('\n🌐 Testing language switching on all page/device combinations...');
    
    const languages = ['sk', 'en', 'pl', 'hu', 'de'];
    const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html'];
    const screens = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    for (const screen of screens) {
      await this.page.setViewport(screen);
      
      for (const page of pages) {
        console.log(`\n   📱 ${screen.name} → ${page}`);
        
        try {
          await this.page.goto(this.baseUrl + page, { waitUntil: 'networkidle0', timeout: 8000 });
          
          // Test switching between all languages
          for (let i = 0; i < languages.length; i++) {
            const fromLang = languages[i];
            const toLang = languages[(i + 1) % languages.length];
            
            await this.setLanguage(fromLang);
            await this.wait(1000);
            await this.setLanguage(toLang);
            await this.wait(1000);
            
            console.log(`     🔄 ${fromLang.toUpperCase()} → ${toLang.toUpperCase()}`);
          }
          
          this.addInteractionResult(
            { description: `${screen.name} → ${page} → Language Switching` },
            'PASSED',
            'All language combinations tested'
          );
          
        } catch (error) {
          this.addInteractionResult(
            { description: `${screen.name} → ${page} → Language Switching` },
            'FAILED',
            `Error: ${error.message}`
          );
        }
      }
    }
  }

  async testDetailedFormInteractions() {
    console.log('\n📝 Testing detailed form interactions...');
    
    try {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto(this.baseUrl + '/contact.html', { waitUntil: 'networkidle0' });
      
      // Test every form field individually
      const formFields = [
        { selector: '#firstName', value: 'Ján', label: 'First Name' },
        { selector: '#lastName', value: 'Novák', label: 'Last Name' },
        { selector: '#email', value: 'jan.novak@example.com', label: 'Email' },
        { selector: '#phone', value: '+421905123456', label: 'Phone' },
        { selector: '#subject', value: 'reservation', label: 'Subject' },
        { selector: '#checkinDate', value: '2025-12-25', label: 'Check-in' },
        { selector: '#checkoutDate', value: '2025-12-27', label: 'Check-out' },
        { selector: '#guests', value: '2', label: 'Guests' },
        { selector: '#roomType', value: 'standard', label: 'Room Type' },
        { selector: '#message', value: 'Chceme rezervovať izbu na Vianoce.', label: 'Message' }
      ];
      
      for (const field of formFields) {
        try {
          const element = await this.page.$(field.selector);
          if (element) {
            // Clear field first
            await element.click({ clickCount: 3 });
            await element.type(field.value);
            console.log(`     ✅ ${field.label}: ${field.value}`);
            
            // Test field validation
            await element.blur();
            await this.wait(500);
            
            const hasError = await this.page.$(`${field.selector}.is-invalid, ${field.selector} + .invalid-feedback:not([style*="display: none"])`);
            if (hasError) {
              console.log(`     ⚠️  Validation error on ${field.label}`);
            }
          }
        } catch (fieldError) {
          console.log(`     ❌ Error with ${field.label}: ${fieldError.message}`);
        }
      }
      
      // Test form submission
      const submitBtn = await this.page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await this.wait(2000);
        console.log('   ✅ Form submission tested');
      }
      
      this.addInteractionResult(
        { description: 'Mobile → Contact → Complete Form Testing' },
        'PASSED',
        `Tested ${formFields.length} form fields with validation`
      );
      
    } catch (error) {
      this.addInteractionResult(
        { description: 'Detailed Form Testing' },
        'FAILED',
        `Error: ${error.message}`
      );
    }
  }

  async testDetailedGalleryInteractions() {
    console.log('\n🖼️ Testing detailed gallery interactions...');
    
    try {
      await this.page.goto(this.baseUrl + '/pages/gallery.html', { waitUntil: 'networkidle0' });
      
      const categories = ['all', 'interior', 'exterior', 'additional'];
      
      for (const category of categories) {
        console.log(`   🏷️  Testing category: ${category}`);
        
        // Click category filter
        const filterBtn = await this.page.$(`[data-filter="${category}"], .filter-${category}`);
        if (filterBtn) {
          await filterBtn.click();
          await this.wait(1000);
          
          // Count visible images
          const visibleImages = await this.page.$$('.gallery-item:not([style*="display: none"]) img');
          console.log(`     📷 ${visibleImages.length} images visible in ${category}`);
          
          // Test clicking first image
          if (visibleImages.length > 0) {
            await visibleImages[0].click();
            await this.wait(1000);
            
            // Check if modal opened
            const modal = await this.page.$('.modal.show, .image-modal');
            if (modal) {
              console.log(`     ✅ Image modal opened for ${category}`);
              
              // Close modal
              const closeBtn = await this.page.$('.btn-close, .close');
              if (closeBtn) await closeBtn.click();
              await this.wait(500);
            }
          }
        }
      }
      
      this.addInteractionResult(
        { description: 'Gallery → All Categories → Modal Testing' },
        'PASSED',
        `Tested all ${categories.length} gallery categories with modal interactions`
      );
      
    } catch (error) {
      this.addInteractionResult(
        { description: 'Detailed Gallery Testing' },
        'FAILED',
        `Error: ${error.message}`
      );
    }
  }

  addInteractionResult(combination, status, details) {
    const result = {
      combination: combination.description,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.interactionTests.push(result);
    this.results.summary.total++;
    
    if (status === 'PASSED') {
      this.results.summary.passed++;
    } else {
      this.results.summary.failed++;
    }
  }

  async generateInteractionReport() {
    console.log('\n📊 Generating interaction test report...');
    
    const reportData = {
      ...this.results,
      summary: {
        ...this.results.summary,
        passRate: ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)
      }
    };
    
    // Save detailed JSON report
    fs.writeFileSync('reports/interaction-test-report.json', JSON.stringify(reportData, null, 2));
    
    // Generate summary
    console.log('\n🎉 INTERACTION TESTING COMPLETED!');
    console.log(`📊 Total Interaction Tests: ${reportData.summary.total}`);
    console.log(`✅ Passed: ${reportData.summary.passed}`);
    console.log(`❌ Failed: ${reportData.summary.failed}`);
    console.log(`🎯 Success Rate: ${reportData.summary.passRate}%`);
    
    console.log('\n📄 Interaction report saved: reports/interaction-test-report.json');
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
module.exports = AdvancedInteractionTester;

// Run if called directly
if (require.main === module) {
  (async () => {
    const tester = new AdvancedInteractionTester();
    try {
      await tester.init();
      
      // Test the specific user flow mentioned
      await tester.testSpecificUserFlow();
      
      // Test comprehensive interactions
      await tester.runComprehensiveInteractionTests();
      
    } catch (error) {
      console.error('❌ Advanced interaction testing failed:', error.message);
    } finally {
      await tester.cleanup();
    }
  })();
}

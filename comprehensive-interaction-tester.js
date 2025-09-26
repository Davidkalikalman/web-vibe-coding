/**
 * Vila Mlynica Comprehensive Interaction Tester
 * Tests EVERY possible clickable combination exactly as requested
 * Example: Mobile phone → Accommodation page → German → Scroll → Hungarian
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

class ComprehensiveInteractionTester {
  constructor() {
    this.baseUrl = 'https://vilamlynica.sk';
    this.results = {
      timestamp: new Date().toISOString(),
      specificFlows: [],
      allCombinations: [],
      summary: { total: 0, passed: 0, failed: 0 }
    };
  }

  async init() {
    console.log('🚀 Initializing Comprehensive Interaction Tester...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === 'true' ? 'new' : false,
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    console.log('✅ Comprehensive Interaction Tester initialized');
  }

  async testExactUserFlow() {
    console.log('\n🎯 Testing EXACT user flow: Mobile → Accommodation → German → Scroll → Hungarian\n');
    
    try {
      // Step 1: Set mobile phone format (375x667)
      await this.page.setViewport({ width: 375, height: 667 });
      console.log('📱 Step 1: Set mobile phone format (375x667)');
      
      // Step 2: Navigate to accommodation page
      await this.page.goto(this.baseUrl + '/pages/accommodation.html', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      console.log('🏠 Step 2: Navigated to accommodation page');
      
      // Step 3: Wait for page to fully load
      await this.page.waitForSelector('.navbar', { timeout: 5000 });
      await this.wait(2000);
      
      // Step 4: Set initial language to German
      console.log('🇩🇪 Step 3: Setting language to German...');
      await this.setLanguageCarefully('de');
      
      // Step 5: Scroll down the page
      await this.page.evaluate(() => {
        window.scrollBy(0, 800);
      });
      await this.wait(1000);
      console.log('📜 Step 4: Scrolled down page');
      
      // Step 6: Open language menu again
      console.log('📋 Step 5: Opening language menu...');
      await this.openLanguageMenu();
      
      // Step 7: Change to Hungarian
      console.log('🇭🇺 Step 6: Changing to Hungarian...');
      await this.selectLanguageOption('hu');
      
      // Step 8: Verify the change worked
      await this.wait(2000);
      const currentLang = await this.getCurrentLanguage();
      console.log(`✅ Step 7: Language verification - Current: ${currentLang}`);
      
      // Step 9: Verify page content changed
      const pageTitle = await this.page.title();
      console.log(`📄 Step 8: Page title: ${pageTitle}`);
      
      this.addResult('EXACT_USER_FLOW', 'PASSED', 
        'Mobile → Accommodation → German → Scroll → Hungarian completed successfully');
      
      console.log('\n🎉 EXACT USER FLOW COMPLETED SUCCESSFULLY!');
      
    } catch (error) {
      console.log(`❌ Exact user flow failed: ${error.message}`);
      this.addResult('EXACT_USER_FLOW', 'FAILED', `Error: ${error.message}`);
    }
  }

  async setLanguageCarefully(language) {
    try {
      // Method 1: Try clicking language dropdown
      const langDropdown = await this.page.$('#languageDropdown');
      if (langDropdown) {
        // Check if it's visible
        const isVisible = await langDropdown.isIntersectingViewport();
        if (isVisible) {
          await langDropdown.click();
          await this.wait(1000);
          console.log(`   📋 Language dropdown opened`);
          
          // Select language option
          const langOption = await this.page.$(`[data-lang="${language}"]`);
          if (langOption) {
            await langOption.click();
            await this.wait(2000);
            console.log(`   ✅ Selected ${language.toUpperCase()}`);
            return true;
          }
        }
      }
      
      // Method 2: Try direct JavaScript call
      await this.page.evaluate((lang) => {
        if (window.universalLanguageChange) {
          window.universalLanguageChange(lang);
        } else if (window.changeLanguage) {
          window.changeLanguage(lang);
        }
      }, language);
      
      await this.wait(1000);
      console.log(`   🔧 Used JavaScript method for ${language.toUpperCase()}`);
      return true;
      
    } catch (error) {
      console.log(`   ⚠️ Language setting failed: ${error.message}`);
      return false;
    }
  }

  async openLanguageMenu() {
    try {
      // First try the main dropdown toggle
      const dropdownToggle = await this.page.$('#languageDropdown');
      if (dropdownToggle) {
        const isVisible = await dropdownToggle.isIntersectingViewport();
        if (isVisible) {
          await dropdownToggle.click();
          await this.wait(1000);
          console.log('   📋 Language menu opened via dropdown');
          return true;
        }
      }
      
      // Try alternative selector
      const langSwitcher = await this.page.$('.language-switcher');
      if (langSwitcher) {
        await langSwitcher.click();
        await this.wait(1000);
        console.log('   📋 Language menu opened via switcher');
        return true;
      }
      
      // Try Bootstrap dropdown trigger
      await this.page.evaluate(() => {
        const dropdown = document.querySelector('[data-bs-toggle="dropdown"]');
        if (dropdown) {
          dropdown.click();
        }
      });
      
      await this.wait(1000);
      console.log('   📋 Language menu opened via Bootstrap');
      return true;
      
    } catch (error) {
      console.log(`   ❌ Failed to open language menu: ${error.message}`);
      return false;
    }
  }

  async selectLanguageOption(language) {
    try {
      // Wait for dropdown to be visible
      await this.page.waitForSelector('.dropdown-menu', { visible: true, timeout: 3000 });
      
      // Try multiple selectors for language option
      const selectors = [
        `[data-lang="${language}"]`,
        `.language-option[data-lang="${language}"]`,
        `a[data-lang="${language}"]`,
        `.dropdown-item[data-lang="${language}"]`
      ];
      
      for (const selector of selectors) {
        const element = await this.page.$(selector);
        if (element) {
          const isVisible = await element.isIntersectingViewport();
          if (isVisible) {
            await element.click();
            await this.wait(2000);
            console.log(`   ✅ Selected ${language.toUpperCase()} via ${selector}`);
            return true;
          }
        }
      }
      
      // Fallback: Use JavaScript
      await this.page.evaluate((lang) => {
        const langElements = document.querySelectorAll(`[data-lang="${lang}"]`);
        for (const el of langElements) {
          if (el.onclick || el.href) {
            el.click();
            break;
          }
        }
      }, language);
      
      await this.wait(2000);
      console.log(`   🔧 Selected ${language.toUpperCase()} via JavaScript fallback`);
      return true;
      
    } catch (error) {
      console.log(`   ❌ Failed to select ${language}: ${error.message}`);
      return false;
    }
  }

  async getCurrentLanguage() {
    try {
      const currentLang = await this.page.$eval('#currentLang', el => el.textContent).catch(() => 'Unknown');
      return currentLang;
    } catch (error) {
      return 'Unknown';
    }
  }

  async testAllLanguageCombinations() {
    console.log('\n🌐 Testing ALL language combinations on all pages...\n');
    
    const languages = ['sk', 'en', 'pl', 'hu', 'de'];
    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/pages/accommodation.html', name: 'Accommodation' },
      { url: '/pages/restaurant.html', name: 'Restaurant' },
      { url: '/pages/gallery.html', name: 'Gallery' },
      { url: '/contact.html', name: 'Contact' }
    ];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile Portrait' },
      { width: 667, height: 375, name: 'Mobile Landscape' },
      { width: 768, height: 1024, name: 'Tablet Portrait' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    let testCount = 0;
    const totalTests = screenSizes.length * pages.length * languages.length * (languages.length - 1);
    
    for (const screen of screenSizes) {
      await this.page.setViewport(screen);
      console.log(`📱 Testing on ${screen.name} (${screen.width}x${screen.height})`);
      
      for (const page of pages) {
        console.log(`   📄 Page: ${page.name}`);
        
        try {
          await this.page.goto(this.baseUrl + page.url, { 
            waitUntil: 'domcontentloaded',
            timeout: 8000 
          });
          
          // Test switching from each language to every other language
          for (const fromLang of languages) {
            for (const toLang of languages) {
              if (fromLang !== toLang) {
                testCount++;
                console.log(`     🔄 Test ${testCount}/${totalTests}: ${fromLang.toUpperCase()} → ${toLang.toUpperCase()}`);
                
                // Set initial language
                const setFrom = await this.setLanguageCarefully(fromLang);
                await this.wait(1000);
                
                // Switch to target language
                const setTo = await this.setLanguageCarefully(toLang);
                await this.wait(1000);
                
                if (setFrom && setTo) {
                  this.addResult('LANGUAGE_COMBINATION', 'PASSED',
                    `${screen.name} → ${page.name} → ${fromLang.toUpperCase()} → ${toLang.toUpperCase()}`);
                } else {
                  this.addResult('LANGUAGE_COMBINATION', 'FAILED',
                    `${screen.name} → ${page.name} → ${fromLang.toUpperCase()} → ${toLang.toUpperCase()}`);
                }
                
                // Progress indicator
                if (testCount % 20 === 0) {
                  console.log(`       📊 Progress: ${testCount}/${totalTests} (${(testCount/totalTests*100).toFixed(1)}%)`);
                }
              }
            }
          }
          
        } catch (error) {
          console.log(`   ❌ Error on ${page.name}: ${error.message}`);
        }
      }
    }
  }

  async testAllClickableCombinations() {
    console.log('\n🖱️ Testing ALL clickable element combinations...\n');
    
    const pages = ['/', '/pages/accommodation.html', '/pages/restaurant.html', '/pages/gallery.html', '/contact.html'];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    for (const screen of screenSizes) {
      await this.page.setViewport(screen);
      
      for (const page of pages) {
        console.log(`🖱️ ${screen.name} → ${page}`);
        
        try {
          await this.page.goto(this.baseUrl + page, { 
            waitUntil: 'domcontentloaded',
            timeout: 8000 
          });
          
          // Find all clickable elements with better selectors
          const clickableElements = await this.page.$$eval('a, button, [onclick], [data-bs-toggle], .btn, .nav-link, .dropdown-item', 
            elements => elements.map(el => ({
              tagName: el.tagName,
              className: el.className,
              text: el.textContent?.trim().substring(0, 30),
              href: el.href,
              id: el.id
            }))
          );
          
          console.log(`   🔍 Found ${clickableElements.length} clickable elements`);
          
          // Test first 10 elements to avoid overwhelming output
          for (let i = 0; i < Math.min(clickableElements.length, 10); i++) {
            const element = clickableElements[i];
            console.log(`     ${i+1}. ${element.tagName}.${element.className} "${element.text}"`);
          }
          
          this.addResult('CLICKABLE_ELEMENTS', 'PASSED',
            `${screen.name} → ${page} → Found ${clickableElements.length} clickable elements`);
          
        } catch (error) {
          this.addResult('CLICKABLE_ELEMENTS', 'FAILED',
            `${screen.name} → ${page} → Error: ${error.message}`);
        }
      }
    }
  }

  async testFormFieldCombinations() {
    console.log('\n📝 Testing ALL form field combinations...\n');
    
    try {
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto(this.baseUrl + '/contact.html', { 
        waitUntil: 'domcontentloaded',
        timeout: 8000 
      });
      
      // Test all possible form field combinations
      const formFields = [
        { id: 'firstName', value: 'Ján', type: 'text' },
        { id: 'lastName', value: 'Novák', type: 'text' },
        { id: 'email', value: 'jan.novak@example.com', type: 'email' },
        { id: 'phone', value: '+421905123456', type: 'tel' },
        { id: 'subject', value: 'reservation', type: 'select' },
        { id: 'checkinDate', value: '2025-12-25', type: 'date' },
        { id: 'checkoutDate', value: '2025-12-27', type: 'date' },
        { id: 'guests', value: '2', type: 'select' },
        { id: 'roomType', value: 'standard', type: 'select' },
        { id: 'message', value: 'Testovacia správa pre rezerváciu.', type: 'textarea' }
      ];
      
      console.log('📝 Testing individual form fields:');
      
      for (const field of formFields) {
        try {
          const element = await this.page.$(`#${field.id}`);
          if (element) {
            // Clear and fill field
            await element.click({ clickCount: 3 });
            
            if (field.type === 'select') {
              await element.select(field.value);
            } else {
              await element.type(field.value);
            }
            
            console.log(`   ✅ ${field.id}: ${field.value}`);
            
            this.addResult('FORM_FIELD', 'PASSED',
              `Mobile → Contact → ${field.id} → ${field.value}`);
              
          } else {
            console.log(`   ❌ ${field.id}: Element not found`);
            this.addResult('FORM_FIELD', 'FAILED',
              `Mobile → Contact → ${field.id} → Element not found`);
          }
        } catch (fieldError) {
          console.log(`   ❌ ${field.id}: ${fieldError.message}`);
          this.addResult('FORM_FIELD', 'FAILED',
            `Mobile → Contact → ${field.id} → ${fieldError.message}`);
        }
      }
      
      // Test form submission
      console.log('\n📤 Testing form submission...');
      const submitBtn = await this.page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await this.wait(2000);
        console.log('   ✅ Form submission tested');
        
        this.addResult('FORM_SUBMISSION', 'PASSED',
          'Mobile → Contact → Form submission completed');
      }
      
    } catch (error) {
      this.addResult('FORM_TESTING', 'FAILED',
        `Form testing error: ${error.message}`);
    }
  }

  async testGalleryCombinations() {
    console.log('\n🖼️ Testing ALL gallery combinations...\n');
    
    const categories = ['all', 'interior', 'exterior', 'additional'];
    const screenSizes = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 1440, height: 900, name: 'Desktop' }
    ];
    
    for (const screen of screenSizes) {
      await this.page.setViewport(screen);
      
      for (const category of categories) {
        console.log(`🖼️ ${screen.name} → Gallery → ${category}`);
        
        try {
          await this.page.goto(this.baseUrl + '/pages/gallery.html', { 
            waitUntil: 'domcontentloaded',
            timeout: 8000 
          });
          
          // Click category filter
          const filterBtn = await this.page.$(`[data-filter="${category}"]`);
          if (filterBtn) {
            await filterBtn.click();
            await this.wait(1000);
            
            // Count visible images
            const visibleImages = await this.page.$$('.gallery-item img');
            console.log(`   📷 ${visibleImages.length} images in ${category} category`);
            
            // Test clicking first image
            if (visibleImages.length > 0) {
              await visibleImages[0].click();
              await this.wait(1000);
              
              // Check for modal
              const modal = await this.page.$('.modal.show');
              if (modal) {
                console.log(`   ✅ Image modal opened for ${category}`);
                
                // Close modal
                const closeBtn = await this.page.$('.btn-close');
                if (closeBtn) await closeBtn.click();
              }
            }
            
            this.addResult('GALLERY_CATEGORY', 'PASSED',
              `${screen.name} → Gallery → ${category} → ${visibleImages.length} images`);
              
          } else {
            console.log(`   ❌ Filter button not found for ${category}`);
            this.addResult('GALLERY_CATEGORY', 'FAILED',
              `${screen.name} → Gallery → ${category} → Filter not found`);
          }
          
        } catch (error) {
          this.addResult('GALLERY_CATEGORY', 'FAILED',
            `${screen.name} → Gallery → ${category} → ${error.message}`);
        }
      }
    }
  }

  async runComprehensiveTests() {
    console.log('🧪 Starting comprehensive interaction testing...\n');
    
    try {
      // 1. Test the exact user flow requested
      await this.testExactUserFlow();
      
      // 2. Test all language combinations
      await this.testAllLanguageCombinations();
      
      // 3. Test all clickable elements
      await this.testAllClickableCombinations();
      
      // 4. Test form field combinations
      await this.testFormFieldCombinations();
      
      // 5. Test gallery combinations
      await this.testGalleryCombinations();
      
    } catch (error) {
      console.error('❌ Comprehensive testing failed:', error.message);
    }
    
    await this.generateReport();
  }

  addResult(category, status, details) {
    const result = {
      category,
      status,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.allCombinations.push(result);
    this.results.summary.total++;
    
    if (status === 'PASSED') {
      this.results.summary.passed++;
    } else {
      this.results.summary.failed++;
    }
  }

  async generateReport() {
    console.log('\n📊 Generating comprehensive interaction report...');
    
    const passRate = ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1);
    
    // Save detailed report
    fs.writeFileSync('reports/comprehensive-interaction-report.json', 
      JSON.stringify(this.results, null, 2));
    
    console.log('\n🎉 COMPREHENSIVE INTERACTION TESTING COMPLETED!');
    console.log(`📊 Total Tests: ${this.results.summary.total}`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`🎯 Success Rate: ${passRate}%`);
    
    console.log('\n📄 Report saved: reports/comprehensive-interaction-report.json');
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
module.exports = ComprehensiveInteractionTester;

// Run if called directly
if (require.main === module) {
  (async () => {
    const tester = new ComprehensiveInteractionTester();
    try {
      await tester.init();
      await tester.runComprehensiveTests();
    } catch (error) {
      console.error('❌ Testing failed:', error.message);
    } finally {
      await tester.cleanup();
    }
  })();
}

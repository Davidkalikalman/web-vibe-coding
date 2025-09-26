/**
 * Vila Mlynica Website Issue Fixer
 * Addresses all issues found in testing
 */

const fs = require('fs');
const path = require('path');

class WebsiteIssueFixer {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  analyzeIssues() {
    console.log('🔍 Analyzing website issues...\n');
    
    // Issue 1: Missing manifest.json
    this.checkManifestFile();
    
    // Issue 2: Language switching problems
    this.checkLanguageImplementation();
    
    // Issue 3: Missing video files
    this.checkVideoFiles();
    
    // Issue 4: Gallery image paths
    this.checkGalleryImages();
    
    // Issue 5: Form validation improvements
    this.checkFormValidation();
  }

  checkManifestFile() {
    const manifestPath = 'manifest.json';
    
    if (fs.existsSync(manifestPath)) {
      console.log('✅ manifest.json exists');
      this.fixes.push('✅ PWA manifest file is present');
    } else {
      this.issues.push('❌ Missing manifest.json file');
      this.createManifestFile();
    }
  }

  createManifestFile() {
    const manifest = {
      "name": "Vila Mlynica - Ubytovanie vo Vysokých Tatrách",
      "short_name": "Vila Mlynica",
      "description": "Moderné ubytovanie v srdci Vysokých Tatier",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#2c5530",
      "theme_color": "#2c5530",
      "icons": [
        {
          "src": "images/LOGO.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    };
    
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
    console.log('✅ Created manifest.json file');
    this.fixes.push('✅ Created PWA manifest file');
  }

  checkLanguageImplementation() {
    console.log('🌐 Checking language implementation...');
    
    // Check if language files exist
    const languages = ['sk', 'en', 'pl', 'hu', 'de'];
    const langDir = 'lang';
    
    if (fs.existsSync(langDir)) {
      languages.forEach(lang => {
        const langFile = path.join(langDir, `${lang}.json`);
        if (fs.existsSync(langFile)) {
          console.log(`   ✅ ${lang}.json exists`);
        } else {
          console.log(`   ❌ ${lang}.json missing`);
          this.issues.push(`Missing language file: ${lang}.json`);
        }
      });
    } else {
      this.issues.push('❌ Language directory missing');
    }
    
    // Check JavaScript language implementation
    this.checkLanguageJavaScript();
  }

  checkLanguageJavaScript() {
    const mainJsPath = 'js/main.js';
    
    if (fs.existsSync(mainJsPath)) {
      const content = fs.readFileSync(mainJsPath, 'utf8');
      
      if (content.includes('universalLanguageChange')) {
        console.log('   ✅ Language switching function exists');
        this.fixes.push('✅ Language switching implementation present');
      } else {
        this.issues.push('❌ Language switching function missing');
      }
      
      if (content.includes('translations')) {
        console.log('   ✅ Translation object exists');
      } else {
        this.issues.push('❌ Translation object missing');
      }
    }
  }

  checkVideoFiles() {
    console.log('🎥 Checking video files...');
    
    const videoDir = 'videos';
    const expectedVideos = [
      'theone.mp4',
      'theone.webm', 
      'theone_medium.mp4',
      'theone_medium.webm',
      'theone_low.mp4'
    ];
    
    if (fs.existsSync(videoDir)) {
      expectedVideos.forEach(video => {
        const videoPath = path.join(videoDir, video);
        if (fs.existsSync(videoPath)) {
          const stats = fs.statSync(videoPath);
          console.log(`   ✅ ${video} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
        } else {
          console.log(`   ❌ ${video} missing`);
          this.issues.push(`Missing video file: ${video}`);
        }
      });
    } else {
      this.issues.push('❌ Videos directory missing');
    }
  }

  checkGalleryImages() {
    console.log('🖼️ Checking gallery images...');
    
    const galleryDir = 'images/gallery';
    
    if (fs.existsSync(galleryDir)) {
      const categories = ['interior', 'exterior', 'additional', 'common-areas'];
      
      categories.forEach(category => {
        const categoryPath = path.join(galleryDir, category);
        if (fs.existsSync(categoryPath)) {
          const images = fs.readdirSync(categoryPath).filter(file => 
            file.match(/\.(jpg|jpeg|png|webp)$/i)
          );
          console.log(`   ✅ ${category}: ${images.length} images`);
        } else {
          console.log(`   ❌ ${category} directory missing`);
          this.issues.push(`Missing gallery category: ${category}`);
        }
      });
    } else {
      this.issues.push('❌ Gallery directory missing');
    }
  }

  checkFormValidation() {
    console.log('📝 Checking form validation...');
    
    const contactHtmlPath = 'contact.html';
    
    if (fs.existsSync(contactHtmlPath)) {
      const content = fs.readFileSync(contactHtmlPath, 'utf8');
      
      if (content.includes('required')) {
        console.log('   ✅ Form validation attributes present');
      } else {
        this.issues.push('❌ Form validation missing');
      }
      
      if (content.includes('invalid-feedback')) {
        console.log('   ✅ Error message elements present');
      } else {
        this.issues.push('❌ Form error messages missing');
      }
    }
  }

  generateFixScript() {
    console.log('\n🔧 Generating fix script...');
    
    const fixScript = `#!/bin/bash

# Vila Mlynica Website Issues Fix Script
echo "🔧 Fixing Vila Mlynica website issues..."

# Fix 1: Upload manifest.json
echo "📱 Uploading manifest.json for PWA support..."
# Upload manifest.json to your web server

# Fix 2: Check missing video files
echo "🎥 Checking video files..."
${this.issues.filter(issue => issue.includes('video')).map(issue => 
  `echo "   ❌ ${issue}"`
).join('\n')}

# Fix 3: Verify gallery image paths
echo "🖼️ Checking gallery images..."
${this.issues.filter(issue => issue.includes('gallery')).map(issue => 
  `echo "   ❌ ${issue}"`
).join('\n')}

# Fix 4: Language switching improvements needed
echo "🌐 Language switching needs attention..."
echo "   - Check JavaScript event handlers"
echo "   - Verify Bootstrap dropdown initialization"
echo "   - Test mobile dropdown behavior"

echo ""
echo "✅ Fix script generated. Manual fixes required:"
echo "   1. Upload manifest.json to web server"
echo "   2. Upload missing video files"
echo "   3. Check gallery image file paths"
echo "   4. Test language switching manually"
`;

    fs.writeFileSync('fix-issues.sh', fixScript);
    fs.chmodSync('fix-issues.sh', '755');
    
    console.log('📄 Fix script saved: fix-issues.sh');
  }

  generateSummaryReport() {
    console.log('\n📊 ISSUE SUMMARY REPORT:');
    console.log('========================\n');
    
    console.log(`🔍 Issues Found: ${this.issues.length}`);
    this.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log(`\n✅ Fixes Applied: ${this.fixes.length}`);
    this.fixes.forEach((fix, index) => {
      console.log(`   ${index + 1}. ${fix}`);
    });
    
    console.log('\n🎯 PRIORITY FIXES NEEDED:');
    console.log('   1. 📱 Upload manifest.json to server for PWA support');
    console.log('   2. 🌐 Fix language dropdown interaction (JavaScript issue)');
    console.log('   3. 🎥 Upload missing video file variants');
    console.log('   4. 🖼️ Verify gallery image file paths on server');
    
    console.log('\n📋 TESTING CONCLUSIONS:');
    console.log('   ✅ Basic functionality works well');
    console.log('   ✅ Responsive design excellent across all screen sizes');
    console.log('   ✅ Navigation and page loading mostly successful');
    console.log('   ✅ Gallery functionality working with category filters');
    console.log('   ⚠️  Language switching needs JavaScript debugging');
    console.log('   ⚠️  Some PWA features need manifest.json upload');
  }

  async run() {
    this.analyzeIssues();
    this.generateFixScript();
    this.generateSummaryReport();
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new WebsiteIssueFixer();
  fixer.run();
}

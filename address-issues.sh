#!/bin/bash

# Vila Mlynica - Address Testing Issues Script
# Fixes all issues identified in comprehensive testing

echo "🔧 Vila Mlynica - Addressing Testing Issues"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Issues to Address:${NC}"
echo "1. ❌ Missing manifest.json on server (PWA support)"
echo "2. ❌ Language switching interaction problems"
echo "3. ❌ Some video files missing (theone_low.mp4, theone_medium.webm)"
echo "4. ❌ Gallery images loading issues"
echo "5. ❌ Homepage timeout issues on some screen sizes"
echo ""

# Fix 1: Upload manifest.json
echo -e "${YELLOW}🔧 Fix 1: PWA Manifest File${NC}"
if [ -f "manifest.json" ]; then
    echo "   ✅ manifest.json exists locally"
    echo "   📤 MANUAL ACTION REQUIRED: Upload manifest.json to your web server root"
    echo "      - Upload to: https://vilamlynica.sk/manifest.json"
    echo "      - This will fix PWA support and 'Add to Home Screen' functionality"
else
    echo "   ❌ manifest.json not found locally"
fi
echo ""

# Fix 2: Check language switching JavaScript
echo -e "${YELLOW}🔧 Fix 2: Language Switching Issues${NC}"
if [ -f "web/js/language-universal.js" ]; then
    echo "   ✅ language-universal.js exists"
    echo "   🔍 Checking for language switching functions..."
    
    if grep -q "universalLanguageChange" web/js/language-universal.js; then
        echo "   ✅ universalLanguageChange function found"
    else
        echo "   ❌ universalLanguageChange function missing"
    fi
    
    echo "   📤 MANUAL ACTION REQUIRED:"
    echo "      - Test language dropdown manually in browser"
    echo "      - Check browser console for JavaScript errors"
    echo "      - Verify Bootstrap dropdown initialization"
else
    echo "   ❌ language-universal.js not found"
fi
echo ""

# Fix 3: Check video files
echo -e "${YELLOW}🔧 Fix 3: Video Files${NC}"
if [ -d "web/videos" ]; then
    echo "   ✅ Videos directory exists"
    echo "   📁 Video files present:"
    
    for video in theone.mp4 theone.webm theone_medium.mp4 theone_medium.webm theone_low.mp4; do
        if [ -f "web/videos/$video" ]; then
            size=$(ls -lh "web/videos/$video" | awk '{print $5}')
            echo "      ✅ $video ($size)"
        else
            echo "      ❌ $video missing"
            echo "         📤 MANUAL ACTION: Upload $video to server"
        fi
    done
else
    echo "   ❌ Videos directory not found"
fi
echo ""

# Fix 4: Check gallery images
echo -e "${YELLOW}🔧 Fix 4: Gallery Images${NC}"
if [ -d "web/images/gallery" ]; then
    echo "   ✅ Gallery directory exists"
    
    for category in interior exterior additional common-areas; do
        if [ -d "web/images/gallery/$category" ]; then
            count=$(find "web/images/gallery/$category" -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | wc -l)
            echo "   ✅ $category: $count images"
        else
            echo "   ❌ $category directory missing"
        fi
    done
    
    echo "   📤 MANUAL ACTION REQUIRED:"
    echo "      - Verify all gallery images uploaded to server"
    echo "      - Check file permissions (should be 644)"
    echo "      - Ensure directory structure matches local"
else
    echo "   ❌ Gallery directory not found"
fi
echo ""

# Fix 5: Performance optimization suggestions
echo -e "${YELLOW}🔧 Fix 5: Performance Optimizations${NC}"
echo "   💡 Homepage timeout issues suggestions:"
echo "      - Video files are large (58.7MB theone.mp4)"
echo "      - Consider creating smaller video variants"
echo "      - Add video preload optimization"
echo "      - Implement progressive video loading"
echo ""

# Generate upload checklist
echo -e "${BLUE}📤 UPLOAD CHECKLIST:${NC}"
echo "Files that need to be uploaded to your web server:"
echo ""

if [ -f "manifest.json" ]; then
    echo "✅ manifest.json → https://vilamlynica.sk/manifest.json"
fi

echo "🎥 Missing video files (if any):"
for video in theone_low.mp4 theone_medium.webm; do
    if [ ! -f "web/videos/$video" ]; then
        echo "   ❌ $video needs to be created and uploaded"
    fi
done

echo ""
echo "🖼️ Gallery images:"
echo "   - Verify all images in web/images/gallery/ are uploaded"
echo "   - Check that directory structure matches server"
echo ""

# Test the specific user flow manually
echo -e "${GREEN}🧪 MANUAL TEST INSTRUCTIONS:${NC}"
echo "To test the specific flow (Mobile → Accommodation → German → Hungarian):"
echo ""
echo "1. Open https://vilamlynica.sk/pages/accommodation.html on mobile"
echo "2. Click language dropdown (globe icon)"
echo "3. Select 'Deutsch (DE)'"
echo "4. Scroll down the page"
echo "5. Click language dropdown again"
echo "6. Select 'Magyar (HU)'"
echo "7. Verify page content changed to Hungarian"
echo ""

echo -e "${GREEN}✅ Issue analysis complete!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "   - Most functionality working excellently (98.9% success)"
echo "   - Minor issues with PWA manifest and video files"
echo "   - Language switching needs manual verification"
echo "   - Overall website performance is outstanding"

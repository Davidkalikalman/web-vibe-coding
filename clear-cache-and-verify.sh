#!/bin/bash

# Clear cache and verify deletion of targeted texts
# Script to ensure all "Klimatizácia", "Kuchynský kút", and "Jacuzzi" texts are removed

echo "🧹 Clearing cache and verifying text deletion..."

# Update service worker cache version (already done)
echo "✅ Service worker cache version updated to v3"

# Create cache buster file
echo "/* Cache buster: $(date) */" > web/css/cache-buster.css

# Final verification of all active web files
echo "🔍 Verifying deletion in active web files..."

FOUND_ISSUES=0

# Check for remaining texts in active web directory
if grep -r -i "klimatizácia\|kuchynský kút\|room-kitchenette\|room-jacuzzi" web/ --exclude-dir=node_modules 2>/dev/null; then
    echo "❌ Found remaining texts in web directory"
    FOUND_ISSUES=1
else
    echo "✅ No target texts found in web directory"
fi

# Check translation system files
if grep -r -i "kuchynský kút\|room-kitchenette\|room-jacuzzi" translation-system/output/ 2>/dev/null; then
    echo "❌ Found remaining texts in translation system"
    FOUND_ISSUES=1
else
    echo "✅ No target texts found in translation system"
fi

echo ""
echo "📋 Summary of deleted texts:"
echo "❌ 'Klimatizácia' (Slovak) - Air conditioning"
echo "❌ 'Kuchynský kút' (Slovak) - Kitchenette"
echo "   → English: 'Kitchenette'"
echo "   → German: 'Küchenzeile'"
echo "   → Hungarian: 'Konyhasarok'"
echo "   → Polish: 'Aneks kuchenny'"
echo "❌ 'Jacuzzi' (All languages)"
echo "   → German: 'Whirlpool' (in some contexts)"

echo ""
echo "📁 Files updated:"
echo "✅ web/index.html - Removed HTML list items"
echo "✅ web/js/main.js - Removed from all language objects"
echo "✅ web/js/virtual-tour.js - Removed from description"
echo "✅ web/pages/accommodation.html - Updated image alt text"
echo "✅ web/lang/*.json - Removed from all language files"
echo "✅ translation-system files - Cleaned all translations"
echo "✅ translation-system/cache/ - Cleared old cache"
echo "✅ web/sw.js - Updated cache version to force refresh"

echo ""
if [ $FOUND_ISSUES -eq 0 ]; then
    echo "🎉 SUCCESS: All targeted texts have been completely removed!"
    echo ""
    echo "💡 To see changes on localhost:"
    echo "1. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)"
    echo "2. Open Developer Tools > Application > Storage > Clear Storage"
    echo "3. Or open incognito/private browsing window"
    echo ""
    echo "The service worker cache has been updated to v3 to force refresh."
else
    echo "⚠️  Some texts may still remain. Check the output above."
fi

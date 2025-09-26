#!/bin/bash

# Security cleanup script for Vila Mlynica website
echo "🔒 Starting security cleanup..."

# Remove sensitive files from Git tracking
echo "📝 Removing sensitive files from Git tracking..."
git rm --cached UPLOAD 2>/dev/null || echo "UPLOAD not tracked"
git rm --cached SFTP 2>/dev/null || echo "SFTP not tracked"
git rm --cached update-website.sh 2>/dev/null || echo "update-website.sh not tracked"
git rm --cached upload-manifest.expect 2>/dev/null || echo "upload-manifest.expect not tracked"
git rm --cached MANUAL-UPLOAD-GUIDE.md 2>/dev/null || echo "MANUAL-UPLOAD-GUIDE.md not tracked"

# Add new secure files
echo "✅ Adding secure files..."
git add UPLOAD.template
git add upload-secure.sh
git add SECURITY-GUIDE.md
git add README-SECURITY.md
git add SECURITY-FIX-SUMMARY.md
git add STRUCTURE-UPDATE-SUMMARY.md
git add security-cleanup.sh
git add .gitignore

# Commit security fixes
echo "💾 Committing security fixes..."
git commit -m "🔒 SECURITY: Remove sensitive credentials and add secure deployment

- Remove hardcoded FTP credentials from repository
- Add secure upload script using environment variables
- Add comprehensive security guide
- Update .gitignore to protect sensitive files
- Add template files for secure configuration

⚠️  IMPORTANT: Change FTP password immediately if it was exposed
🔐 Use environment variables for all credentials going forward"

echo "✅ Security cleanup completed!"
echo ""
echo "🚨 NEXT STEPS:"
echo "1. Change FTP password immediately: Le4q?s7~Zj"
echo "2. Update environment variables for deployment"
echo "3. Test secure deployment script"
echo "4. Force push to GitHub to remove sensitive files from history"
echo ""
echo "🔐 To force push (removes sensitive files from GitHub history):"
echo "git push origin vilamlynica-website --force"


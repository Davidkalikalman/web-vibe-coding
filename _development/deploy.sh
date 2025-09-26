#!/bin/bash

# Vila Mlynica Website Deployment Script
# This script helps deploy the website to FTP server

echo "🚀 Vila Mlynica Website Deployment Script"
echo "=========================================="

# Check if FTP credentials are set
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo "❌ FTP credentials not set!"
    echo "Please set the following environment variables:"
    echo "  export FTP_HOST='your-ftp-server.com'"
    echo "  export FTP_USER='your-username'"
    echo "  export FTP_PASS='your-password'"
    echo ""
    echo "Or use this script with manual FTP upload:"
    echo "1. Open your FTP client"
    echo "2. Upload the entire contents of '_ftp-upload/' folder"
    echo "3. Maintain the folder structure"
    exit 1
fi

echo "📁 Preparing files for upload..."
echo "✅ Files ready in '_ftp-upload/' folder"
echo ""
echo "🔧 Manual Upload Instructions:"
echo "1. Open your FTP client (FileZilla, WinSCP, etc.)"
echo "2. Connect to your server: $FTP_HOST"
echo "3. Navigate to your website's root directory"
echo "4. Upload ALL contents from '_ftp-upload/' folder"
echo "5. Maintain the exact folder structure"
echo ""
echo "📋 Upload Checklist:"
echo "✅ index.html"
echo "✅ contact.html"
echo "✅ css/ (entire folder)"
echo "✅ js/ (entire folder)"
echo "✅ images/ (entire folder)"
echo "✅ videos/ (entire folder)"
echo "✅ lang/ (entire folder)"
echo "✅ pages/ (entire folder)"
echo "✅ robots.txt"
echo "✅ sitemap.xml"
echo "✅ sw.js"
echo ""
echo "❌ DO NOT upload anything from '_development/' folder"
echo ""
echo "🎉 After upload, your website should be live!"

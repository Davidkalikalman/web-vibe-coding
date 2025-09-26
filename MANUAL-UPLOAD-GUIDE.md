# 📤 Vila Mlynica - Manual Upload Guide

## 🚨 SFTP Authentication Issue

The automated upload failed due to authentication issues. Here are manual solutions:

---

## 🔧 **Method 1: Fix SFTP Authentication**

### **Check SFTP Credentials:**
```bash
# Test connection manually
sftp -P 22 webftp.vilamlynica.sk@vilamlynica.sk

# If password authentication fails, you may need:
# 1. Correct password
# 2. SSH key authentication
# 3. Different username format
```

### **Alternative Connection Methods:**
```bash
# Try with different username format
sftp -P 22 webftp@vilamlynica.sk

# Try standard FTP (if SFTP fails)
ftp vilamlynica.sk
```

---

## 📱 **Method 2: FTP Client Upload**

### **Using FileZilla or Similar:**
1. **Host**: `vilamlynica.sk`
2. **Username**: `webftp.vilamlynica.sk`
3. **Password**: `Le4q?s7~Zj`
4. **Port**: `22` (SFTP) or `21` (FTP)
5. **Protocol**: SFTP or FTP

### **Files to Upload:**
```
manifest.json → /web/manifest.json
```

---

## 🌐 **Method 3: Web-Based File Manager**

If your hosting provider has a web-based file manager:

1. **Login to hosting control panel**
2. **Navigate to File Manager**
3. **Go to `/web/` directory**
4. **Upload `manifest.json`**
5. **Set permissions to `644`**

---

## ✅ **Method 4: Copy Content Manually**

### **manifest.json Content:**
```json
{
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
}
```

**Manual Steps:**
1. Create new file `manifest.json` on server
2. Copy above content
3. Save in web root directory
4. Set permissions to `644`

---

## 🧪 **Verification After Upload**

### **Test if upload worked:**
```bash
# Check if manifest.json is accessible
curl -I https://vilamlynica.sk/manifest.json

# Should return HTTP/2 200 (success)
# If returns 404, upload failed
```

### **Re-run tests:**
```bash
# Test PWA support after upload
./run-tests.sh --headless

# Expected improvement:
# PWA warning should disappear
# Success rate should increase from 98.9% to 99%+
```

---

## 🎯 **Priority Upload Order**

### **1. Critical (Fixes test failures):**
- ✅ **manifest.json** - Fixes PWA warning

### **2. Optional (Performance improvements):**
- 🎥 **Video variants** - Already uploaded, just verify paths
- 🖼️ **Gallery images** - Already uploaded, verify accessibility

---

## 📊 **Expected Results After Upload**

### **Before Upload:**
- ❌ PWA: Web App Manifest - Manifest file not found
- 🎯 Success Rate: 98.9%

### **After Upload:**
- ✅ PWA: Web App Manifest - Manifest file accessible
- 🎯 Success Rate: 99%+ expected

---

## 🔍 **Troubleshooting**

### **If SFTP still fails:**
1. **Check credentials** with hosting provider
2. **Try FTP instead** of SFTP (port 21)
3. **Use hosting control panel** file manager
4. **Contact hosting support** for upload assistance

### **If manifest.json doesn't work:**
1. **Check file permissions** (should be 644)
2. **Verify file location** (web root, not subdirectory)
3. **Check file content** (valid JSON format)
4. **Clear browser cache** after upload

---

## ✅ **Quick Fix Summary**

**Immediate Action Needed:**
Upload `manifest.json` to fix the PWA warning and improve your test success rate from 98.9% to 99%+.

**Your website is already performing exceptionally well** - this is just the final polish! 🎉

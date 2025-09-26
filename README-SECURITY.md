# 🚨 CRITICAL SECURITY NOTICE

## ⚠️ **IMMEDIATE ACTION REQUIRED**

This repository previously contained **sensitive FTP credentials** that have been removed for security.

### 🔒 **Security Issues Fixed:**
- ✅ Removed hardcoded FTP password from all files
- ✅ Added secure environment variable-based deployment
- ✅ Updated .gitignore to protect sensitive files
- ✅ Created secure deployment scripts
- ✅ Added comprehensive security documentation

### 🛡️ **Secure Deployment Process:**

#### 1. **Set Environment Variables:**
```bash
export FTP_HOST="vilamlynica.sk"
export FTP_USERNAME="webftp.vilamlynica.sk"
export FTP_PASSWORD="YOUR_NEW_SECURE_PASSWORD"
export FTP_PORT="22"
```

#### 2. **Use Secure Upload Script:**
```bash
chmod +x upload-secure.sh
./upload-secure.sh
```

### 🚨 **If Credentials Were Exposed:**
1. **CHANGE FTP PASSWORD IMMEDIATELY**
2. **Audit server access logs**
3. **Update all deployment scripts**
4. **Notify team members**

### 📋 **Files Now Protected:**
- `UPLOAD` - FTP credentials (removed from Git)
- `update-website.sh` - Hardcoded credentials (removed)
- `upload-manifest.expect` - Hardcoded credentials (removed)
- `MANUAL-UPLOAD-GUIDE.md` - Credentials in docs (removed)

### 🔐 **New Secure Files:**
- `UPLOAD.template` - Template for FTP config
- `upload-secure.sh` - Secure deployment script
- `SECURITY-GUIDE.md` - Comprehensive security guide

## ✅ **Repository is now secure for public GitHub hosting**

---

**Security is everyone's responsibility! 🔒**



# 🔒 Security Guide for Vila Mlynica Website

## ⚠️ IMPORTANT SECURITY NOTICE

This repository contains sensitive information that must be handled securely.

## 🛡️ Security Measures Implemented

### ✅ **Files Protected by .gitignore**
- `UPLOAD` - Contains FTP credentials
- `SFTP` - Contains SFTP credentials  
- `upload-*.sh` - Upload scripts with credentials
- `update-*.sh` - Update scripts with credentials
- `upload-manifest.expect` - Expect scripts with credentials
- `MANUAL-UPLOAD-GUIDE.md` - Documentation with credentials

### 🔐 **Secure Deployment Process**

#### 1. **Environment Variables Setup**
```bash
# Set these environment variables before deployment
export FTP_HOST="your-domain.com"
export FTP_USERNAME="your-username"
export FTP_PASSWORD="your-secure-password"
export FTP_PORT="22"
```

#### 2. **Secure Upload Script**
Use `upload-secure.sh` which reads credentials from environment variables:
```bash
# Make script executable
chmod +x upload-secure.sh

# Set environment variables
export FTP_HOST="vilamlynica.sk"
export FTP_USERNAME="webftp.vilamlynica.sk"
export FTP_PASSWORD="your-secure-password"
export FTP_PORT="22"

# Run secure upload
./upload-secure.sh
```

#### 3. **Template Files**
- `UPLOAD.template` - Template for FTP configuration
- `upload-secure.sh` - Secure upload script using environment variables

## 🚨 **Security Best Practices**

### ❌ **NEVER DO:**
- Commit files with hardcoded passwords
- Share credentials in documentation
- Use weak passwords
- Store credentials in version control

### ✅ **ALWAYS DO:**
- Use environment variables for credentials
- Use strong, unique passwords
- Rotate credentials regularly
- Keep sensitive files in .gitignore
- Use secure deployment scripts

## 🔄 **Credential Rotation**

If credentials are compromised:
1. **Immediately change FTP password**
2. **Update environment variables**
3. **Remove old credentials from all files**
4. **Audit server access logs**

## 📋 **Deployment Checklist**

Before deploying:
- [ ] Set all required environment variables
- [ ] Verify credentials are not in any committed files
- [ ] Test deployment with secure script
- [ ] Confirm no sensitive data in repository
- [ ] Update .gitignore if needed

## 🆘 **Emergency Response**

If credentials are exposed:
1. **Immediately change all passwords**
2. **Remove repository from public access**
3. **Audit server for unauthorized access**
4. **Update all deployment scripts**
5. **Notify team members**

## 📞 **Support**

For security questions or incidents:
- **Technical Support**: dev@vilamlynica.sk
- **Security Issues**: security@vilamlynica.sk

---

**Remember**: Security is everyone's responsibility! 🔒

# Vila Mlynica - Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment Checklist

#### ✅ Performance & Optimization
- [ ] All images have lazy loading (`loading="lazy"`)
- [ ] Critical resources are preloaded (CSS, JS, video)
- [ ] DNS prefetch is configured for external resources
- [ ] Video has poster image and optimized preload
- [ ] Service Worker is registered and caching resources
- [ ] Core Web Vitals are optimized (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10)

#### ✅ SEO & Meta Tags
- [ ] Title and meta description are optimized
- [ ] Open Graph tags are present and correct
- [ ] Twitter Card tags are configured
- [ ] JSON-LD structured data is valid
- [ ] Sitemap.xml is present and accessible
- [ ] Robots.txt is configured
- [ ] Hreflang tags are correct for all languages

#### ✅ Accessibility (WCAG 2.1 AA)
- [ ] Skip-to-content link is present
- [ ] Semantic HTML structure is correct
- [ ] All images have descriptive alt text
- [ ] ARIA labels are present where needed
- [ ] Focus styles are visible and accessible
- [ ] Color contrast meets AA standards

#### ✅ Analytics & Privacy
- [ ] GDPR consent banner is functional
- [ ] Google Analytics 4 is configured
- [ ] Event tracking is set up
- [ ] Privacy policy is accessible
- [ ] Cookie consent is properly managed

#### ✅ Content & Functionality
- [ ] All text content is proofread
- [ ] Contact form validation works
- [ ] Language switching functions properly
- [ ] Gallery images load correctly
- [ ] Booking links are functional
- [ ] All internal links work

#### ✅ Technical Requirements
- [ ] HTTPS is enabled
- [ ] SSL certificate is valid
- [ ] Domain is properly configured
- [ ] CDN is set up (if applicable)
- [ ] Error pages (404, 500) are configured
- [ ] Backup strategy is in place

## 🌐 Deployment Options

### 1. Vercel (Recommended for Next.js Migration)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables
vercel env add GA4_MEASUREMENT_ID
vercel env add BOOKING_ENGINE_URL
```

**Pros:**
- Excellent Next.js support
- Automatic HTTPS
- Global CDN
- Easy environment management
- Built-in analytics

**Configuration:**
- Add `vercel.json` for custom settings
- Configure redirects for language versions
- Set up preview deployments

### 2. Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir .

# Configure redirects
netlify.toml
```

**Pros:**
- Great for static sites
- Form handling
- Split testing
- Easy rollbacks

**Configuration:**
- Add `_redirects` file for SPA routing
- Configure form notifications
- Set up branch deployments

### 3. GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Deploy from main branch
# Configure custom domain
```

**Pros:**
- Free hosting
- Integrated with GitHub
- Easy updates via git

**Configuration:**
- Add CNAME file for custom domain
- Configure 404 page
- Set up GitHub Actions for CI/CD

### 4. AWS S3 + CloudFront
```bash
# Install AWS CLI
aws configure

# Sync files to S3
aws s3 sync . s3://vilamlynica-website --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

**Pros:**
- Highly scalable
- Global CDN
- Cost-effective for high traffic
- Advanced caching options

## 🔧 Environment Configuration

### Production Environment Variables
```bash
# Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_DEBUG_MODE=false

# Booking System
BOOKING_ENGINE_URL=https://booking.vilamlynica.sk
BOOKING_ENGINE_API_KEY=your_api_key

# Contact Form
CONTACT_FORM_ENDPOINT=https://api.vilamlynica.sk/contact
CONTACT_FORM_API_KEY=your_api_key

# CDN
CDN_URL=https://cdn.vilamlynica.sk
IMAGE_OPTIMIZATION_URL=https://images.vilamlynica.sk
```

### Development vs Production
```javascript
// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Analytics configuration
const analyticsConfig = {
  measurementId: isProduction ? 
    process.env.GA4_MEASUREMENT_ID : 
    'G-DEVELOPMENT-ID',
  debugMode: isDevelopment
};
```

## 📊 Performance Monitoring

### Lighthouse CI Setup
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v7
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

### Performance Budget
```json
{
  "budget": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "first-contentful-paint",
          "budget": 2000
        },
        {
          "metric": "largest-contentful-paint",
          "budget": 2500
        },
        {
          "metric": "cumulative-layout-shift",
          "budget": 0.1
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 500
        },
        {
          "resourceType": "total",
          "budget": 2000
        }
      ]
    }
  ]
}
```

## 🔒 Security Configuration

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
  font-src 'self' https://cdn.jsdelivr.net;
">
```

### Security Headers
```javascript
// Security headers for server
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## 📱 PWA Configuration

### Manifest.json
```json
{
  "name": "Vila Mlynica - Ubytovanie vo Vysokých Tatrách",
  "short_name": "Vila Mlynica",
  "description": "Moderné ubytovanie v srdci Vysokých Tatier",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0F766E",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🌍 Multi-Language Deployment

### Language-Specific URLs
```
https://vilamlynica.sk/          # Slovak (default)
https://vilamlynica.sk/en/       # English
https://vilamlynica.sk/pl/       # Polish
https://vilamlynica.sk/hu/       # Hungarian
https://vilamlynica.sk/de/       # German
```

### Hreflang Configuration
```html
<link rel="alternate" hreflang="sk" href="https://vilamlynica.sk/" />
<link rel="alternate" hreflang="en" href="https://vilamlynica.sk/en/" />
<link rel="alternate" hreflang="pl" href="https://vilamlynica.sk/pl/" />
<link rel="alternate" hreflang="hu" href="https://vilamlynica.sk/hu/" />
<link rel="alternate" hreflang="de" href="https://vilamlynica.sk/de/" />
<link rel="alternate" hreflang="x-default" href="https://vilamlynica.sk/" />
```

## 📈 Post-Deployment Monitoring

### Analytics Setup
1. **Google Analytics 4**
   - Configure conversion goals
   - Set up enhanced ecommerce
   - Monitor Core Web Vitals

2. **Google Search Console**
   - Submit sitemap
   - Monitor search performance
   - Check for crawl errors

3. **Performance Monitoring**
   - Set up Lighthouse CI
   - Monitor Core Web Vitals
   - Track user experience metrics

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    uptime: process.uptime()
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: |
          npm test
          npm run lighthouse
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Rollback Strategy

### Quick Rollback
```bash
# Vercel
vercel rollback [deployment-url]

# Netlify
netlify rollback [deployment-id]

# AWS S3
aws s3 sync s3://vilamlynica-backup s3://vilamlynica-website --delete
```

### Emergency Procedures
1. **Immediate Response**
   - Identify the issue
   - Rollback to previous version
   - Notify stakeholders

2. **Investigation**
   - Analyze logs
   - Identify root cause
   - Document findings

3. **Resolution**
   - Fix the issue
   - Test thoroughly
   - Deploy fix

## 📞 Support & Maintenance

### Monitoring Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Google PageSpeed Insights, GTmetrix
- **Analytics**: Google Analytics, Google Search Console
- **Error Tracking**: Sentry, LogRocket

### Regular Maintenance Tasks
- [ ] Weekly performance audits
- [ ] Monthly security updates
- [ ] Quarterly content reviews
- [ ] Annual SEO audits

### Contact Information
- **Technical Support**: dev@vilamlynica.sk
- **Content Updates**: content@vilamlynica.sk
- **Emergency Contact**: +421 905 673 291

---

**Last Updated**: January 15, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready

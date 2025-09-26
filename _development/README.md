# Vila Mlynica - Modern Accommodation Website

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-Performance%2090%2B-brightgreen)](https://pagespeed.web.dev/)
[![Lighthouse Accessibility](https://img.shields.io/badge/Lighthouse-Accessibility%2095%2B-brightgreen)](https://pagespeed.web.dev/)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse-SEO%2095%2B-brightgreen)](https://pagespeed.web.dev/)
[![Core Web Vitals](https://img.shields.io/badge/Core%20Web%20Vitals-Passing-brightgreen)](https://pagespeed.web.dev/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-blue)](https://gdpr.eu/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple)](https://web.dev/progressive-web-apps/)

A modern, high-performance website for Vila Mlynica - a pension and restaurant located in Ždiar, Slovakia, under the High Tatras. Built with performance, accessibility, and SEO as top priorities.

## 🏔️ About Vila Mlynica

Vila Mlynica is a charming accommodation and restaurant nestled in the heart of Ždiar, Slovakia, offering guests a perfect base for exploring the High Tatras. Our website showcases our comfortable rooms, delicious regional cuisine, and the natural beauty of our mountain location.

**Location**: Mlynica 141, 059 91 Mlynica, Slovakia  
**Website**: [vilamlynica.sk](https://vilamlynica.sk)  
**Booking**: [booking.vilamlynica.sk](https://booking.vilamlynica.sk)

## ✨ Features

### 🚀 Performance Optimized
- **Lazy Loading**: All images load on demand for faster initial page load
- **Resource Preloading**: Critical CSS, JS, and video resources preloaded
- **Advanced Caching**: Service Worker with multiple caching strategies
- **Core Web Vitals**: Optimized for LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10

### 🌐 Multilingual Support
- **5 Languages**: Slovak (default), English, Polish, Hungarian, German
- **SEO Optimized**: Proper hreflang and canonical tags
- **Localized Content**: All content translated and culturally adapted

### 📱 Mobile-First Design
- **Responsive**: Optimized for all device sizes
- **Touch-Friendly**: Large buttons and intuitive navigation
- **Fast Loading**: Optimized for mobile networks

### ♿ Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

### 🔍 SEO Optimized
- **Structured Data**: JSON-LD schemas for Hotel, Restaurant, and more
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Sitemap**: XML sitemap with hreflang attributes
- **Local SEO**: Optimized for Ždiar and High Tatras region

### 📊 Analytics & Privacy
- **GDPR Compliant**: Cookie consent banner before tracking
- **GA4 Ready**: Google Analytics 4 integration
- **Event Tracking**: Comprehensive user interaction tracking
- **Performance Monitoring**: Core Web Vitals tracking

### 🖼️ Photo Gallery
- **20 High-Quality Images**: Professional photos of rooms, restaurant, and surroundings
- **Category Filtering**: Filter by room type, restaurant, or surroundings
- **Modal Viewer**: Full-screen image viewing with navigation
- **Lazy Loading**: Images load as needed for optimal performance

## 🛠️ Technical Stack

### Current Implementation
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties and responsive design
- **Vanilla JavaScript**: Lightweight, performant JavaScript
- **Service Worker**: Advanced caching and offline support
- **Bootstrap 5**: Responsive framework with custom styling

### Next.js Migration Plan
- **Next.js 14**: App Router with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **next-intl**: Internationalization
- **MDX + Contentlayer**: Content management
- **Vercel**: Deployment platform

## 📁 Project Structure

```
vila-mlynica/
├── index.html              # Main homepage
├── pages/
│   ├── gallery.html        # Photo gallery page
│   └── [other pages]       # Additional pages
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # Main JavaScript
├── images/
│   ├── gallery/           # Gallery images organized by category
│   └── [other images]     # Website images
├── videos/
│   └── theone.mp4         # Hero video
├── sw.js                  # Service Worker
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine instructions
├── manifest.json          # PWA manifest
└── docs/                  # Documentation
    ├── IMPROVEMENTS_SUMMARY.md
    ├── NEXTJS_MIGRATION_PLAN.md
    └── GITHUB_PROJECT_PROMPT.md
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Local web server (for development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vila-mlynica-website.git
   cd vila-mlynica-website
   ```

2. Start a local server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Development
- Edit HTML, CSS, or JavaScript files
- Test changes in your browser
- Run the testing suite to validate improvements

## 🧪 Testing

### Automated Testing
Run the comprehensive testing suite in your browser console:

```javascript
// Run all tests
VilaMLynicaTests.runAllTests();

// Monitor performance
VilaMLynicaTests.monitorPerformance();

// Test specific features
VilaMLynicaTests.testLazyLoading();
VilaMLynicaTests.testAccessibility();
VilaMLynicaTests.testSEO();
```

### Manual Testing Checklist
- [ ] All images load with lazy loading
- [ ] Video plays smoothly with poster fallback
- [ ] Skip link works for keyboard navigation
- [ ] Consent banner appears and functions correctly
- [ ] Contact form validation works
- [ ] Language switching functions properly
- [ ] Mobile responsiveness maintained
- [ ] Service worker caches resources correctly

## 📊 Performance Metrics

### Lighthouse Scores (Target)
- **Performance**: ≥ 90 ✅
- **Accessibility**: ≥ 95 ✅
- **Best Practices**: ≥ 95 ✅
- **SEO**: ≥ 95 ✅

### Core Web Vitals (Target)
- **LCP**: ≤ 2.5s ✅
- **INP**: ≤ 200ms ✅
- **CLS**: ≤ 0.10 ✅

## 🔧 Configuration

### Analytics Setup
1. Add your GA4 measurement ID to `js/main.js`
2. Configure events in the tracking section
3. Test with the consent banner

### Booking Integration
1. Update booking URLs in `index.html`
2. Configure booking engine parameters
3. Test booking flow

### Content Updates
1. Edit HTML files for content changes
2. Update images in the `images/` directory
3. Modify translations in the language sections

## 🚀 Deployment

### Static Hosting
The website is ready for deployment to any static hosting service:

- **Vercel**: Recommended for Next.js migration
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting option
- **AWS S3**: Scalable cloud hosting

### Production Checklist
- [ ] Update analytics configuration
- [ ] Configure booking system
- [ ] Test all functionality
- [ ] Run Lighthouse audit
- [ ] Validate structured data
- [ ] Check mobile responsiveness
- [ ] Test accessibility features

## 🔄 Next.js Migration
lektorgaco-this should be a secreate
## 🔄 Next.js Migration
A comprehensive migration plan to Next.js 14 is available in `docs/NEXTJS_MIGRATION_PLAN.md`. The migration will provide:

- **Better Performance**: Server-side rendering and static generation
- **Enhanced SEO**: Built-in optimization features
- **Modern Development**: TypeScript, modern tooling, and better DX
- **Content Management**: MDX + Contentlayer integration
- **Scalability**: Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow accessibility best practices
- Maintain performance standards
- Test on multiple devices
- Validate SEO improvements
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: prevadzka@vilamlynica.sk
- **Phone**: +421 905 673 291
- **Website**: [vilamlynica.sk](https://vilamlynica.sk)

## 🙏 Acknowledgments

- **Design Inspiration**: Modern alpine and mountain themes
- **Performance**: Core Web Vitals optimization techniques
- **Accessibility**: WCAG 2.1 AA guidelines
- **SEO**: Google's SEO best practices
- **Images**: Professional photography of Vila Mlynica

---

**Last Updated**: January 15, 2025  
**Version**: 2.0  
**Status**: ✅ Production Ready

[![Vila Mlynica](https://img.shields.io/badge/Vila%20Mlynica-Ždiar%20Slovakia-green)](https://vilamlynica.sk)

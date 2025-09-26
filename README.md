# Vila Mlynica Website

A modern, responsive website for Vila Mlynica - luxury accommodation in the heart of the High Tatras, Slovakia.

## 🌟 Features

### 🖼️ **Gallery System**
- **Auto-building modal**: No more manual index maintenance
- **Smart filtering**: Exterior, Interior, Common Areas, Additional
- **New restaurant photos**: 4 professional images under "Spoločné priestory"
- **Lazy loading**: Optimized performance for large image galleries
- **Keyboard navigation**: Full accessibility support

### 🏠 **Accommodation Pages**
- **Real room photos**: 2-bedroom suite with 4 professional images
- **Interactive carousels**: Smooth image transitions
- **Modal galleries**: Detailed room views
- **Responsive design**: Perfect on all devices

### 🌐 **Multi-language Support**
- **5 languages**: Slovak, English, Hungarian, Polish, German
- **Dynamic switching**: Real-time language changes
- **SEO optimized**: Proper meta tags for each language

### 📱 **Modern Web Features**
- **PWA support**: Install as mobile app
- **Service Worker**: Offline functionality
- **Bootstrap 5**: Modern, responsive framework
- **Accessibility**: WCAG compliant

## 🚀 **Quick Start**

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vilamlynica-website.git
cd vilamlynica-website

# Open in browser
open web/index.html
```

### Production Deployment
```bash
# Upload to server
./upload-changes.sh

# Test deployment
curl -I https://vilamlynica.sk/
```

## 📁 **Project Structure**

```
web/
├── index.html              # Homepage
├── contact.html            # Contact page
├── pages/
│   ├── gallery.html        # Photo gallery
│   ├── accommodation.html  # Room types
│   ├── restaurant.html     # Restaurant info
│   └── virtual-tour.html   # Virtual tour
├── js/
│   ├── main.js            # Core functionality
│   ├── gallery.js         # Gallery system
│   ├── accommodation.js   # Room galleries
│   └── language-universal.js # Multi-language
├── css/
│   └── style.css          # Custom styles
├── images/
│   └── gallery/
│       ├── exterior/      # Building photos
│       ├── interior/      # Room photos
│       ├── common-areas/ # Shared spaces
│       └── additional/    # Surroundings
└── lang/
    ├── sk.json           # Slovak translations
    ├── en.json           # English translations
    ├── hu.json           # Hungarian translations
    ├── pl.json           # Polish translations
    └── de.json           # German translations
```

## 🛠️ **Technical Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.3.2
- **Icons**: Bootstrap Icons
- **Images**: Optimized JPG/WebP
- **Performance**: Lazy loading, Service Worker
- **SEO**: Meta tags, Open Graph, Twitter Cards

## 📸 **Image Management**

### Adding New Gallery Images
1. Place images in appropriate folder (`web/images/gallery/`)
2. Add HTML card in `web/pages/gallery.html`
3. Set correct `data-category` for filtering
4. No JavaScript changes needed (auto-build system)

### Image Optimization
- **Format**: JPG for photos, WebP for modern browsers
- **Size**: Responsive images with proper alt text
- **Loading**: Lazy loading for performance

## 🌍 **Multi-language System**

### Adding New Languages
1. Create new JSON file in `web/lang/`
2. Add language option in navigation
3. Update `language-universal.js` if needed

### Translation Keys
```json
{
  "nav-home": "Home",
  "nav-gallery": "Gallery",
  "gallery-hero-title": "Photo Gallery"
}
```

## 🚀 **Deployment**

### Automated Upload
```bash
# Upload all changes
./upload-changes.sh

# Test specific files
curl -I https://vilamlynica.sk/pages/gallery.html
```

### Manual Upload
```bash
# Upload specific files
scp -P 22 web/js/gallery.js webftp.vilamlynica.sk@vilamlynica.sk:/web/js/
scp -P 22 web/pages/gallery.html webftp.vilamlynica.sk@vilamlynica.sk:/web/pages/
```

## 🧪 **Testing**

### Automated Testing
```bash
# Run comprehensive tests
./run-tests.sh

# Headless testing
./run-tests.sh --headless

# Generate reports
./create-summary-report.sh
```

### Manual Testing
- **Gallery**: Test modal, filtering, keyboard navigation
- **Accommodation**: Test carousels, room galleries
- **Languages**: Test all 5 language switches
- **Mobile**: Test responsive design

## 📊 **Performance**

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: WebP format with JPG fallback
- **Lazy Loading**: Images load as needed
- **Service Worker**: Offline functionality
- **CDN**: Bootstrap and icons from CDN

## 🔧 **Development**

### Adding New Features
1. **Gallery**: Add HTML cards, no JS changes needed
2. **Rooms**: Update `accommodation.js` room galleries
3. **Languages**: Add JSON files and navigation options
4. **Styling**: Update `web/css/style.css`

### Code Standards
- **HTML**: Semantic markup, accessibility attributes
- **CSS**: Bootstrap classes, custom properties
- **JavaScript**: ES6+, modern browser support
- **Images**: Optimized, proper alt text

## 📈 **Analytics & SEO**

- **Meta Tags**: Complete Open Graph and Twitter Cards
- **Structured Data**: JSON-LD for accommodation
- **Sitemap**: Auto-generated XML sitemap
- **Robots**: Proper robots.txt configuration

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is proprietary to Vila Mlynica. All rights reserved.

## 📞 **Contact**

- **Website**: https://vilamlynica.sk
- **Email**: info@vilamlynica.sk
- **Location**: Mlynica, High Tatras, Slovakia

---

**Vila Mlynica** - Your home in the heart of the High Tatras 🏔️

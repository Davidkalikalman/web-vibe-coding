# Next.js 14 Migration Plan for Vila Mlynica

## Overview
This document outlines the comprehensive migration plan from the current HTML/CSS/JS structure to Next.js 14 with App Router, following the specifications in instructions.md.

## Current State Analysis
- **Current Stack**: HTML5, Bootstrap 5, Vanilla JS, CSS3
- **Languages**: SK (default), EN, PL, HU, DE
- **Features**: Multilingual support, video hero, booking modal, contact form, PWA capabilities
- **Performance**: Basic optimizations implemented (lazy loading, service worker)

## Target Architecture

### Tech Stack (Mandatory)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with design tokens
- **Components**: shadcn/ui for base components and forms
- **i18n**: next-intl with route segments: /(sk|en|pl|hu)
- **Content**: MDX + Contentlayer
- **Images**: next/image (AVIF/WEBP, lazy, proper `sizes`)
- **Icons**: lucide-react
- **Analytics**: GA4 (+ GSC), optional Plausible
- **GDPR**: Consent banner that blocks analytics until accepted
- **Deployment**: Vercel (preferred)

### Information Architecture
```
/
├── (sk)/                    # Slovak (default)
│   ├── page.tsx            # Homepage
│   ├── ubytovanie/         # Rooms overview
│   ├── izby/[slug]/        # Room detail
│   ├── restauracia/        # Restaurant landing
│   ├── menu/               # Menu (MDX)
│   ├── balicky/            # Seasonal packages (MDX)
│   ├── okolie/             # Nearby attractions (MDX)
│   ├── galeria/            # Photo gallery
│   ├── blog/               # News & offers
│   ├── podujatia/          # Events
│   ├── rezervacia/         # Booking hub
│   ├── faq/                # FAQ with schema
│   ├── o-nas/              # About/story
│   └── kontakt/            # Contact
├── (en)/                   # English
├── (pl)/                   # Polish
├── (hu)/                   # Hungarian
└── (de)/                   # German
```

## Migration Steps

### Phase 1: Project Setup & Configuration
1. **Initialize Next.js 14 project**
   ```bash
   npx create-next-app@latest vila-mlynica-nextjs --typescript --tailwind --eslint --app
   cd vila-mlynica-nextjs
   ```

2. **Install required dependencies**
   ```bash
   npm install next-intl @next/mdx @mdx-js/loader @mdx-js/react contentlayer2
   npm install @radix-ui/react-* lucide-react class-variance-authority clsx tailwind-merge
   npm install @tailwindcss/typography @tailwindcss/forms
   npm install web-vitals
   ```

3. **Configure next.config.js**
   ```javascript
   const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');
   const { withContentlayer } = require('next-contentlayer2');
   
   module.exports = withContentlayer(withNextIntl({
     experimental: {
       optimizePackageImports: ['lucide-react']
     },
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
     }
   }));
   ```

### Phase 2: Design System & Tailwind Configuration
1. **Configure tailwind.config.js**
   ```javascript
   module.exports = {
     content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
     theme: {
       extend: {
         colors: {
           brand: {
             base: '#0F766E',    // tatra green
             secondary: '#1D4ED8', // cool blue
             accent: '#F59E0B'
           }
         },
         fontFamily: {
           serif: ['Playfair Display', 'serif'],
           sans: ['Inter', 'sans-serif']
         }
       }
     }
   }
   ```

2. **Set up shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button card form input textarea select
   ```

### Phase 3: Internationalization Setup
1. **Configure next-intl**
   - Create `src/i18n.ts`
   - Set up locale routing
   - Configure message files for each language

2. **Create locale structure**
   ```
   src/
   ├── messages/
   │   ├── sk.json
   │   ├── en.json
   │   ├── pl.json
   │   ├── hu.json
   │   └── de.json
   ```

### Phase 4: Component Migration
1. **Core Components**
   - `SiteHeader.tsx` - Navigation with language switcher
   - `Hero.tsx` - Video hero section
   - `RoomCard.tsx` - Room display cards
   - `PackageCard.tsx` - Special offers
   - `MenuSection.tsx` - Restaurant menu
   - `StickyBookingBar.tsx` - Booking CTA
   - `Breadcrumbs.tsx` - Navigation breadcrumbs
   - `ContactForm.tsx` - Contact form with validation

2. **Layout Components**
   - `RootLayout.tsx` - Root layout with providers
   - `LocaleLayout.tsx` - Locale-specific layout

### Phase 5: Content Management
1. **Set up Contentlayer**
   ```javascript
   // contentlayer.config.ts
   import { defineDocumentType, makeSource } from 'contentlayer/source-files'
   
   export const Room = defineDocumentType(() => ({
     name: 'Room',
     filePathPattern: `rooms/*.mdx`,
     fields: {
       title: { type: 'string', required: true },
       slug: { type: 'string', required: true },
       price: { type: 'number', required: true },
       capacity: { type: 'number', required: true },
       amenities: { type: 'list', of: { type: 'string' } },
       images: { type: 'list', of: { type: 'string' } }
     }
   }))
   ```

2. **Create content structure**
   ```
   content/
   ├── rooms/
   ├── packages/
   ├── blog/
   ├── attractions/
   └── menu.json
   ```

### Phase 6: SEO & Structured Data
1. **Implement JSON-LD schemas**
   - Hotel schema
   - Restaurant schema
   - Room schemas
   - FAQ schema
   - BreadcrumbList schema
   - Menu schema

2. **SEO components**
   - `SeoSchemas.tsx`
   - `Hreflang.tsx`
   - `sitemap.ts`
   - `robots.ts`

### Phase 7: Performance Optimization
1. **Image optimization**
   - Convert all images to next/image
   - Implement proper `sizes` attributes
   - Use AVIF/WEBP formats

2. **Code splitting**
   - Dynamic imports for heavy components
   - Server Components where possible
   - Optimize bundle size

### Phase 8: Analytics & Tracking
1. **GA4 integration**
   - GDPR consent banner
   - Event tracking for CTAs
   - Performance monitoring

2. **Core Web Vitals**
   - LCP ≤ 2.5s
   - INP ≤ 200ms
   - CLS ≤ 0.10

### Phase 9: Testing & Validation
1. **Lighthouse CI**
   - Performance ≥ 90
   - Accessibility ≥ 95
   - Best Practices ≥ 95
   - SEO ≥ 95

2. **Automated testing**
   - Unit tests for components
   - Integration tests for forms
   - E2E tests for critical paths

## File Structure After Migration
```
vila-mlynica-nextjs/
├── src/
│   ├── app/
│   │   ├── (sk)/
│   │   ├── (en)/
│   │   ├── (pl)/
│   │   ├── (hu)/
│   │   ├── (de)/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── SiteHeader.tsx
│   │   ├── Hero.tsx
│   │   ├── RoomCard.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── analytics.ts
│   │   └── validations.ts
│   ├── messages/
│   └── i18n.ts
├── content/
├── public/
├── contentlayer.config.ts
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Migration Timeline
- **Week 1**: Project setup, design system, basic components
- **Week 2**: i18n setup, content structure, core pages
- **Week 3**: SEO implementation, performance optimization
- **Week 4**: Testing, analytics, deployment

## Risk Mitigation
1. **Content Migration**: Automated scripts to convert existing content
2. **SEO Preservation**: Maintain all existing URLs with redirects
3. **Performance**: Continuous monitoring during migration
4. **Rollback Plan**: Keep current site as backup during transition

## Success Metrics
- Lighthouse scores: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95
- Core Web Vitals targets met
- All existing functionality preserved
- Improved developer experience
- Better content management capabilities

## Next Steps
1. Review and approve migration plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular progress reviews and adjustments

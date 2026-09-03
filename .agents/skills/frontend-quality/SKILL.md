---
name: frontend-quality
description: Responsive design, performance, accessibility, SEO, and frontend quality standards for Base Engineering.
---

# Frontend Quality Skill

Ensure all user-facing interfaces meet high performance, responsive, and accessibility standards.

## Viewport Standards

All UI components and layouts must render properly at these core breakpoints:
- **Mobile:** 375px, 390px (compact header, stacked product cards, hamburger drawer)
- **Tablet:** 768px (2-column product grid, adjusted padding)
- **Desktop:** 1024px, 1440px+ (3-column product grid, full sticky navigation)

### Strict Constraint:
**Never allow horizontal scrolling.** Check all tables, grids, and flex containers with `overflow-x: hidden` or appropriate horizontal scrolling within table containers.

## Performance & Rendering Strategy

1. **Server-Side Rendering First:** Default to Server Components for data-fetching and SEO.
2. **Selective Client Components:** Use `"use client"` exclusively for interactivity (toggles, modals, forms, tabs).
3. **Bundle Size Control:** Do not introduce large third-party libraries for simple styling or animations.
4. **Image Optimization:** Ensure all product images have descriptive `alt` tags and `loading="lazy"` where applicable.

## SEO Best Practices

- Proper `<title>` and `<meta name="description">` tags on all pages.
- One primary `<h1>` tag per page.
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Dynamic Open Graph metadata on product pages (`generateMetadata`).
- Dynamic XML sitemap generator in `app/sitemap.js`.
- Search crawler rules in `app/robots.js`.

## State Handling Checklist

Every dynamic UI component must provide:
- [ ] Loading state
- [ ] Empty state (e.g. no products found in selected category)
- [ ] Error feedback (e.g. enquiry submission failure)
- [ ] Success feedback (e.g. quotation sent confirmation)

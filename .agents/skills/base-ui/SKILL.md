---
name: base-ui
description: Design and build Base Engineering user interfaces adhering to the professional industrial corporate design system.
---

# Base Engineering UI Skill

Build Base Engineering interfaces as professional industrial corporate experiences that convey engineering strength, precision, and durability.

## Visual Language & Design Tokens

### Colors
- **Neutral Backgrounds:** White (`#FFFFFF`) and Light Slate (`#F8FAFC`, `#F1F5F9`).
- **Typography Colors:** Deep Charcoal (`#0F172A`) for headings; Slate (`#475569`) for body text.
- **Industrial Accent:** Safety Orange (`#D9531E`, hover `#C2410C`, tint `#FFF7ED`).
- **Borders:** Crisp, light steel borders (`#E2E8F0`).

### Principles
- Use clean layouts, strong typography, and genuine industrial photography.
- Sharp-to-subtly-rounded corners (`border-radius: 4px` to `6px`).
- Minimal, subtle shadows (`box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06)`).
- Clear, prominent call-to-action buttons.
- Consistent 8px grid spacing.
- High-contrast technical badges.

### Prohibited Patterns
- No neon colors, gradients, or glassmorphism.
- No bubbly rounded cards or pill containers.
- No cartoon, 3D, or tech-startup illustrations.
- No excessive animations or distracting motion effects.

## Public Website (Single-Page Principle)

The main public website is strictly single-page (`/`) with smooth anchor navigation:
- `#hero`: Bold industrial headline and dual CTAs.
- `#about`: Manufacturing quality, high-tensile steel, CNC tolerances.
- `#products`: Dynamic product grid with category filter tabs.
- `#why-us`: 5 engineering pillars.
- `#applications`: Industrial sectors (Bridges, High-rise, Commercial).
- `#highlights`: Dynamic milestone numbers (`10+ Years`, `500+ Customers`).
- `#contact`: Dynamic enquiry form with product pre-selection.
- Footer: Comprehensive corporate and contact information.

## Products Presentation

Product cards must prioritize:
1. Product high-resolution image
2. Product name
3. Short description
4. Category badge
5. Quick View and Details action buttons

Content must always be dynamically retrieved from the database.

## Responsive Design

- Test across mobile (375px, 390px), tablet (768px), and desktop (1024px, 1440px+).
- **Never allow horizontal scrolling.**
- Provide a clean, compact hamburger drawer on mobile devices.

# Base Engineering — Master Project Rules

This document establishes the architecture, design system, coding standards, database strategy, Cloudflare configuration, security protocols, and operational workflows for all AI agents and developers working on the **Base Engineering** codebase.

---

## 1. Project Identity & Purpose

**Base Engineering** is a professional industrial manufacturing and construction support products company specializing in:
- Heavy-duty Scaffolding Jacks (Base Jacks, Adjustable Jacks, U Jacks)
- Telescopic Acrow Spans
- Steel Shuttering Plates & Formwork Systems
- Telescopic Steel Props (Acrow Props)
- Scaffolding Accessories (Couplers, clamps, tie rods, wing nuts)
- Fabricated Steel Components & Structural Assemblies

### Brand Perception Target
The website must communicate:
> **Strength + Engineering + Reliability + Quality + Practical Construction Solutions**

It must look and feel like an established, heavy industrial manufacturer — **NOT** a SaaS startup, software company, digital agency, personal portfolio, or consumer ecommerce marketplace.

---

## 2. Public Website Architecture (Single-Page Principle)

The public company presence is strictly a **simple professional single-page corporate landing website** hosted on `/`.

### Main Homepage Sections (`base.com/`)
All core company sections reside on the homepage using smooth anchor navigation:
- `#hero`: Industrial Hero section
- `#about`: Company background & manufacturing capabilities
- `#products`: Dynamic product catalog with category filter tabs
- `#why-us`: Core engineering pillars
- `#applications`: Industrial sectors and use cases
- `#highlights`: Dynamic statistics and milestone strip
- `#contact`: Interactive enquiry and quotation form
- Footer: Corporate links and contact details

> [!IMPORTANT]
> **DO NOT** create separate public routes such as `/about`, `/applications`, `/contact`, or `/company`.
> The only permitted public sub-routes are individual product detail pages: `/products/[slug]`.

### Dedicated Product Pages (`/products/[slug]`)
- `/products/scaffolding-jack`
- `/products/span`
- `/products/shutter`
- etc.
These pages display technical specifications, materials, high-resolution galleries, applications, and direct quotation triggers.

---

## 3. Design System & Visual Principles

- **Color Palette:**
  - Backgrounds: Clean white (`#FFFFFF`) and light neutral slate (`#F8FAFC`, `#F1F5F9`).
  - Typography: Deep charcoal (`#0F172A`) and dark slate (`#334155`, `#475569`).
  - Industrial Accent: Safety Orange / Heavy Machinery Amber (`#D9531E`, hover `#C2410C`, light tint `#FFF7ED`).
- **Geometry:** Sharp-to-subtly-rounded corners (`border-radius: 4px` to `6px`).
- **Borders & Shadows:** Clean, subtle borders (`#E2E8F0`), minimal shadows (`var(--shadow-subtle)`).
- **Typography:** Robust, clean sans-serif typography with high legibility and clear hierarchy.
- **Imagery:** High-resolution photography of real scaffolding, construction sites, and manufacturing processes.

### Prohibited Visual Styles:
- No neon colors or vibrant rainbow gradients.
- No glassmorphism, blur cards, or translucent floating panels.
- No bubbly or excessively rounded UI (pill cards, 24px+ radii).
- No cartoon, 3D, or tech startup illustrations.
- No SaaS-style dashboard aesthetics on the public site.
- No complex scroll animations, parallax, or distracting motion.

---

## 4. Anti-Overbuilding Rule

Do **NOT** add features unless explicitly requested. Keep the application:
> **Simple + Professional + Fast + Dynamic + Maintainable**

Explicitly Prohibited unless requested:
- No blog or article CMS
- No careers / job application portal
- No public pricing lists or subscription tiers
- No shopping cart, checkout, or payment gateway
- No customer self-service portal or complex CRM
- No AI chatbots, 3D model viewers, or heavy WebGL canvases
- No unneeded marketing popups or carousels

---

## 5. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18 (with `.jsx` components)
- **Styling:** Vanilla CSS (`app/globals.css`, `styles/admin.css`)
- **Icons:** `lucide-react`
- **Authentication:** `jose` (JWT) + `bcryptjs`
- **Database ORM:** Prisma v5 with `previewFeatures = ["driverAdapters"]`
- **Database Engines:**
  - Local Dev: SQLite (`prisma/dev.db`)
  - Production: Cloudflare D1 (`base_db` binding via `@prisma/adapter-d1`)
- **Storage:** Cloudflare R2 (`@aws-sdk/client-s3`) with local `/public/uploads` fallback
- **Cloudflare Runtime:** Cloudflare Pages / Workers via `wrangler.toml`

---

## 6. Database Strategy & Prisma Architecture

```text
Local Development                      Production
       ↓                                    ↓
SQLite (prisma/dev.db)            Cloudflare D1 (base_db)
       ↓                                    ↓
PrismaClient (standard)            PrismaClient + PrismaD1 adapter
       └───────────────────┬────────────────┘
                           ↓
                   lib/prisma.js (Singleton)
```

### Core Database Models:
- `Admin`: User authentication, credentials, and role
- `Product`: Component data, specifications, materials, applications, slug
- `ProductImage`: Multi-image gallery with primary flag and R2 object keys
- `Category`: Dynamic categorization (Scaffolding, Shuttering, Support Systems, etc.)
- `Company`: Corporate profile, address, phone, email, about copy
- `CompanyHighlight`: Dynamic numeric milestones (`10+ Years`, `500+ Customers`)
- `HomepageSection`: Hero heading, subheading, description, CTAs, background images
- `Application`: Sector showcase cards (Bridges, Infrastructure, High-Rise, etc.)
- `Enquiry`: Public quotation requests with workflow statuses (`NEW`, `CONTACTED`, `CLOSED`)
- `Media`: Stored asset metadata (keys, mime types, sizes, URLs)

### Dynamic Content Rule:
**Never hardcode product or company content in React components.** All products, categories, contact information, and statistics must be read from and written to the database.

---

## 7. Cloudflare R2 & Media Storage

- Cloudflare R2 is accessed via `@aws-sdk/client-s3` in [`lib/r2.js`](file:///Users/aslampi/Files/base_eng/lib/r2.js).
- **Never store binary image data inside D1.** Only store the URL, objectKey, and metadata.
- If R2 credentials are not configured in `.env`, the system automatically falls back to `/public/uploads` for seamless offline local development.

---

## 8. Admin Portal (`/admin`)

The Admin Control Center is dedicated to content operations:
- `/admin`: Dashboard with KPI cards and recent enquiries
- `/admin/login`: Secure credential authentication
- `/admin/products`: Complete catalog management (CRUD, specifications builder, image uploader)
- `/admin/categories`: Category management
- `/admin/company`: Contact details and about copy
- `/admin/homepage`: Hero section content editor
- `/admin/highlights`: Dynamic statistics editor
- `/admin/applications`: Industrial sectors manager
- `/admin/enquiries`: Lead tracking (`NEW` -> `CONTACTED` -> `CLOSED`)
- `/admin/media`: Storage asset explorer and direct uploader

---

## 9. Security & Authentication Guidelines

- All `/admin/*` pages and mutating `/api/*` endpoints must verify admin session via `getAdminSession()`.
- Passwords must always be hashed with bcrypt. Plaintext passwords must never be stored.
- Secure HTTP-only cookies (`base_admin_token`) for session management.
- Validate all incoming API request bodies and public enquiry form submissions.
- **Never commit `.env` or secrets to Git.** Keep `.gitignore` strictly maintained.

---

## 10. Code Modification & Safe Change Policy

Before modifying any existing code:
1. **Inspect:** Examine the existing implementation, imports, and database dependencies.
2. **Preserve:** Retain working logic. Do not rewrite components or refactor unrelated files.
3. **Smallest Safe Diff:** Implement only what is necessary to satisfy the requirement or resolve the bug.
4. **Build & Verify:** Always run `npm run build` and test affected interactions before declaring completion.
5. **No Regressions:** Verify existing routes and APIs remain functional.

---

## 11. Priority Order for Conflict Resolution

When requirements or principles appear to conflict, adhere strictly to this hierarchy:
```text
1. Security & secrets protection
2. Existing working functionality
3. Explicit user instructions
4. Project master rules
5. Database & Cloudflare architecture
6. UI / UX design standards
7. Individual skill guidance
8. Developer convenience
```

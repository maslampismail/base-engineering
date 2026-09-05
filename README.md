# Base Engineering — Industrial Manufacturing Website & Admin Control Center

Production-ready, high-performance web platform for **Base Engineering**, an industrial manufacturing company specializing in heavy-duty scaffolding products, construction support components, steel structures, and related construction solutions.

## Key Features

- **Single-Page Corporate Landing Website (`/`):**
  - Smooth anchor-based navigation (`/#about`, `/#products`, `/#why-us`, `/#applications`, `/#highlights`, `/#contact`).
  - Heavy-duty industrial visual identity: Deep charcoal (`#0F172A`), light neutral background (`#F8FAFC`), industrial safety orange (`#D9531E`), subtle borders, minimal shadows.
  - Interactive quotation form with dynamic product pre-selection.
  - Dynamic company statistics & milestones strip.
- **Dedicated Product Pages (`/products/[slug]`):**
  - High-resolution image galleries.
  - Comprehensive technical specifications table (dimensions, thread pitch, load ratings).
  - Material and manufacturing details.
  - Field application guides and related construction products.
- **Full Admin Control Center (`/admin`):**
  - Secure bcrypt authentication (`/admin/login`).
  - Real-time KPI dashboard (Total Products, Active Products, Categories, Inquiries).
  - Complete CRUD for Products & Categories.
  - Live Enquiry Tracker with 1-click status workflow (`NEW` → `CONTACTED` → `CLOSED`).
  - Dynamic content managers for Company Profile, Homepage Hero, Highlights, and Applications.
  - Storage & Media manager with direct R2 / local uploads and one-click URL copying.

---

## Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router, React 18, JSX)
- **Styling:** Vanilla CSS design system (`app/globals.css`, `styles/admin.css`)
- **Database & ORM:**
  - **Prisma v5** with `previewFeatures = ["driverAdapters"]`
  - **Local Development:** SQLite (`prisma/dev.db`)
  - **Production Deployment:** Cloudflare D1 database (`base_db` binding) via `@prisma/adapter-d1`
- **Object Storage:**
  - Cloudflare R2 bucket (`base-engineering-assets`) via `@aws-sdk/client-s3`
  - Automatic local filesystem fallback (`/public/uploads`) for zero-config offline development
- **Authentication:** HTTP-only signed JWT sessions (`jose`) + `bcryptjs` password hashing

---

## Getting Started (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Database Migration & Seeding
Initialize the local SQLite database and populate with realistic seed products (Scaffolding Jack, Acrow Span, Shuttering Plates, Telescopic Props, U Jacks, Base Jacks, Accessories):
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
- **Local Machine:** [http://localhost:3000](http://localhost:3000)
- **Wi-Fi / Other Devices:** `http://<your-local-ip>:3000` (e.g. `http://192.168.29.130:3000`)
*(The dev server is configured with `-H 0.0.0.0` to automatically accept incoming connections from any device on the same local network)*

---

## Admin Portal Access

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Email:** `admin@baseengineering.com`
- **Default Password:** `admin123456`

---

## Cloudflare D1 & R2 Deployment

### 1. Configure Wrangler
Review `wrangler.toml`:
```toml
name = "base-engineering"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "base_db"
database_name = "base_db"
database_id = "<your-d1-database-id>"

[[r2_buckets]]
binding = "BASE_ENG_BUCKET"
bucket_name = "base-engineering-assets"
```

### 2. R2 Storage Configuration
When connecting a new Cloudflare account and R2 bucket, populate in `.env`:
```env
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="base-engineering-assets"
R2_PUBLIC_URL="https://pub-your-bucket-id.r2.dev"
```

### 3. Production Build
```bash
npm run build
```

---

## License
&copy; Base Engineering. All rights reserved.

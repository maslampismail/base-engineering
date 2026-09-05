---
name: database
description: Manage and query the Base Engineering database using Prisma v5 with SQLite locally and Cloudflare D1 in production.
---

# Database Skill

Manage Base Engineering data using Prisma v5 with driverAdapters support.

## Architecture

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

- **Local:** SQLite database located at `prisma/dev.db`.
- **Production:** Cloudflare D1 with binding `base_db` configured in `wrangler.toml`.
- **Adapter:** `@prisma/adapter-d1`.
- **Preview Features:** `previewFeatures = ["driverAdapters"]` in `prisma/schema.prisma`.

## Core Models

- `Admin`: User authentication, credentials, and role.
- `Category`: Categories (Scaffolding, Shuttering, Support Systems, etc.).
- `Product`: Component data, specifications, materials, applications, slug.
- `ProductImage`: Multi-image gallery with primary flag and R2 object keys.
- `Company`: Corporate profile, address, phone, email, about copy.
- `CompanyHighlight`: Dynamic numeric milestones (`10+ Years`, `500+ Customers`).
- `HomepageSection`: Hero heading, subheading, description, CTAs, background images.
- `Application`: Sector showcase cards (Bridges, Infrastructure, High-Rise, etc.).
- `Enquiry`: Public quotation requests with workflow statuses (`NEW`, `CONTACTED`, `CLOSED`).
- `Media`: Stored asset metadata (keys, mime types, sizes, URLs).

## Development Rules

1. **Server-Side Access Only:** Keep all database queries in server components or API route handlers. Never import Prisma directly in `"use client"` components.
2. **Dynamic Data:** Never hardcode production products or company information. All content must originate from the database.
3. **Relationships & Indexes:** Maintain proper foreign key relationships (`onDelete: Cascade` or `SetNull`), unique slugs, and sorting orders.
4. **Local Migrations:** Use `npx prisma db push` during local development to synchronize the schema.
5. **Seeding:** Keep `prisma/seed.js` updated with realistic scaffolding and construction components.

---
name: cloudflare
description: Configure and manage Cloudflare Workers, Pages, D1 database, and R2 object storage for Base Engineering.
---

# Cloudflare Skill

Deploy and operate Base Engineering on Cloudflare's serverless infrastructure.

## Runtime & Tooling

- **Deployment Platform:** Cloudflare Pages / Workers
- **Compatibility:** Node.js compatibility enabled (`compatibility_flags = ["nodejs_compat"]`)
- **CLI:** `wrangler`
- **Output Dir:** `.vercel/output/static`

## Cloudflare D1 Database

- Production D1 database binding: `valencia_db`
- Defined in `wrangler.toml`:
  ```toml
  [[d1_databases]]
  binding = "valencia_db"
  database_name = "valencia_db"
  database_id = "<your-d1-database-id>"
  ```
- Connection handled automatically via `lib/prisma.js` and `@prisma/adapter-d1`.

## Cloudflare R2 Storage

- Used for storing high-resolution product photography, hero images, and company media.
- Accessed via `@aws-sdk/client-s3` in `lib/r2.js`.
- Configured via environment variables:
  - `R2_ACCOUNT_ID`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME` (e.g. `base-engineering-assets`)
  - `R2_PUBLIC_URL`
- **Local Fallback:** When R2 environment variables are missing, uploads automatically route to `/public/uploads/` on the local filesystem.
- **Storage Rule:** Store only URLs, object keys, and file metadata in the database. Never store raw binary image buffers in D1.

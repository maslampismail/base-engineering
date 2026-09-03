---
name: admin
description: Build and maintain the Base Engineering admin dashboard, content management modules, and authentication security.
---

# Admin Dashboard Skill

The Admin Control Center manages all dynamic content for Base Engineering.

## Core Admin Modules

1. **Dashboard (`/admin`):**
   - KPI metrics: Total Products, Active Products, Categories, New Inquiries.
   - Recent enquiries table with 1-click status updater.
   - Catalog overview.

2. **Products (`/admin/products`, `/admin/products/new`, `/admin/products/[id]`):**
   - Full CRUD operations.
   - Multi-image uploader (R2 / local fallback).
   - Dynamic specifications table builder (Key-Value pairs).
   - Category assignment, sort ordering, active and featured toggles.

3. **Categories (`/admin/categories`):**
   - Create, edit, and reorder categories.
   - Shows live product counts per category.

4. **Company Profile (`/admin/company`):**
   - Legal name, tagline, about narrative, phone, email, factory address, social links.

5. **Homepage Content (`/admin/homepage`):**
   - Hero headline, subheading, description, CTA labels, CTA links, background image.

6. **Highlights (`/admin/highlights`):**
   - Dynamic numerical milestones (`10+ Years`, `500+ Customers`).

7. **Applications (`/admin/applications`):**
   - Industrial sector showcase cards (Bridges, Infrastructure, High-Rise).

8. **Enquiries (`/admin/enquiries`):**
   - Lead management filtered by status: `ALL`, `NEW`, `CONTACTED`, `CLOSED`.
   - View complete contractor message and product requested.
   - Direct status updates.

9. **Media Storage (`/admin/media`):**
   - Direct file upload to R2 / local storage.
   - Copyable public URLs.

## Security Requirements

- All `/admin/*` routes must be protected via `getAdminSession()`.
- API endpoints performing mutations (`POST`, `PUT`, `DELETE`) must verify admin authentication.
- Passwords must be hashed using bcrypt (cost factor 10).
- Session tokens are stored in secure HTTP-only cookies (`base_admin_token`).
- Default seed account: `admin@baseengineering.com` / `admin123456`.

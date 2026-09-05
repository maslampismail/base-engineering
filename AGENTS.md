# Base Engineering — AI Development Guidelines

All AI agents and developers working on the **Base Engineering** codebase must follow the comprehensive project rules and skills established in the `.agents/` directory:

- **Master Project Rules:** [`.agents/rules/base-engineering.md`](file:///.agents/rules/base-engineering.md)
- **UI Design System Skill:** [`.agents/skills/base-ui/SKILL.md`](file:///.agents/skills/base-ui/SKILL.md)
- **Database & Prisma Skill:** [`.agents/skills/database/SKILL.md`](file:///.agents/skills/database/SKILL.md)
- **Cloudflare D1 & R2 Skill:** [`.agents/skills/cloudflare/SKILL.md`](file:///.agents/skills/cloudflare/SKILL.md)
- **Admin Dashboard Skill:** [`.agents/skills/admin/SKILL.md`](file:///.agents/skills/admin/SKILL.md)
- **Git & GitHub Workflow Skill:** [`.agents/skills/git-workflow/SKILL.md`](file:///.agents/skills/git-workflow/SKILL.md)
- **Safe Changes & Debugging Skill:** [`.agents/skills/debugging/SKILL.md`](file:///.agents/skills/debugging/SKILL.md)
- **Frontend Quality & SEO Skill:** [`.agents/skills/frontend-quality/SKILL.md`](file:///.agents/skills/frontend-quality/SKILL.md)

---

## Core Summary
1. **Brand Identity:** Established industrial manufacturer (scaffolding jacks, spans, shutters, props, accessories) — NOT a SaaS, tech agency, or consumer shop.
2. **Routing:** Strict single-page landing site on `/` with anchor links (`/#about`, `/#products`, `/#contact`); individual product detail pages at `/products/[slug]`.
3. **Database:** Prisma v5 with `driverAdapters` — local SQLite (`prisma/dev.db`), production Cloudflare D1 (`base_db`).
4. **Media:** Cloudflare R2 via `@aws-sdk/client-s3` with local `/public/uploads` fallback.
5. **Anti-Overbuilding:** Do not add blogs, careers, pricing tiers, carts, or AI bots unless explicitly requested.

---
name: debugging
description: Systematic root-cause debugging and safe code modification methodology for Base Engineering.
---

# Debugging Skill

Diagnose and resolve issues in Base Engineering while preserving existing functionality and avoiding regressions.

## 8-Step Debugging Protocol

1. **Understand Expected Behavior:** Clarify the intended outcome vs current behavior.
2. **Inspect Implementation:** Read relevant components, API routes, or database queries.
3. **Reproduce:** Replicate the issue locally (via browser, curl, or test run).
4. **Trace Flow:** Follow the data pipeline:
   `User Action → React Component → API Route → Prisma → SQLite / D1`
5. **Identify Root Cause:** Pinpoint the exact line or logic failure.
6. **Smallest Required Fix:** Change only what is necessary to fix the root cause.
7. **Test Affected Feature:** Verify the bug is resolved.
8. **Verify No Regressions:** Check adjacent features and run `npm run build`.

## Critical Guidelines

- **No Random Refactoring:** Never refactor unrelated files while fixing a bug.
- **Preserve Existing Architecture:** Do not replace working frameworks, libraries, or patterns without explicit user authorization.
- **Authentication Flows:** If cookies, sessions, or tokens are involved, trace the full request lifecycle (`lib/auth.js` → `route.js` → middleware/components).
- **Graceful Error States:** Ensure components handle missing data, null fields, and failed network calls with clear, user-friendly UI instead of throwing white-screen exceptions.

---
name: git-workflow
description: Enforce safe Git and GitHub practices, commit standards, secrets prevention, and branch workflows for Base Engineering.
---

# Git and GitHub Workflow Skill

Ensure all changes to the Base Engineering repository adhere to security and version control standards.

## Pre-Change Checklist

Before modifying files:
1. `git status`: Review untracked or modified files.
2. `git branch`: Confirm current working branch (default: `main`).
3. `git log -n 5 --oneline`: Understand recent changes and commit history.

## Pre-Commit Verification

Before staging or committing:
1. **No Secrets:** Confirm `.env`, API keys, tokens, or credentials are NOT staged.
2. **No Databases:** Ensure SQLite files (`*.db`, `*.db-journal`) are excluded.
3. **Check Diff:** Run `git diff --stat` and `git diff` to verify only intentional changes are included.
4. **Build Verification:** Run `npm run build` and ensure 0 compilation/type errors.

## Commit Standards

Write clear, structured commit messages describing the actual change:
- `feat: add dynamic product management`
- `fix: resolve product image upload error`
- `fix: correct admin authentication cookie handling`
- `refactor: optimize database query in product detail page`
- `docs: update setup instructions in README`

## Prohibited Actions

- Never run `git push --force` on `main`.
- Never commit `.env`, `.env.local`, `.pem` files, or production credentials.
- Never stage temporary test scripts, build caches (`.next/`), or uploaded test image files.
- Remote repository: `git@github.com:maslampismail/base-engineering.git`.

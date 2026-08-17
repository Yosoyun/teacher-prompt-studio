# RUNBOOK — teacher-prompt-studio

> Stamped 2026-08-17. Commands below are read from package.json and the CI workflow;
> not re-executed locally on 2026-08-17 — CI (lint+test+build) was green for f6ede7f.

**Run:** `npm run dev` (vinext dev; wrangler logs to `.wrangler/`)
**Build:** `npm run build` (vinext) · Pages bundle: `npm run build:pages` (vite.pages.config.ts → `dist-pages/`)
**Test / verify:** `npm test` (builds, then `node --test tests/rendered-html.test.mjs`) · `npm run lint`
**Deploy:** push `main` to the `github` remote — `.github/workflows/deploy-pages.yml` runs lint, test, `npm audit --audit-level=high`, `build:pages`, then deploys `dist-pages/` to GitHub Pages. No manual deploy step. Only `main` deploys (see BRANCHES.md).
**Dependencies & versions:** CI pins Node 22 (`npm ci`); local machine has v25.6.1. Next 16.3.0, React 19.2.8, vinext 0.0.45, vite 8.1.5, wrangler 4.121.0, Tailwind 4.3.3, TypeScript 5.9.3.
**Known traps:**
- The remote is named `github`, not `origin` — tooling that assumes `origin` reports "no remote" (the DNA stamper did exactly this).
- Pages deploys only from `main`; work on `codex/*` branches is invisible on the live site until it lands on `main`.
- Local `main` is stale (9 behind github/main as of 2026-08-17) — don't branch from it before fast-forwarding.

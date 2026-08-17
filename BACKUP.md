# BACKUP — teacher-prompt-studio

- **Remote:** https://github.com/Yosoyun/teacher-prompt-studio.git — remote name is `github`, NOT `origin`
- **Cloud lanes:** nightly estate snapshot → Google Drive (gdrive:EstateSnapshots) · weekly git bundle → gdrive:EstateBundles
- **Gitignored & why:** `node_modules` (reinstallable via `npm ci`); build/runtime outputs `/dist`, `/dist-pages`, `/.next`, `/.vinext`, `/.wrangler`, `/out`, `/outputs`, `/work`, `/tmp`, `/coverage` (all rebuildable); `.env*` (secrets stay local). No large-media lane needed — sample PDFs/DOCX in `public/samples/` are tracked in git.
- **Restore on a blank Mac:** `git clone https://github.com/Yosoyun/teacher-prompt-studio.git` (or `git clone latest.bundle`), `npm ci`, then follow RUNBOOK.md.
- Last restore drill: never — do one.

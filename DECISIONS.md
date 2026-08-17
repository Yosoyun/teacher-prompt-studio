# DECISIONS — teacher-prompt-studio (append-only)

_D-numbered, dated, with rationale. LLMs: do not re-litigate entries; propose changes as NEW entries._

## D1 · 2026-08-17 · Adopt the estate DNA standard
This project follows the estate continuity kit (STATE/WORKLOG/DECISIONS/RESUME/RUNBOOK/BACKUP + validate.sh; README.md serves as the entry doc — no separate AGENTS.md). Rationale: any agent or human must be able to continue cold; survey of 2026-08-17.

## D2 · 2026-08-17 · github/main is the authoritative branch
Measured, not assumed: `codex/provider-output-audit` is byte-identical to `github/main` (f6ede7f, 0/0 divergence) and local `main` is 9 behind / 0 ahead. Pages deploys only from `main` (workflow restricted by b623a41). Full map with evidence: BRANCHES.md. Do not treat any `codex/*` branch as the working truth without re-measuring.

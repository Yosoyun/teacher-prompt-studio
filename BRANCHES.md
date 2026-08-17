# BRANCHES — teacher-prompt-studio (mapped 2026-08-17)

**Authoritative branch: `github/main`** (tip `f6ede7f` "Harden provider file delivery contracts", 2026-08-12).
The remote is named `github`, not `origin`: https://github.com/Yosoyun/teacher-prompt-studio.git

## The three branches that matter (evidence: `git branch -vv`, `git rev-list --count`, 2026-08-17)

| Branch | Tip | Position | Verdict |
|---|---|---|---|
| `github/main` | `f6ede7f` | — | **Truth.** Everything shipped lives here. |
| `codex/provider-output-audit` (checked out) | `f6ede7f` | 0 ahead / 0 behind github/main | Identical to github/main — the provider-audit work has fully landed. Nothing unmerged here. |
| local `main` | `547f2f2` | 0 ahead / **9 behind** github/main | Stale. Fast-forward is safe: `git fetch github && git checkout main && git merge --ff-only github/main` |

Last 3 on each (git log --oneline -3, 2026-08-17):
- **main:** `547f2f2` Transform Teacher Prompt Studio into an adaptive prompt architect · `039c293` Build Teacher Prompt Studio (branch has only these 2 commits)
- **github/main:** `f6ede7f` Harden provider file delivery contracts · `e5021dc` Synchronize teacher release metadata · `1ce4b9a` Simplify teacher creation flow
- **codex/provider-output-audit:** same three shas as github/main — byte-identical history.

## How deploys work

GitHub Pages deploys **only from main**, via `.github/workflows/deploy-pages.yml`
(`on: push: branches: [main]`; lint → test → audit → `build:pages` → deploy `dist-pages/`).
That workflow was authored on the `agent/github-pages` branch (`f1fe19a` "Add GitHub Pages
deployment", `b623a41` "Restrict Pages deployment to main") and now lives on main itself.
Consequence: work merged to any `codex/*` branch is NOT live until it reaches main.
Live site verified HTTP 200 on 2026-08-17.

## The other seven branches — all historical

Merged by ancestry into github/main: `codex/sync-teacher-metadata` (`e5021dc`, behind 1),
`codex/simplify-teacher-flow` (`1ce4b9a`, behind 2).

Squash-merge leftovers — tip is not an ancestor, but the same work appears on github/main
as a squashed PR commit (matched by subject):

| Branch (tip, 2026-07-19/20) | Landed on main as |
|---|---|
| `agent/github-pages` (`b623a41`) | `58209bf` Publish Teacher Prompt Studio on GitHub Pages (#1) |
| `codex/beast-ui` (`332045c`) | `2d1510e` Transform Teacher Prompt Studio into an AI command centre |
| `codex/artifact-first-ux` (`d429171`) | `e37f41f` Rebuild Teacher Prompt Studio around real artifacts |
| `codex/academic-artifact-quality` (`3e0da9d`, 2 commits) | `553a43c` Raise artifact output to academic production quality (#4) |
| `codex/fix-launch-ai` (`1860572`) | `a2c4f3c` Make Launch AI impossible to miss (#5) |
| `codex/investor-readiness` (`c1f609d`) | `2acf260` Build investor-ready teacher artifact workflow (#6) |

Subject-matching is strong evidence but not a byte-level diff; run `git diff <branch> github/main`
before deleting any of them (content-identity unverified as of 2026-08-17).

## Context

This folder was named **"Maths Chatgpt"** until the 2026-08-17 estate reorg moved it to
`~/Desktop/Code/live/teacher-prompt-studio`. This file exists because the estate survey found
"10 branches, main behind by 9, no doc says which is truth" — now one does. Keep it current
when a branch merges or dies.

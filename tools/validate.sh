#!/bin/sh
# validate.sh — executable handoff for teacher-prompt-studio (estate-dna).
# Exit 0 = state looks trustworthy. Non-zero output lines = drift warnings.
cd "$(dirname "$0")/.." || exit 1
echo "== teacher-prompt-studio validate ($(date +%F))"
LAST=$(git log -1 --format=%cs 2>/dev/null)
echo "last commit: $LAST  |  $(git log -1 --format=%s 2>/dev/null)"
DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
[ "$DIRTY" != "0" ] && echo "WARN: $DIRTY uncommitted paths — session-end law violated?"
git rev-parse --abbrev-ref @{u} >/dev/null 2>&1 || echo "WARN: no upstream remote"
AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null)
[ -n "$AHEAD" ] && [ "$AHEAD" != "0" ] && echo "WARN: $AHEAD commits unpushed"
for f in STATE.md PROJECT-STATE.md PROJECT_STATE.md PROJECT_STATUS.md; do
  if [ -f "$f" ] && [ -n "$LAST" ]; then
    DOC=$(date -r "$f" +%F 2>/dev/null)
    [ "$DOC" \< "$LAST" ] && echo "WARN: $f ($DOC) older than last commit ($LAST) — trust git log"
    break
  fi
done
echo "== done"

#!/usr/bin/env bash
# Read-only local preflight for the Miono / Jobs Done home-session runbook.
# Usage: bash scripts/home-preflight.sh
# No SSH, deployment, DNS modification, git pull, npm install or credentials collection.
set -uo pipefail
echo "MIONO / JOBS DONE — HOME SESSION PREFLIGHT"
echo "----------------------------------------"
date -u '+UTC: %Y-%m-%dT%H:%M:%SZ'
echo
say_check() { local label="$1" cmd="$2"; if command -v "$cmd" >/dev/null 2>&1; then echo "[FOUND] $label: $(command -v "$cmd")"; else echo "[MISSING] $label ($cmd)"; fi; }
say_check "Git" git
say_check "Node.js" node
say_check "npm" npm
say_check "GitHub CLI (optional)" gh
say_check "curl" curl
say_check "SSH client (optional)" ssh
echo
if command -v node >/dev/null 2>&1; then node --version; fi
if command -v npm >/dev/null 2>&1; then npm --version; fi
if command -v git >/dev/null 2>&1; then
  echo
  echo "Local checkout:"
  git rev-parse --is-inside-work-tree 2>/dev/null || true
  git remote -v 2>/dev/null | sed -E 's#(https?://)[^/@]+:[^/@]+@#\1[REDACTED]@#g' || true
  git branch --show-current 2>/dev/null || true
  git rev-parse HEAD 2>/dev/null || true
  git status --short 2>/dev/null || true
fi
if command -v gh >/dev/null 2>&1; then
  echo
  echo "GitHub login (status only; no token emitted):"
  gh auth status 2>&1 | sed -E 's/(Token:).*/\1 [REDACTED]/Ig' | head -20 || true
  echo "Jobs Done implementation PR:"
  gh pr view 2 --repo dutchiono/jobsdone-web --json number,state,isDraft,mergeable,headRefName,url --jq '{number,state,isDraft,mergeable,headRefName,url}' 2>/dev/null || echo "Not readable via this gh session"
fi
if command -v curl >/dev/null 2>&1; then
  echo
  echo "Public URL HEAD/GET checks (not a deployment test):"
  for u in https://miono.live/ https://jobsdone.team/ https://dutchiono.github.io/jobsdone-web/; do
    printf '  %-49s ' "$u"
    curl -L -sS -o /dev/null --max-time 15 -w 'HTTP %{http_code}, target %{url_effective}, TLS verify %{ssl_verify_result}\n' "$u" || echo "UNREACHABLE"
  done
fi
echo
echo "NEXT: open docs/HOME-SESSION-RUNBOOK.md and complete Gate A then Gate B."
echo "Do not merge or deploy until source ownership, backup and rollback have been verified."

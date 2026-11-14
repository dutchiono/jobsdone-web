#!/usr/bin/env bash
# Post-launch HTTP/TLS smoke checks for the two sites.
# It does not mutate anything and is not a substitute for form/JS/manual/browser tests.
# Usage: bash scripts/check-live-sites.sh
set -uo pipefail
if ! command -v curl >/dev/null 2>&1; then echo "curl is required" >&2; exit 2; fi
failed=0
check() {
  local label="$1" url="$2" response code verify final
  response="$(curl --proto '=https' --tlsv1.2 -L -sS --max-time 20 -o /dev/null -w '%{http_code}|%{ssl_verify_result}|%{url_effective}' "$url")" || {
    echo "[FAIL] $label $url (connection/TLS problem)"
    failed=$((failed+1)); return
  }
  IFS='|' read -r code verify final <<< "$response"
  case "$code" in 200) ;; *) echo "[FAIL] $label $url HTTP $code -> $final"; failed=$((failed+1)); return;; esac
  if [ "$verify" != "0" ]; then echo "[FAIL] $label $url TLS verify $verify"; failed=$((failed+1)); return; fi
  echo "[PASS] $label $url -> $final"
}
echo "Post-launch HTTP checks. Expected: all HTTPS, HTTP 200 after redirect."
check "Jobs Done" "https://jobsdone.team/"
check "Jobs Done templates" "https://jobsdone.team/templates/"
check "Jobs Done automation" "https://jobsdone.team/automation/"
check "Miono Studio" "https://miono.live/"
if [ "$failed" -gt 0 ]; then
  echo "$failed failing check(s). Verify deployment routing; if critical, roll back."
  exit 1
fi
echo "HTTP/TLS checks passed. Still verify CSS/JS, browser console, lead contact and mobile navigation manually."

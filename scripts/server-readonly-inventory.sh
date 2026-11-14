#!/usr/bin/env bash
# Run ON the server after confirming SSH identity.
# Read-only bounded inventory; no sudo required except optional nginx config test.
# This may reveal internal paths/hosts. Do not publish raw output.
set -uo pipefail
echo "=== HOST (REDACT BEFORE SHARING) ==="
hostname
date -u '+%Y-%m-%dT%H:%M:%SZ'
id -un
uname -srm
echo "=== DISK ==="
df -h / /var/www /srv 2>/dev/null || df -h /
echo "=== WEB SERVICE ==="
if command -v nginx >/dev/null 2>&1; then
 nginx -v 2>&1 || true
 if command -v sudo >/dev/null 2>&1; then
   sudo -n nginx -t 2>&1 || echo "nginx config check needs approved elevation"
 fi
fi
echo "=== CANDIDATE SITE PATHS ==="
for dir in /var/www/jobsdone /srv/drink /srv/drink/www /var/www/html; do
 if [ -e "$dir" ]; then
   printf '[EXISTS] %s\n' "$dir"
   ls -ld "$dir" 2>/dev/null || true
 else
   printf '[MISSING] %s\n' "$dir"
 fi
done
echo "=== WEBROOT REPOSITORIES (READ ONLY) ==="
for dir in /var/www/jobsdone /srv/drink/www/miono.live/current /srv/drink/www/jobsdone.team/current /srv/drink/www/miono.live /srv/drink/www/jobsdone.team; do
 if [ -d "$dir/.git" ] || [ -f "$dir/.git" ]; then
   echo "PATH: $dir"
   git -C "$dir" rev-parse --show-toplevel 2>/dev/null || true
   git -C "$dir" remote -v 2>/dev/null | sed -E 's#(https?://)[^/@]+:[^/@]+@#\1[REDACTED]@#g' || true
   git -C "$dir" rev-parse --abbrev-ref HEAD 2>/dev/null || true
   git -C "$dir" rev-parse HEAD 2>/dev/null || true
   git -C "$dir" status --short 2>/dev/null | head -25 || true
 fi
done
echo "=== SITE DIRS ==="
if [ -d /srv/drink/www ]; then
  find /srv/drink/www -mindepth 1 -maxdepth 2 -type d 2>/dev/null | head -80
fi
echo "=== DNS / TLS (NO MUTATION) ==="
for host in miono.live jobsdone.team; do
  if command -v getent >/dev/null 2>&1; then
    echo "$host: $(getent ahostsv4 "$host" 2>/dev/null | awk '{print $1}' | sort -u | paste -sd ',' -)"
  fi
done
echo "=== COMPLETE ==="
echo "Save results privately; redact internal addresses and credentials before sharing."
echo "Do not run git pull, copy files, or reload nginx until Gate B backup and rollback are verified."

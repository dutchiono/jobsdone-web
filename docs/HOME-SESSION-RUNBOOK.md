# Miono / Jobs Done — Home-session execution runbook
**One authoritative checklist.** Last prepared: 2026-11-14.
**Goal:** finish the consolidation already in progress, launch reviewed Miono and Jobs Done sites, and leave a smaller, intelligible, maintainable ecosystem. This is a production operations document; **do not assume a check is complete merely because the code exists.**

> **Current state:** No verified public preview deployment. `dutchiono/jobsdone-web` PR #2 builds and passes CI, but is unmerged; `jobsdoneteam/jobsdone-web` is readable yet not writable through the connected GitHub integration; Gateway lists Miono server at 198.71.54.203 as unavailable. GitHub Pages responds 404; attempts to enable it from CI receive 403. No production deployment was performed during this work.
>
> **Hard rule:** Do not change DNS, Nginx, SSH, production paths, owner repositories, or archive/delete source until an explicit backup and a verified rollback path exist. Never paste credentials into GitHub issues, README, ChatGPT, log files, or the checklist.

## Fast navigation
- [00: Decide the real ownership and boundaries](#00-decide-the-real-ownership-and-boundaries)
- [01: Capture production inventory and backup](#01-capture-production-inventory-and-backup)
- [02: Validate the consolidated build](#02-validate-the-consolidated-build)
- [03: Get a live review URL](#03-get-a-live-review-url)
- [04: Reconcile repositories and deployment](#04-reconcile-repositories-and-deployment)
- [05: Publish Jobs Done and Miono](#05-publish-jobs-done-and-miono)
- [06: Validate the release and have a rollback](#06-validate-the-release-and-have-a-rollback)
- [07: Clean up source repositories](#07-clean-up-source-repositories)
- [08: What comes after launch](#08-what-comes-after-launch)
- [Appendix: known implementation inventory](#appendix-known-implementation-inventory)

## Session record — fill this out once
| Field | Recorded value |
| --- | --- |
| Session date | TODO |
| Operator | TODO |
| Host/IP | 198.71.54.203 **candidate; verify** |
| Production Miono repo/branch | **UNKNOWN — discover** |
| Production Jobs Done repo/branch | **UNKNOWN — check whether jobsdoneteam/jobsdone-web is canonical** |
| Before-release Miono git SHA | TODO |
| Before-release Jobs Done git SHA | TODO |
| Proposed Jobs Done SHA | Feature PR #2 head, record exact SHA from GitHub |
| Preview URL and screenshot evidence | TODO |
| Backup location and restore test | TODO |
| Launch decision | GO / NO-GO, with reason |
| Launch timestamp | TODO |
| Rollback owner | TODO |
| Follow-up issue/PR | TODO |

## Stop conditions — apply at every stage
- **STOP** if you cannot identify which repository and commit a public domain currently serves.
- **STOP** if backups are not independent of the directory you will overwrite or cannot be restored.
- **STOP** if the login/SSH method, privilege, DNS, TLS, or production directory is unclear.
- **STOP** if a new build accidentally includes personal family data, private repository metadata, API keys, fictitious testimonials, unsupported results, or hidden credentials.
- **STOP** if preview and production use the same write credentials, live databases or deployment targets.
- **STOP** if the checked-out commit or GitHub Action points at a different repository than the owner intended.
- **STOP** if a mandatory check fails. A green frontend build is not evidence of a functioning domain or back-end integration.

## 00: Decide the real ownership and boundaries
- [ ] **A1** Confirm: **Miono Studio / miono.live** is the personal engineering umbrella; Jobs Done / jobsdone.team is the small-business product; independent games, Web3 products and AI agents retain independent identities.
- [ ] **A2** Confirm the canonical Jobs Done repo: `dutchiono/jobsdone-web` or `jobsdoneteam/jobsdone-web` (the source content at baseline was byte-identical, but hosting script uses the latter).
- [ ] **A3** Identify who controls `jobsdoneteam` permissions. In this session, the GitHub integration received 403 when creating a branch there; no transfer, fork deletion or push should be performed until verified.
- [ ] **A4** Identify the *actual* source of `miono.live`. Do NOT assume `drink-miono-live` is correct; its README describes a different website.
- [ ] **A5** Record whether the two brands deploy to separate webroots and separate domains (preferred), or share a single server with separate Nginx vhosts.
- [ ] **A6** Explicitly decide whether the Miono preview at `jobsdone-web/studio/` is to be extracted to an existing Miono repo; **do not create a new canonical repo without checking for an existing source**.
- [ ] **A7** Confirm that work such as M. Jacob HVAC strategy can be public and label it **strategy/research**, not delivered client results.

**Evidence to save:** screenshots or URLs of repository settings and permissions; a table mapping `domain → DNS → Nginx server_name → webroot → git origin → branch → commit → deploy workflow`. Put that mapping in an operator-private record if it includes private infrastructure.

## 01: Capture production inventory and backup
This phase is mostly **read-only**. Use your preferred SSH terminal (Windows PowerShell, Termius, or Linux shell). Never paste passwords or private keys into the transcript.

- [ ] **B1** In GitHub, inspect [Jobs Done PR #2](https://github.com/dutchiono/jobsdone-web/pull/2), [CI runs](https://github.com/dutchiono/jobsdone-web/actions), and current deployment workflow; note last green SHA.
- [ ] **B2** Run the checked-in local report: `bash scripts/home-preflight.sh` (on Windows, use Git Bash or WSL), after cloning the feature branch. It does not mutate production.
- [ ] **B3** Restore SSH/Gateway access and verify the correct user/host key. The registered Miono host was `SERVER_NOT_READY`; do not guess the root password or disable authentication.
- [ ] **B4** On the server, run the **read-only** discovery helper `bash scripts/server-readonly-inventory.sh` from your local checkout or a safely transferred copy, then gather any missing non-secret facts. Do not execute it before validating you are on the correct server. Record results privately. The following manual commands supplement the helper:
  ```bash
  hostnamectl 2>/dev/null || hostname
  date -Is
  uptime
  df -h
  sudo nginx -t
  sudo nginx -T 2>&1 | grep -E 'server_name|root |proxy_pass|include ' | head -120
  find /var/www /srv/drink/www -maxdepth 3 -type d -name .git -print 2>/dev/null
  ```
  `nginx -T` is a privileged read: inspect its output **locally** for secrets, internal domains and other sensitive directives before sharing.
- [ ] **B5** For each relevant checked-out site, capture `pwd`, `git remote -v`, `git branch --show-current`, `git rev-parse HEAD`, and `git status --short`. **No git pull yet.**
- [ ] **B6** Determine whether `/var/www/jobsdone`, `/srv/drink/www/*/current`, or another path is the canonical live target for each brand. The site deployment workflow indicates `/var/www/jobsdone`, while other Miono-hosted projects refer to `/srv/drink/bin/add-site.sh` and `/srv/drink/www/...`.
- [ ] **B7** Record DNS A/AAAA/CNAME records for `miono.live`, `www.miono.live`, `jobsdone.team`, and `www.jobsdone.team`. Verify the current endpoints; do not assume they are all on one server.
- [ ] **B8** Save independent, timestamped backup copies of **each affected webroot**, Nginx vhost files, deployment configuration and git commit SHAs to a protected location **outside the paths to be modified**. Exclude/secure credentials and personal data; do not commit backups.
- [ ] **B9** Confirm there is enough disk capacity and that the backup artifact can be listed and extracted to a temporary location. If the site has a DB, use a database-aware snapshot mechanism; static file copies are not DB backups.
- [ ] **B10** Record a working rollback procedure: previous Git commit, previous webroot release, last working Nginx config, and how to restore DNS (including TTL considerations). Rehearse on staging if possible.

**Gate B:** Live source/repository/branch mapped; access stable; verified backups and rollback available. If not, stop here without touching production.

## 02: Validate the consolidated build
**Repository:** `dutchiono/jobsdone-web`, branch `feature/miono-jobsdone-rebuild-2026-11`.

- [ ] **C1** Clone/fetch the branch and record the exact SHA:
  ```bash
  git clone https://github.com/dutchiono/jobsdone-web.git
  cd jobsdone-web
  git fetch origin
  git switch feature/miono-jobsdone-rebuild-2026-11
  git rev-parse HEAD
  npm ci
  npm run build
  node tests/validate.mjs
  ```
- [ ] **C2** Open with `npm run dev -- --host 127.0.0.1` or `npm run preview -- --host 127.0.0.1`. On your local device, browse `http://127.0.0.1:5173/` for dev, or the URL printed by Vite for preview. These are **local** URLs, not shareable hosting.
- [ ] **C3** Verify four page roots: `/` (Jobs Done), `/studio/` (Miono preview), `/templates/` (industry preview), `/automation/` (Bot Foundry-compatible automation brief).
- [ ] **C4** Verify the 12 curated project cards and searchable public source index load from `/data/projects.json` and `/data/repositories.json`, respectively; **private repos must not appear**.
- [ ] **C5** Change industry five times; edit business name; verify preview updates. It is a design preview, not an implemented CMS, checkout or booking engine.
- [ ] **C6** Fill automation brief; copy/download JSON; confirm `schema=jobsdone.automation-brief.v1` and that the file contains no credentials. The integration does **not** auto-execute bots.
- [ ] **C7** Confirm contact address, inquiry email action, SEO description/title, favicon and site links. Email launch uses `mailto:`; test on phone and desktop, and decide whether a server-backed intake is needed before launch.
- [ ] **C8** Review mobile widths (320px, 390px, tablet), keyboard navigation, focus indicators, missing-image behavior and reduced-motion preference. Test both light and dark browser modes where useful.
- [ ] **C9** Review public claims and authorship: no fake testimonials, revenue/SEO metrics, active customers, or upstream fork projects represented as entirely original.
- [ ] **C10** Check `git diff master...HEAD`, including `.github/workflows/*` for accidental deployment. The existing master workflow has SSH deployment on merge/push; **do not merge until Gate D**.

**Gate C:** CI green, local manual review satisfactory, no privacy or customer-claim problem, feature branch remains production-safe.

## 03: Get a live review URL
- [ ] **D1** Pick a staging route **without overwriting production**:
  - Preferred: authorized hosting provider or existing isolated Bushleague designer lane after DNS/TLS and dedicated credentials are verified.
  - Alternative: GitHub Pages, once an administrator enables Pages in repository Settings; earlier Pages API returned 404 and enabled-from-CI returned 403.
  - Alternative: connect Vercel and deploy the exact reviewed branch there, using build command `npm run build` and output directory `dist`.
- [ ] **D2** Confirm the staging deployment uses the **exact commit SHA** reviewed in Gate C.
- [ ] **D3** Do not copy live `.env`, tokens, payment keys, CRM data, wallet keys or database credentials to staging.
- [ ] **D4** Make sure staging serves all deep routes and static assets. GitHub Pages uses a repository subpath, whereas a normal domain-hosted Vite build uses `/`; test direct navigation to `/studio/`, `/templates/`, `/automation/`.
- [ ] **D5** Open the site from a device **not logged into the provider**. Require HTTP 200, working CSS/JS, no browser errors, functional inputs, and shareable URL.
- [ ] **D6** Record the final staging URL and take a screenshot for the release record. **Do not invent a live URL based on a successful Actions build.**

**Gate D:** At least one live staging URL verified on a real browser. If external hosting permissions remain blocked, stay on local preview and do not mark this gate done.

## 04: Reconcile repositories and deployment
- [ ] **E1** Choose canonical Jobs Done repository owner. Baseline `dutchiono/jobsdone-web` and `jobsdoneteam/jobsdone-web` were byte-identical for core files. Decide which remains the authoritative product source.
- [ ] **E2** Secure write permission for that canonical repository. Current ChatGPT GitHub connection cannot write `jobsdoneteam/jobsdone-web`.
- [ ] **E3** Determine whether the old GitHub Action's `git remote set-url origin https://github.com/jobsdoneteam/jobsdone-web.git` is intentional. Remove unintentional cross-repo pulls. The deploy must use the **commit it built**, not another repository's moving `master`.
- [ ] **E4** Review the SSH deploy method: the old workflow uses password-based SSH on every push to `master`. Prefer a scoped deploy key and a deploy-only user with minimal webroot permissions. Don't change active credentials until rollback is ready.
- [ ] **E5** Confirm that `miono.live` is mapped to its own canonical source; copy/move the studio preview out of the Jobs Done repo only after locating the current owner. Preserve history and final URL.
- [ ] **E6** Decide how the shared project registry is maintained: a reviewed JSON source in the canonical repo, generated artifacts for other sites, and no separate unmanaged copies.
- [ ] **E7** Update and review any CI/deploy changes on a branch; do not directly mutate `master` or production via a risky one-liner.
- [ ] **E8** Verify deploy origin, branch, commit SHA and checksums in staging, then simulate rollback.

**Gate E:** Ownership resolved, CI deploy points at one canonical source, staging and production are isolated, rollback tested.

## 05: Publish Jobs Done and Miono
- [ ] **F1** Choose and record a maintenance/launch window. Avoid other running deploys and ensure a second device can check each public URL.
- [ ] **F2** Recheck backups and the old working SHAs immediately before cutover.
- [ ] **F3** Publish **Jobs Done** from the reviewed branch/release using the canonical deploy process. No direct overwrite of old checkout without a backup.
- [ ] **F4** Verify `jobsdone.team` and its `www` redirect, TLS, content, internal links, form behavior, and assets from an external device.
- [ ] **F5** Publish **Miono Studio** only from its newly verified canonical source and configuration. Keep separate branding, navigation, contact, and analytics from Jobs Done.
- [ ] **F6** Verify `miono.live`, direct navigation, working portfolio filters, public-only registry, external repo links, responsive design, TLS and redirects.
- [ ] **F7** Confirm the sites link to each other intentionally: Jobs Done credits Miono, Miono lists Jobs Done as the business product. Do **not** create competing agency brands.
- [ ] **F8** Commit/release-tag both site SHAs and update the release record with actual URLs and timestamps.
- [ ] **F9** If anything critical fails, execute rollback first; debug only after restoring the last known working experience.

**Gate F:** Both production domains externally reachable, no critical regressions, owner can verify recorded deployed revisions.

## 06: Validate the release and have a rollback
- [ ] **G1** Run the checked-in HTTP smoke test: `bash scripts/check-live-sites.sh` (after reviewing expected domain routes); non-200/TLS errors fail.
- [ ] **G2** Test top-level and deep links in private/incognito session, on desktop and phone. Check 404 pages and redirects.
- [ ] **G3** Verify Core Web Vitals/Lighthouse, accessibility, sitemap/robots, canonical URLs, social share preview and page metadata. Record current readings; do not claim improvements without before/after evidence.
- [ ] **G4** Submit a **test inquiry** from the website; verify actual email routing and spam safeguards. If still `mailto:`, mark server-side lead capture as not implemented.
- [ ] **G5** Confirm analytics instrumentation and privacy notice are appropriate before collecting user information. Avoid logging inquiry text in unprotected telemetry.
- [ ] **G6** Confirm that static page assets contain no API keys or hidden private repository information.
- [ ] **G7** Check service and webserver logs for site-specific errors without copying credentials into GitHub or ChatGPT.
- [ ] **G8** Keep the old release and rollback instructions available until acceptance is confirmed.

**Gate G:** Launch accepted with evidence. Release complete does **not** mean repo-sprawl cleanup is finished.

## 07: Clean up source repositories
**Do this after launch, in controlled batches. Never bulk-delete.**

- [ ] **H1** Use the actual public audit JSON/CSV from [GitHub Actions](https://github.com/dutchiono/jobsdone-web/actions) and the duplicate scan. Refresh metadata; do not rely on name-only guesses.
- [ ] **H2** Treat all 135 accessible repositories as the initial accountable universe (114 public / 21 private at the time); reconcile the additional `~25` repositories not surfaced by the connector with accounts, organizations, archives and access permissions. Do not publish private names.
- [ ] **H3** For **every** repository, record canonical owner, original/forked contribution, license, root files, stack, tests, CI, deployment, domains, consumers and decision: product / shared library / reference / experiment / superseded / archive candidate.
- [ ] **H4** Review `ionoi-sites`: useful template concepts are in Jobs Done, original README now says superseded; verify no external consumers before archiving. Preserve repo/history until approved.
- [ ] **H5** Review the six architecture sources already copied to `architects-and-agents`. Verify no unique files or inbound links are lost. Archive **only if** that is the intended end state and rollback links exist.
- [ ] **H6** Review `bot-foundry` ↔ `dotcache-builder`: six exact shared source files were found. Extract a shared package or library only after testing differences and operational boundaries. Dotcache Builder has a separate Convex/deployment environment and is intentionally not the general bot runtime.
- [ ] **H7** Review `cache-bar` ↔ `dotcache-james`: 20 identical files, but one is an intentionally isolated designer lane. Preserve independent deployment and customer/tenant isolation.
- [ ] **H8** Review `coveragedesk` ↔ `markbets`: at least five identical source files; consider a reusable odds/line-data package, not a merged financial operation or shared production database.
- [ ] **H9** Review `dutchiono/milady` ↔ `milady-ai/milady`: 49 identical source files. Preserve upstream provenance; distinguish personal contribution from upstream repository content.
- [ ] **H10** Review `feather-app` ↔ `stablecharts`: approximately 95% unique-line overlap in one major server file. Diff actual modules, preserve chain-specific behavior and deployment, then extract common code with tests if practical.
- [ ] **H11** Review `plugin-anthropic` ↔ `plugin-google-genai` for shared adapter infrastructure; keep provider-specific behavior independent.
- [ ] **H12** Review `solana-trail` ↔ `hood-trail`: conceptually related survival games, but root tooling differs. Seek common simulation modules only with proven reusable code.
- [ ] **H13** For all 39 public forks identified, document upstream, local changes and license. Don't list untouched forks as standalone original products.
- [ ] **H14** For 40 repos lacking conventional root source, check actual subtrees/monorepos, docs and workflow consumers before classifying as docs-only or cleanup candidates.
- [ ] **H15** Resolve the old closed [jobsdone-growth PR #1](https://github.com/dutchiono/jobsdone-growth/pull/1) privacy issue: an early commit contained private repo identifiers. Removing rows from the latest file did not remove their history. Inspect permission/exposure and clean up branch/history with the appropriate GitHub-admin procedure; avoid copying private identifiers into new artifacts.
- [ ] **H16** For each retirement candidate: save immutable tag/backup, update canonical documentation and inbound links, verify consumers, then **archive** first when approved; deletion requires a separate explicit decision.
- [ ] **H17** Check that the public portfolio points only to vetted projects and has no stale links, fake live URLs, invented results or leaked private details.
- [ ] **H18** Record final counts: active products, shared platforms, reusable packages, reference archives, experiments, migrated repos, archived repos, remaining unresolved repos. Every source should have an explicit next action.

**Gate H:** Cleanup is complete only when every repository has a disposition and verified future owner; not when a list is generated or 3–6 repos are marked superseded.

## 08: What comes after launch
### First day
- [ ] **J1** Revisit both public URLs from mobile and desktop; review TLS, forms, logs, analytics and performance.
- [ ] **J2** Watch for broken links, stale CDN content, 404s and build/deploy failures; fix only from canonical repositories.
- [ ] **J3** Verify backup retention and rollback are still operable; update the final session record.

### First week
- [ ] **K1** Replace `mailto:` with authenticated, spam-protected customer intake only if actual lead capture is required; document consent, privacy and retention.
- [ ] **K2** Convert selected projects into fully evidenced case studies, with screenshots, role, source URL, implementation status and verified outcomes only.
- [ ] **K3** Build a reliable project registry refresh job (public-only) and a separate *private* operator audit of all connected repos.
- [ ] **K4** Finish Bot Foundry's manual-review → build → test → deployment workflow with safe tenant approvals, rate limits, logs and kill switch.
- [ ] **K5** Finish Jobs Done/Bushleague preview provisioning (DNS, TLS, scoped deploy user, storage, cleanup policies). No shared production secrets.

### Following month
- [ ] **L1** Execute consolidation batches in dependency order, with issue/PR evidence per family: architecture documents; builder/agent systems; design lanes; market-data stacks; games; remaining experiments.
- [ ] **L2** Reduce duplicate deployment definitions, package copies and branding. Prefer packages/APIs to giant monorepos when products really are distinct.
- [ ] **L3** Establish release and on-call conventions for all externally reachable products: incident contacts, backups, cost budgets, known limitations, uptime checks and basic security updates.
- [ ] **L4** Identify customer-facing opportunities for Jobs Done from *working* Miono capabilities, with integration tests and support responsibilities before promoting them.
- [ ] **L5** Publish a final ecosystem map: products and audience, domain, canonical repository, owner, infrastructure, dependencies, status, and next review date.

## Appendix: known implementation inventory
| Item | Source or evidence | Actual status |
| --- | --- | --- |
| Jobs Done + Miono build | https://github.com/dutchiono/jobsdone-web/pull/2 | Code built; review/merge/deployment pending |
| Public repo root/README scan | GitHub Actions `miono-public-source-audit` artifact | 114 public roots scanned; not full functional QA |
| Public duplicate source scan | GitHub Actions `miono-source-duplication-audit` artifact | 5 code-overlap pairs identified |
| Jobs Done industry templates | `src/site-templates.js`, `templates/index.html` | Working browser concept previews; no publishing or payment |
| Jobs Done automation intake | `automation/index.html` | Client-side JSON draft only |
| Bot Foundry integration | `dutchiono/bot-foundry/src/integrations/jobsdone.ts` | Validated import code; runtime/prod bridge not active |
| Bushleague integration | `dutchiono/bushleague-hosting/products/jobsdone.lane.yaml` | Proposed manifest only |
| Architecture library | `dutchiono/architects-and-agents/consolidated/` | Six reference docs copied and originals redirected |
| `ionoi-sites` | README consolidation notice | Superseded concept; repo not archived/deleted |
| GitHub Pages review host | `dutchiono.github.io/jobsdone-web` | HTTP 404 at last check; requires authorized hosting setup |
| Production Miono server | Gateway | Unavailable / blocked `SERVER_NOT_READY` |
| Canonical Jobs Done deployment | `jobsdoneteam/jobsdone-web` vs `dutchiono/jobsdone-web` | Duplicate baseline; final owner unresolved |
| Existing Miono deployment | UNKNOWN | Must trace DNS/Nginx/webroot before deploying |

## End-of-session handoff (fill even if blocked)
```
HOME SESSION SUMMARY
Date:
GO / NO-GO:
Verified preview URL:
Production Jobs Done URL + deployed SHA:
Production Miono URL + deployed SHA:
Canonical Jobs Done repository:
Canonical Miono repository:
Backup location (no credentials):
Rollback SHA / procedure location:
Checks passed:
Checks failed / blocker:
Repository retirement actions executed:
Next three technical actions:
Responsible person:
```

**Definition of done:** The two live websites and their deployments are verified; duplicated product/site ownership resolved; original projects accounted for with honest status and provenance; useful code/docs migrated with tests; redundant repos archived only after dependency and owner review; and the next maintainer can reproduce both builds and roll them back without reading this conversation.

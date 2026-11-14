# Jobs Done — small-business websites and systems
*A commercial product by Miono Studio.*

This repo is currently the review home for both the Jobs Done website and a **temporary** Miono Studio portfolio preview. The actual source of `miono.live` is still unresolved; `/studio/` must not be mistaken for a deployed Miono website.

## Start locally
```bash
npm ci
npm run dev
```

Then visit:
- `/` — Jobs Done customer-facing site (websites, SEO, CRM, automation, custom systems)
- `/templates/` — **working** industry website concept previews, incorporating the former `ionoi-sites` design
- `/automation/` — JSON automation brief generator compatible with Bot Foundry's reviewed import format
- `/studio/` — Miono Studio portfolio preview with curated projects and all accessible public GitHub repo names

## Build and test
```bash
npm ci
npm run build
node tests/validate.mjs
```

Multi-page Vite output is written to `dist/`. A successful CI build is not a production deployment.

## Actual integration boundaries
- `ionoi-sites`: five industry templates implemented locally. No drag-and-drop editor, payments, booking or automated publishing yet.
- `bot-foundry`: Jobs Done generates `jobsdone.automation-brief.v1`; Bot Foundry includes a local import adapter and CLI requiring a verified operator ID. There is no public remote execution.
- `bushleague-hosting`: includes a `products/jobsdone.lane.yaml` proposed preview lane manifest. DNS, TLS, identity and backend provisioning are not live.
- `data/projects.json`: curated public case studies with status labels.
- `data/repositories.json`: full public source index (114 accessible repos as of 2026-11-14). Private repos excluded.
- Public source audit: `scripts/audit-public.mjs` and the `source-audit.yml` workflow output a reproducible GitHub Actions artifact.

## Source-of-truth and deployment blocker
The `master` deployment workflow historically changes the remote in `/var/www/jobsdone` to `jobsdoneteam/jobsdone-web` while this repo is `dutchiono/jobsdone-web`. Their checked baseline source files were identical, but the duplication and actual deployed owner must be resolved before production rollout.

Miono's Gateway server is marked unavailable/not ready, so the live `miono.live` source cannot be inspected or updated through the current connection.

## Consolidation record
See [docs/CONSOLIDATION-RESULTS.md](docs/CONSOLIDATION-RESULTS.md) and [docs/BUILD-ASSESSMENT.md](docs/BUILD-ASSESSMENT.md). These include actual migrations, forks, duplicate relationships, test status, security concerns and open work.

## Claims policy
README feature claims, customer examples and marketing plans do not establish delivered products or measurable results. Published portfolio entries must distinguish forks, research, prototypes, source-verified implementations and deployed systems. No customer identifiers or private repository content should be exposed without explicit permission.

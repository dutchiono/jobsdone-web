# Miono / Jobs Done: actual consolidation ledger
Updated: 2026-11-14. Working implementation record, not a marketing deck.

## Scope actually inspected
- Connected GitHub search surfaced 135 accessible repositories, 114 public and 21 private.
- Automated GitHub Actions audit of the **114 public repos** completed: 110 READMEs, 67 root-level application manifests, 40 without a conventional source/manifest at root, 39 forks, 0 API errors.
- Audit extracted exact repository URLs, fork flags, root files, manifests, README titles, language/license metadata and notes. Source: [Actions run #43647797915](https://github.com/dutchiono/jobsdone-web/actions/runs/43647797915) (artifact `miono-public-source-audit`). Numbers are evidence about roots and metadata, **not** compiled/running programs.
- Private-source notes remain internal; do not publish private project names, paths or customer data on Miono or Jobs Done without explicit authorization.

## Completed in existing repositories
| Source | Destination | Actual change | Confidence / limitation |
| --- | --- | --- | --- |
| ionoi-sites | jobsdone-web | Added `src/site-templates.js`, interactive `/templates/` page with five industries and editable names, and marked source README superseded | Actual UI built/tested; no site editor, payments, publishing or booking |
| bot-foundry | jobsdone-web ↔ bot-foundry | Built customer brief generator `/automation/` and validated import `src/integrations/jobsdone.ts` and CLI in bot-foundry | Schema interchange built; **no automatic agent execution** |
| bushleague-hosting | bushleague-hosting | Added `products/jobsdone.lane.yaml` manifest for isolated Jobs Done preview environments | Config only; DNS/TLS/credentials/server unprovisioned |
| billing-system-architect | architects-and-agents | Migrated source README to consolidated library; old README points to canonical copy | Documentation consolidation; original git history retained |
| customer-experience-system-architect | architects-and-agents | Same | Same |
| hr-system-architect | architects-and-agents | Same | Same |
| api-gateway-architect | architects-and-agents | Same | Same |
| database-architect | architects-and-agents | Same | Same |
| monitoring-architect | architects-and-agents | Same | Same |
| jobsdone-web | jobsdone-web | Customer website rebuilt, Miono portfolio at `/studio/`, shared stylesheet and verified public portfolio data | PR preview; **not production** |

## Duplicate and overlap findings
1. `dutchiono/jobsdone-web` and `jobsdoneteam/jobsdone-web` had **identical blob SHA** for index.html, README, package.json, package-lock.json, vite.config.js, deploy workflow and src/main.js on their respective default branches at time of review. The server deploy script hardcodes the `jobsdoneteam` remote. This is a verified repository duplication, not two distinct products.
2. `dutchiono/feather-app` and `dutchiono/stablecharts` are likely related dashboard implementations: both have web package named `feather-web`, highly similar dependencies and corresponding large `server/radar-server.mjs` code. They are **not** established as identical; inspect file diffs and shared package boundaries before consolidation. Private content stays internal.
3. `dutchiono/solana-trail` and `dutchiono/hood-trail` use a related survival-game premise but have different root package tooling and should not be merged solely from name or concept.
4. The documented `ionoi-sites` roadmap was not backed by a root package.json or common app entry points in the checked paths. The industry-template concept is now implemented in Jobs Done; archive after dependencies and links are verified.
5. The `architects-and-agents` project already described a documentation consolidation purpose. Six more reference architectures are now canonically located there rather than maintained independently for new edits.
6. 39 repos in the public audit are marked forks. Miono's portfolio must distinguish original contributions from upstream work; a fork is not automatically an independent built product.

## Website and infrastructure ownership
- **Miono Studio / miono.live**: personal practice, public project curation and original work. Source repository of current live miono.live is still not established. Gateway lists the Miono host but reports `SERVER_NOT_READY`; therefore live server config cannot currently be inspected.
- **Jobs Done / jobsdone.team**: customer-facing website and working business tooling. New source in dutchiono/jobsdone-web feature PR. The production checkout points at jobsdoneteam/jobsdone-web. Decide canonical owner and reconcile mirror/deploy before merge.
- **Bushleague**: remains independent infrastructure and isolated designer lanes. Jobs Done preview manifest is not live.
- **Bot Foundry**: remains its own reviewed execution engine; Jobs Done exports a draft import format, never direct unauthenticated execute.

## Consolidation gates — must pass before archiving/deleting
1. All repository root files and consumers assessed, not only README.
2. No depended-on workflows, live routes, libraries, credentials or publication links remain.
3. Unique source, design, license and commit history preserved with attribution.
4. Replacement works and tests pass.
5. README redirects to the canonical home.
6. The owner separately approves archive or deletion; never silently destroy history.

## Security and accuracy concerns
- Existing Jobs Done website contained customer stories, results and testimonials not substantiated by the inspected repos; the replacement removes these instead of repeating unverified proof.
- A prior public documentation PR briefly committed full metadata including private repo identifiers in branch history. Sanitizing the current CSV did **not** erase prior commits. Review that PR's history before merge and consider a repository administrator purge if exposure matters.
- Never imply test passing proves runtime deployment. The new Vite site passed CI; no live deployment was made.
- Customer-facing automation intake downloads a JSON file locally; do not enter passwords or sensitive customer data.
- No actual customer result, deployment or author attribution is inferred from README claims alone.

## Current implementation pointers
- [Jobs Done + Miono source PR](https://github.com/dutchiono/jobsdone-web/pull/2)
- [Full public source audit artifact](https://github.com/dutchiono/jobsdone-web/actions/runs/43647797915)
- [Bot Foundry](https://github.com/dutchiono/bot-foundry)
- [Bushleague Hosting](https://github.com/dutchiono/bushleague-hosting)
- [Architecture consolidation](https://github.com/dutchiono/architects-and-agents)

## Next concrete tasks
1. Resolve canonical Jobs Done repo and production server access; deploy both brands only after rollback and domain checks.
2. Diff feather-app vs stablecharts and extract a common package if tests validate that decision.
3. Inspect remaining source trees and actual original contributions, especially fork changes; assign a target home to every repo.
4. Prepare verified Miono case studies and privacy-safe demos, rather than treating repo names as marketing claims.
5. Archive superseded docs-only repos selectively, after confirming that the consolidated copies cover their useful assets.


## Cross-repository byte-identical source scan (2026-11-14)
GitHub Actions [run #43648561916](https://github.com/dutchiono/jobsdone-web/actions/runs/43648561916) inspected the recursive public source trees of 114 repositories. It found five pairs with at least five byte-identical non-generated source files, excluding common README/assets/lockfiles. One empty repository (`bagsscanner`) returned HTTP 409, which does not represent a failed source read of existing code.

| Pair | Byte-identical source files | Practical disposition |
| --- | ---: | --- |
| dutchiono/milady ↔ milady-ai/milady | 49 | **Upstream/fork relation; review contribution diff, retain provenance** |
| dutchiono/cache-bar ↔ dutchiono/dotcache-james | 20 | **Intentional designer lane**, not arbitrary duplicate. Keep isolation and reusable template source in cache-bar/Bushleague. |
| dutchiono/bot-foundry ↔ dutchiono/dotcache-builder | 6 | **Extract/shared core candidate**. Dotcache-specific Convex/lane frontend remains a specialization; Bot Foundry is a generic pipeline reference. |
| dutchiono/coveragedesk ↔ dutchiono/markbets | 5 | **Shared market-data backend candidate**; isolate financial/token-specific features and validate tests before merging. |
| dutchiono/plugin-anthropic ↔ dutchiono/plugin-google-genai | 5 | **Provider adapter similarity**; inspect upstream licensing and provider-specific semantics before reusing. |

Additional private-owned pair inspected separately: `feather-app` and `stablecharts` have different code blobs for the 170KB+ radar server module but approximately 95% of their unique source lines appear in both. This approximate figure is line-set overlap, not a proven identical codebase. Keep private implementation details out of public pages.

The scan is machine reproducible in `scripts/find-duplicates.mjs` with JSON and Markdown Actions artifacts. The result is a **candidate map for reducing duplicate code** rather than authorization to delete any source repository.

## Hosting verification (2026-11-14)
- GitHub CI successfully built and validated the Jobs Done + Miono + template + automation pages.
- GitHub Pages API returned HTTP 404 for `dutchiono/jobsdone-web` from Actions, and `https://dutchiono.github.io/jobsdone-web/` returned HTTP 404. Pages is not enabled, or is inaccessible to the token. **No hosted preview URL may be advertised yet.**
- Production Miono host is marked unavailable in Gateway and the connector lacks write access to `jobsdoneteam/jobsdone-web` (GitHub branch creation returned 403).

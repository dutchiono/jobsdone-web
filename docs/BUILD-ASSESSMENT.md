# Build assessment — 2026-11-14
Scope: Jobs Done commercial site and Miono Studio portfolio preview. This is an implementation assessment, with limitations recorded rather than treated as done.

## Confirmed source findings

| Repository | Checked | Finding | Technical consequence |
|---|---|---|---|
| dutchiono/jobsdone-web | index.html, src/main.js, package.json, vite.config.js, deploy.yml | Existing marketing site is one 47KB HTML entry point with separate Vite script; default branch master, deploy on push | Replacement is compatible with Vite but should only merge after preview and ownership verification |
| dutchiono/jobsdone-growth | README | Contains growth plan, pricing drafts and distribution channels | Marketing figures and example tweets are **not verified customer results** |
| dutchiono/m-jacob-hvac-marketing-strategy | README | SEO, local-search and marketing research | Present as strategy, not as a built HVAC client site |
| dutchiono/ionoi-sites | README, root package.json attempted | Site-builder idea, roadmap largely unchecked; package.json not present at root | Consolidate product vision and templates, but do not claim a complete working builder |
| dutchiono/bot-foundry | README, package.json, src/index.ts | Actual TypeScript entrypoint; Telegraf, OpenCode SDK, orchestrator, test/build scripts | Candidate separate worker for business agent automation, subject to provenance and tests |
| dutchiono/bushleague-hosting | README and three operation docs | Defines isolated designer lanes, deploy credentials and rollback | Candidate preview deployment pipeline, not yet integrated with Jobs Done |
| dutchiono/TavernKeeper | README | Agent-based roleplaying game API and runtime described | Relevant to independent studio portfolio, not direct business landing page |
| dutchiono/goodicecream | README | Vite/TypeScript browser game with separated state and UI | UI engineering portfolio example |
| dutchiono/Egan-family-tree | README | Searchable interactive graph over transcribed family records | Public description only; avoid exposing family details |
| dutchiono/feather | README | Encrypted wallet storage and watch UI; trade execution listed incomplete | Show as prototype; no false claims of automated trading |
| dutchiono/BNKR-NFT-SCAFFOLD | README | Not deployed according to source | Research/prototype only |
| dutchiono/architects-and-agents | README | Consolidation of technical architecture documentation | Maintain as reference, inspect lineage before merging |
| dutchiono/drink-miono-live | README | Documents feesys.lol, not miono.live | **Do not deploy Miono redesign from this repo** |
| dutchiono/ionoi.eth.sucks | README | Personal GitHub Pages website instructions | Separate identity; not established as miono.live source |

## Shipping now (feature branch, not production)
- Jobs Done: redesign of index.html, services, research examples and mailto contact workflow.
- Miono Studio: separate studio/index.html, architecture and project discovery interface.
- Shared design: public/shared.css.
- Shared machine-readable source: public/data/projects.json, 12 curated public entries with maturity qualifiers.
- Vite multi-entry build includes both pages.
- Pull request CI checks compiled outputs and catalog schema.

## Key limits
- No credentials or production access granted by this build.
- Miono page is currently a **preview under /studio/** inside the Jobs Done repository, **not** the source of miono.live. It must be moved to the canonical Miono source once identified.
- Existing jobsdone-web deployment workflow pulls https://github.com/jobsdoneteam/jobsdone-web.git on server; canonical relationship unresolved.
- Contact form uses mailto to the publicly listed miono@agentmail.to address; no server-submitted or stored contact form is claimed.
- Project cards are evidence-based summaries, not proof of deployment, clients, outcomes, or sole authorship.
- Full GitHub inventory (135 visible repos from the connector) is covered in jobsdone-growth consolidation PR. Full code review of every repo is not yet complete.

## Prioritized concrete engineering follow-up
1. Confirm jobsdone.team canonical repository and server checkout; fix deploy workflow rather than accidentally deploying from the wrong remote.
2. Identify source for miono.live (DNS, server web root, deployment workflow) and move the studio preview into that source.
3. Load and validate all 135 repo records in an **internal** registry, then curate only evidence-safe public examples.
4. Implement a validated contact backend with anti-spam, privacy/retention handling and delivery acknowledgment if email-launch is insufficient.
5. Integrate ionoi-sites templates by actual feature migration with tests; label repo superseded and archive after no consumers remain.
6. Expose Bot Foundry via approved background job contract; attach isolated Bushleague lanes for client previews, never production secrets.
7. Apply responsive, accessibility, SEO and browser checks before live deployment.

## Testing
Static build CI is configured. CI status and browser behavior must be independently checked; do not state the build passed until workflow results are observed.

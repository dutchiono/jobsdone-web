# Miono: reusable estimating, proposals, and billing — integration handoff

Date: 2026-11-24
Status: proposal / integration handoff, **not** a deployed billing backend.

## Dear Miono.live

Please make quoting a first-class Miono business capability, not another one-off website. We need one reusable estimate/proposal engine for Miono's own sales and for client-facing project demos. A coaching PWA prototype is the first vertical, not the core product.

**Current proof of concept:** https://github.com/dutchiono/trainerdemo1 (trainer-only demo UI; Proposal page, coach mode). Its quote calculator is a localStorage-only, editable estimate with copy and print. It is NOT an invoice, payment integration, authenticated system, or production accounting ledger. Do not treat its illustrative $1,800 functional build or 4 design hours as an agreed customer price.

**Recommended implementation home:** jobsdone-web, as an isolated, reusable `/estimate/` module with neutral Miono branding, imported by vertical demo sites. Existing billing architecture documentation lives at https://github.com/dutchiono/architects-and-agents/blob/main/consolidated/billing-system-architect.md. Do not resurrect billing-system-architect as a parallel product.

## Commercial model

1. **Function**: fixed-fee, objectively testable deliverables. Define inclusions, exclusions, acceptance criteria, milestones, defects and change-order boundary. Failure to meet approved acceptance tests is the vendor's responsibility.
2. **Form**: aesthetic/media/content direction and subjective revisions; scoped included design allowance, then $100/hr default adjustable, 15-minute minimum increments per additional change request. Do not bill for defects masquerading as change requests.
3. **Operations**: $5/month **illustrative baseline** hosting offer, monthly or annual payment, domain billed separately at registrar cost, with explicit baseline resource limits. Do not promise that $5 covers unlimited private video, storage, backups, bandwidth, support, or thousands of active users. Show each recurring line and pass-through charge separately.

## Required data model

Organization, Client, Contact, Project, Estimate, EstimateVersion, LineItem, ScopeItem, AcceptanceCriterion, DesignAllowance, RevisionRequest, ChangeOrder, Subscription, DomainRenewal, Invoice, Payment, AuditEvent.

Every line item needs: category (function/form/operations/pass-through), description, quantity, unit, unit_price, recurrence, tax treatment, vendor cost (private), customer price, notes, effective date, and status. Keep quote numbers/version immutable after customer approval. Store monetary values in integer cents, currency code, and server-calculated totals.

## Lifecycle

Lead → requirements → draft estimate → review → share link/PDF → customer accepts/rejects → signed scope → deposit → milestones → invoice → payment reconciliation → recurring renewal. Scope changes create separately accepted change orders. Keep public client views read-only; no internal margin disclosure.

## Implementation order

- Extract quote schema, pure pricing calculator, line-item UI and print/PDF template from the trainer demo into a reusable package or route. Ensure totals and validation are unit-tested.
- Add backend persistence, authenticated staff roles, customer-specific share links, estimate versioning, audit trail, and approvals.
- Add recurring infrastructure/domain cost catalog, annual vs monthly choices, vendor pass-through costs, and storage/video usage allowances.
- Add invoice and payment tracking (manual payments first; payment provider later), deposit schedules and tax handling.
- Expose an embeddable proposal view in the coaching demo, with coach-facing branding and illustrative sample data. Keep the app demo and the commercial proposal clearly distinct.
- Add Miono.live main-site navigation: Services → Estimate / Request a quote; project showcase linking the trainer demo; clear FAQ explaining Function, Form and Operations. Avoid silently deploying or overwriting the existing main site before reviewing its actual repository and deployment pipeline.

## Coaching prospect baseline scope (for estimation, not price promise)

Client portal; trainer dashboard; per-client training/nutrition/habit sheets; onboarding questionnaire; weekly check-ins; static shared tutorial videos; private client-specific video feedback; role-based permissions; notification workflow; secure media storage; mobile PWA; deployment and backup plan. The current GitHub Pages demo has browser-local data and is not the production backend.

## Acceptance checks

- A proposal can be drafted, copied, printed, and revised without changing an accepted version.
- Fixed function, variable form, monthly/annual operations, and pass-through domain charges are separately legible.
- Form overage uses configurable hourly rates and 15-minute increments; never silently increases accepted scope.
- Customer can see what is included, excluded, due now, due recurring, and who owns the domain.
- Domain renewal, video storage, bandwidth, backups, support, and third-party fees are not hidden in a flat $5 line.
- No cross-client access; server validates amounts; all quote/invoice edits are auditable.

## Do not

Do not call a localStorage quote an invoice. Do not implement payment collection in the public GitHub Pages demo. Do not claim hosting has an uptime guarantee without an SLA. Do not quote a fixed project price until requirements and acceptance tests are agreed. Do not create another repository just to hold a copy of this handoff.

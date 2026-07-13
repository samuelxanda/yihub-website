# Build Plan — Youth Innovators Hub

Phases reflect the **existing** product and planned follow-ups. Mark progress in `progress-tracker.md`.

---

## Phase 0 — Foundation (done)

- [x] Vite + React + TypeScript app shell
- [x] Landing page sections (hero, manifesto, programs, community, CTA, footer)
- [x] Activity pages via `/:slug`
- [x] Netlify deploy + SPA redirects
- [x] Brand/SEO (meta, OG, schema.org)

**Done when:** Public marketing site ships at youthinnovatorshub.tech

---

## Phase 1 — Events → Projects showcase (done)

- [x] Airtable schema (Events, Projects, Participants)
- [x] Netlify Functions read API + Airtable util
- [x] `ShowcaseLayout` shared chrome
- [x] Events list + event detail + project detail
- [x] Schools list + school detail
- [x] Admin guide (`docs/admin-airtable.md`)

**Done when:** Visitors can browse live events/projects driven by Airtable

---

## Phase 2 — Registration & submission (done / harden)

- [x] Participant registration form → Airtable
- [x] Registration check before project submit
- [x] Project submission form (team members, URLs, descriptions)
- [x] Formula injection escape (`escapeFormulaValue`)
- [x] School unknown slug → 404
- [x] Form state reset / email validation hardening (partial — see Phase 3)

**Done when:** Registered participants can submit projects safely for open events

---

## Phase 3 — Quality & UX hardening (in progress)

Address remaining items from `docs/bug-ux-report.md` and polish:

- [ ] Confirm sticker rotate + class typo fixes (or delete unused stickers)
- [ ] Audit remaining a11y gaps across ActivityPage nav (parity with App / ShowcaseLayout)
- [ ] Empty / error / loading states consistency on showcase pages
- [ ] Mobile typography pass (no mid-breakpoint regressions)
- [ ] Optional: move Tailwind off CDN to PostCSS for proper purge + config

**Done when:** Bug report items closed or explicitly deferred; showcase UX feel production-solid

---

## Phase 4 — Content & community growth

- [ ] Keep Airtable content current (covers, approved projects)
- [ ] Wire more live events through status + dates
- [ ] Richer activity pages (photos, past highlights) if needed
- [ ] Clarify WhatsApp / social CTAs only — no paywall

**Done when:** Content ops run without code changes for each event

---

## Phase 5 — Stretch (not started — confirm before building)

- [ ] Participant lookup / ticket confirmation page
- [ ] Project approval notification emails
- [ ] Search / filter projects by category
- [ ] Member directory
- [ ] Migrate styling to local Tailwind + design tokens file
- [ ] Light automated tests for formula escape + critical API paths

**Done when:** Explicitly scoped and accepted — do not start without confirmation

---

## Working rules for agents

1. Read all of `/context` before coding
2. Prefer the smallest change that closes a checkbox
3. Update `progress-tracker.md` after each session
4. Do not start Phase 5 items without an explicit ask

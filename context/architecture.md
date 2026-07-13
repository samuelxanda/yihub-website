# Architecture — Youth Innovators Hub

## System shape

```
Browser (React SPA)
    │
    ├── Static content / routes  → Vite-built pages
    │
    └── /.netlify/functions/*    → TypeScript serverless handlers
              │
              └── Airtable REST API (token server-side only)
```

Airtable is the source of truth for events, participants, and projects. The site never stores application data locally.

## Folder structure

```
/
├── index.tsx              # Router entry — mounts all routes
├── App.tsx                # Landing page (/, long single-page)
├── index.html             # Tailwind CDN, fonts, SEO, CSS variables
├── constants.tsx          # COLORS, ACHIEVEMENTS, ACTIVITIES, UPCOMING_EVENTS
├── types.ts               # Landing-page types (Achievement, Activity, Event)
├── components/
│   ├── Section.tsx        # Landing section wrapper
│   ├── Sticker.tsx        # Decorative floating badge
│   └── ShowcaseLayout.tsx # Shared nav/footer shell for showcase pages
├── pages/
│   ├── ActivityPage.tsx
│   ├── EventsPage.tsx
│   ├── EventDetailPage.tsx
│   ├── ParticipantRegistrationPage.tsx
│   ├── ProjectSubmissionPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── SchoolsPage.tsx
│   └── SchoolDetailPage.tsx
├── lib/
│   ├── api.ts             # Frontend fetch client for Netlify Functions
│   ├── showcase-types.ts  # Event / Project / School interfaces
│   └── schools.ts         # School slug helpers
├── netlify/functions/
│   ├── utils/airtable.ts  # Token, fetchRecords, createRecord, escapeFormulaValue
│   ├── events.ts
│   ├── event-projects.ts
│   ├── project.ts
│   ├── schools.ts
│   ├── school-projects.ts
│   ├── check-registration.ts
│   ├── register-participant.ts
│   └── submit-project.ts
├── docs/                  # Human docs (Airtable admin, bug report)
├── context/               # AI agent context (this folder)
└── public/                # Static assets (logo, favicons, images)
```

## Routing (order matters)

Defined in `index.tsx`:

| Path | Page |
| ---- | ---- |
| `/` | `App` (landing) |
| `/events` | `EventsPage` |
| `/events/:eventSlug` | `EventDetailPage` |
| `/events/:eventSlug/register` | `ParticipantRegistrationPage` |
| `/events/:eventSlug/submit` | `ProjectSubmissionPage` |
| `/projects/:projectSlug` | `ProjectDetailPage` |
| `/schools` | `SchoolsPage` |
| `/schools/:schoolSlug` | `SchoolDetailPage` |
| `/:slug` | `ActivityPage` (catch-all — must stay last) |

SPA fallback: `netlify.toml` redirects `/*` → `/index.html` with status 200.

## Data models (Airtable → API shapes)

### EventSummary (`lib/showcase-types.ts`)

`id`, `name`, `slug`, `startDate`, `endDate`, `location`, `status` (`Upcoming` \| `Live` \| `Past`), `submissionOpen`, `description`, `coverImageUrl`

### ProjectSummary / ProjectDetail

Summary: `id`, `title`, `slug`, `category[]`, `shortDescription`, `projectUrl`, `thumbnailUrl`, `school`, `submittedAt`  
Detail adds: `fullDescription`, `githubUrl`, `event: { id, name, slug }`

### SchoolSummary

`name`, `slug`

### Airtable tables

- **Events** — event metadata + `submissionOpen`
- **Projects** — linked to Events; status `Pending` \| `Approved` \| `Hidden`
- **Participants** — registration rows linked to Events

Field names are case-sensitive and must match `netlify/functions/utils/airtable.ts` + `docs/admin-airtable.md`.

## Key flows

### 1. Browse events & projects

`getEvents()` / `getEventWithProjects(slug)` / `getProject(slug)` → Netlify Functions → Airtable list/filter → JSON to React pages.

### 2. Register for an event

Form on `/events/:slug/register` → `POST register-participant` → `createRecord` in Participants (validates event exists).

### 3. Submit a project

1. Verify team lead email via `check-registration`
2. If registered and `submissionOpen`, submit via `POST submit-project`
3. Project stored in Airtable (typically Pending until approved)

### 4. Schools filter

`getSchools()` / `getSchoolProjects(schoolSlug)` — projects grouped by school field. Unknown school slug should 404.

## Invariants (do not break)

1. **Airtable token stays server-side** — only in Netlify Functions env (`AIRTABLE_TOKEN` / `AIRTABLE_API_KEY`). Never expose in the client.
2. **Escape all formula inputs** — use `escapeFormulaValue()` for any user/slug value in `filterByFormula`.
3. **Cache busting** — API reads use `cache: 'no-store'` + timestamp query; responses send no-cache headers so Airtable edits appear immediately.
4. **Catch-all route last** — activity `/:slug` must never sit above showcase routes.
5. **Showcase shell consistency** — showcase pages use `ShowcaseLayout` (or matching nav/footer styles); landing keeps its own `App` shell.
6. **No secrets in git** — env vars only on Netlify / local `.env`.
7. **Hidden events stay offline** — Events with `status = Hidden` are omitted from list APIs and return 404 on detail/register/submit/check-registration.

## Env vars (Netlify)

| Variable | Purpose |
| -------- | ------- |
| `AIRTABLE_TOKEN` or `AIRTABLE_API_KEY` | PAT with data read/write as needed |
| `AIRTABLE_BASE_ID` | `app...` base id (suffix after `/` stripped) |
| `AIRTABLE_TABLE_EVENTS` | optional, default `Events` |
| `AIRTABLE_TABLE_PROJECTS` | optional, default `Projects` |
| `AIRTABLE_TABLE_PARTICIPANTS` | optional, default `Participants` |

# Code Standards — Youth Innovators Hub

## Language & tooling

- TypeScript throughout (`tsx` / `ts`)
- React function components with `React.FC` or inferred props
- Vite for build; no Next.js
- Prefer existing patterns over new abstractions

## File & naming conventions

| Kind | Convention | Example |
| ---- | ---------- | ------- |
| Pages | PascalCase + `Page` suffix | `EventDetailPage.tsx` |
| Components | PascalCase | `ShowcaseLayout.tsx` |
| Lib / API | camelCase | `api.ts`, `showcase-types.ts` |
| Netlify functions | kebab-case filenames | `check-registration.ts` |
| Types | PascalCase interfaces | `EventSummary`, `ProjectDetail` |

## React patterns

- Use `react-router-dom` (`Link`, `useParams`, `useLocation`, `Routes`) — no custom router
- Shared showcase chrome lives in `ShowcaseLayout`; landing chrome stays in `App.tsx`
- Forms: controlled inputs + local `useState`; validate before submit; show errors to the user
- Modals / mobile menus: lock `document.body.style.overflow`, support Escape, focus management where already used (contact modal)
- Reset form-related state when route params change (e.g. `eventSlug`)

## API / Netlify Functions

- Put Airtable access only in `netlify/functions/` via `utils/airtable.ts`
- Always use `escapeFormulaValue()` for values in `filterByFormula`
- Prefer `jsonHeaders()` / `writeHeaders()` for consistent CORS + no-cache
- Frontend talks only through `lib/api.ts` — do not call Airtable from the browser
- Shape responses to match `lib/showcase-types.ts`

## Styling

- Tailwind utility classes (CDN) as the primary styling method — aliases `navy`, `accent`, `paper` via `tailwind.config` in `index.html`
- Brand colors:
  - Background / navy: `#193441`
  - Accent blue: `#438CAF`
  - Paper (photo frames only): `#F3EDE3`
- Fonts: **Bricolage Grotesque** (`font-display`) + **Source Sans 3** (`font-body`)
- Headlines: sentence case; uppercase only for rare tiny labels
- Soft professional shadows / `.photo-frame` — avoid hard offset neo-brutal CTAs as default
- Responsive: mobile-first (`sm:` / `md:` / `lg:`)
- Avoid introducing a CSS-in-JS library or Tailwind config rewrite unless explicitly requested

## Security

- Never commit tokens or `.env` secrets
- Treat all query/body fields as untrusted
- Escape Airtable formula strings; encodeURIComponent for query params

## Accessibility baseline

- Interactive controls need `aria-label` / `aria-expanded` where icon-only
- Dialogs: `role="dialog"`, `aria-modal`, Escape to close, focus trap when pattern exists
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`
- Images: meaningful `alt` text (community / event context)

## What not to do

- Do not add unused dependencies
- Do not invent parallel API clients or duplicate type files
- Do not put business data in `constants.tsx` that belongs in Airtable (constants are for marketing copy/stats)
- Do not "fix" pages with a design system package — match existing YIHUB look

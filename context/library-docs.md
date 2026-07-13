# Library Docs — Youth Innovators Hub

Patterns that matter for *this* repo — not full library manuals.

## React 19 + Vite

- Entry: `index.tsx` mounts `BrowserRouter` → `Routes`
- Dev: `npm run dev` (Vite, default http://localhost:5173)
- Build: `npm run build` → `dist/` (Netlify publish dir)
- Keep components as `.tsx`; shared types in `types.ts` / `lib/showcase-types.ts`

## react-router-dom v7

```tsx
import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';

// Nested params
const { eventSlug } = useParams<{ eventSlug: string }>();

// Hash scroll from other routes (landing)
const location = useLocation();
// location.hash → scroll to section id
```

- Prefer `<Link to="...">` over raw `<a>` for in-app navigation
- Landing section jumps use `#id` + `scrollTo` / history `pushState`
- Catch-all `/:slug` must remain the **last** route

## framer-motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    />
  )}
</AnimatePresence>

<motion.div whileHover={{ y: -10 }} whileInView={{ scale: 1, opacity: 1 }} />
```

Used for: contact modal, mobile menus, hero entrance, program card hover, CTA reveal.

## lucide-react

```tsx
import { Zap, Terminal, ArrowUpRight } from 'lucide-react';

<Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
```

- Icons convey energy (Zap = close/CTA accent; Terminal = menu)
- Pass `size` + responsive Tailwind width/height classes together when matching existing UI

## Tailwind (CDN)

Loaded in `index.html` via `https://cdn.tailwindcss.com` — **no** local `tailwind.config.js` in this project today.

- Arbitrary values are first-class: `bg-[#193441]`, `shadow-[4px_4px_0px_0px_#438CAF]`
- Custom animation class `.animate-float` defined in `index.html` `<style>`
- Extra helper: `public/custom.css` (desktop left-align utility)

When adding utilities, prefer CDN-compatible class strings. Do not assume @apply pipelines unless the build is migrated off CDN.

## Netlify Functions (`@netlify/functions`)

```ts
// Handler shape used in this repo
export default async (req: Request) => {
  // GET query: new URL(req.url).searchParams
  // POST body: await req.json()
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: jsonHeaders(), // from utils/airtable.ts
  });
};
```

- Functions directory: `netlify/functions/` (configured in `netlify.toml`)
- Client base path: `/.netlify/functions/<name>`
- Shared Airtable helpers: `netlify/functions/utils/airtable.ts`
  - `fetchRecords`, `createRecord`, `escapeFormulaValue`, `normaliseProject`, `jsonHeaders`, `writeHeaders`

Local note: full function behavior needs Netlify Dev or deployed env with Airtable credentials.

## Frontend API client (`lib/api.ts`)

```ts
import { getEvents, getEventWithProjects, getProject, getSchools, getSchoolProjects, checkRegistration } from '../lib/api';

const events = await getEvents();
```

- Always goes through `fetchJSON` (cache bust + `cache: 'no-store'`)
- Throws `Error` with server `error` message on non-OK responses
- Registration / submit POST helpers live alongside pages or extend this client consistently

## Airtable

- Not a client library — raw REST via `fetch` in `airtable.ts`
- Auth: `Authorization: Bearer ${AIRTABLE_TOKEN}`
- List pagination handled in `fetchRecords` (`offset` loop)
- Writes use `typecast: true` so multi-select options can auto-create

See `docs/admin-airtable.md` for field schemas and content workflow.

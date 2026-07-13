# Project Overview — Youth Innovators Hub (YIHUB)

## What this is

The open-source website for **Youth Innovators Hub (YIHUB)** — Rwanda's youth-led tech and builders community based in Kigali. Members learn by shipping real projects through hackathons, workshops, CodeLift outreach, showcases, meetups, and tech talks.

Live site: [youthinnovatorshub.tech](https://youthinnovatorshub.tech)

## Who it's for

- **Primary:** Secondary and university students in Rwanda who want to build tech together
- **Secondary:** Parents, schools, partners, and sponsors discovering the community
- **Internal:** Organizers managing events, registrations, and project submissions via Airtable

## Core product surfaces

1. **Marketing landing page (`/`)** — Brand, manifesto, programs, community proof, join CTAs
2. **Activity pages (`/:slug`)** — Static program pages (hackathons, workshops, CodeLift, etc.)
3. **Events showcase (`/events`, `/events/:slug`)** — Live event list and detail from Airtable
4. **Participant registration (`/events/:slug/register`)** — Event sign-up form
5. **Project submission (`/events/:slug/submit`)** — Team project submit (requires registration check)
6. **Project detail (`/projects/:slug`)** — Public project write-up
7. **Schools directory (`/schools`, `/schools/:slug`)** — Projects grouped by school

## Tech stack

| Layer | Choice |
| ----- | ------ |
| UI | React 19 + TypeScript |
| Bundler | Vite 6 |
| Routing | react-router-dom 7 |
| Motion | framer-motion |
| Icons | lucide-react |
| Styling | Tailwind via CDN + inline CSS variables in `index.html` |
| Backend | Netlify Functions (`netlify/functions/`) |
| Data | Airtable (Events, Projects, Participants) |
| Hosting | Netlify (`netlify.toml` → publish `dist`) |
| Images | Cloudinary URLs + `/public` assets |

## Goals

- Represent the community boldly — high-energy, student-builder voice
- Let visitors discover programs and join via WhatsApp
- Power event → registration → project submission → public showcase from Airtable
- Stay open source so members can contribute

## Out of scope (for now)

- Auth / member accounts
- In-app chat or payments
- Admin UI (Airtable is the CMS)
- Blog / CMS for long-form content
- Native mobile apps

# Events → Projects Showcase — Admin Guide

This document explains how to manage the **Events → Projects showcase** feature on [youthinnovatorshub.tech](https://youthinnovatorshub.tech) using Airtable as the backend.

---

## 1. Architecture Overview

```
Airtable (data)  ──►  Netlify Functions (API)  ──►  React frontend (pages)
```

| Layer        | Tech                           | Purpose                                                                     |
| ------------ | ------------------------------ | --------------------------------------------------------------------------- |
| **Data**     | Airtable base                  | Events, Projects, Participants tables                                       |
| **API**      | Netlify Functions (TypeScript) | Read-only endpoints that fetch & shape Airtable data                        |
| **Frontend** | React + React Router           | `/events`, `/events/:slug`, `/projects/:slug`, `/schools`, `/schools/:slug` |

No writes are made from the website — all data is managed in Airtable.

---

## 2. Airtable Base Setup

### Required Tables

Create the following three tables in your Airtable base:

#### **Events** table

| Field            | Type             | Required | Notes                                                          |
| ---------------- | ---------------- | -------- | -------------------------------------------------------------- |
| `name`           | Single line text | ✅       | Event display name (e.g. "Hack4Impact 2025")                   |
| `slug`           | Single line text | ✅       | URL-safe identifier (e.g. "hack4impact-2025"). Must be unique  |
| `startDate`      | Date             | ✅       | When the event starts                                          |
| `endDate`        | Date             |          | When the event ends (leave blank for single-day)               |
| `location`       | Single line text |          | e.g. "ALU Rwanda, Kigali"                                      |
| `status`         | Single select    | ✅       | Options: **Upcoming**, **Live**, **Past**                      |
| `submissionOpen` | Checkbox         |          | Tick when project submissions are open                         |
| `description`    | Long text        |          | Short paragraph shown on the events list and event detail page |
| `coverImageUrl`  | URL              |          | Link to a Cloudinary (or any CDN) image for the event banner   |

#### **Projects** table

| Field              | Type               | Required | Notes                                                   |
| ------------------ | ------------------ | -------- | ------------------------------------------------------- |
| `title`            | Single line text   | ✅       | Project display name                                    |
| `slug`             | Single line text   | ✅       | URL-safe identifier. Must be unique                     |
| `event`            | Link to **Events** | ✅       | Which event this project belongs to                     |
| `category`         | Multiple select    | ✅       | e.g. "Web", "Mobile", "AI/ML", "IoT", "Hardware"        |
| `shortDescription` | Single line text   | ✅       | One sentence shown on project cards                     |
| `fullDescription`  | Long text          |          | Detailed write-up shown on the project detail page      |
| `projectUrl`       | URL                |          | Live demo / deployed app link                           |
| `githubUrl`        | URL                |          | Repository link                                         |
| `thumbnailUrl`     | URL                |          | Cloudinary image URL for the project card & detail page |
| `school`           | Single line text   |          | School name (used for the Schools filter pages)         |
| `status`           | Single select      | ✅       | Options: **Pending**, **Approved**, **Hidden**          |
| `submittedAt`      | Date               |          | Auto-set via form or manually entered                   |
| `staffNotes`       | Long text          |          | Internal notes, never shown on the website              |
| `teamLeadEmail`    | Email              |          | Primary contact for the team                            |
| `teamMemberEmails` | Long text          |          | Comma-separated list                                    |

#### **Participants** table (optional, for future features)

| Field    | Type               | Notes |
| -------- | ------------------ | ----- |
| `name`   | Single line text   |       |
| `email`  | Email              |       |
| `event`  | Link to **Events** |       |
| `school` | Single line text   |       |

### Field naming convention

The Netlify Functions look up fields by **exact name**. Make sure field names match the table above (case-sensitive).

---

## 3. Netlify Environment Variables

Set these in **Netlify → Site settings → Environment variables**:

| Variable             | Value          | Notes                                                                                                    |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `AIRTABLE_TOKEN`     | `pat...`       | A [Personal Access Token](https://airtable.com/create/tokens) with `data.records:read` scope on the base |
| `AIRTABLE_BASE_ID`   | `app...`       | Found in the Airtable URL: `airtable.com/appXXXXXXXX/...`                                                |
| `TABLE_EVENTS`       | `Events`       | (optional — defaults to "Events")                                                                        |
| `TABLE_PROJECTS`     | `Projects`     | (optional — defaults to "Projects")                                                                      |
| `TABLE_PARTICIPANTS` | `Participants` | (optional — defaults to "Participants")                                                                  |

After adding or changing env vars, **trigger a new deploy** (or wait for the next push).

---

## 4. Content Workflow

### Adding a new event

1. Open the **Events** table in Airtable.
2. Add a new row with `name`, `slug`, `startDate`, `status` = **Upcoming**.
3. Optionally add a `coverImageUrl` (upload to Cloudinary, paste the URL).
4. The event will appear on `/events` immediately (Netlify Functions read live from Airtable — no rebuild needed).

### Reviewing project submissions

1. Open the **Projects** table.
2. New submissions will have `status` = **Pending**.
3. Review the project details and either:
   - Change to **Approved** → the project appears on the website.
   - Change to **Hidden** → the project is not shown anywhere.
4. Use the `staffNotes` field for internal comments.

### Using Cloudinary for images

1. Upload the image to [Cloudinary](https://cloudinary.com/) under the `djxxw3ppc` account (or any account).
2. Copy the delivery URL (e.g. `https://res.cloudinary.com/djxxw3ppc/image/upload/v1/...`).
3. Paste it into the `coverImageUrl` (events) or `thumbnailUrl` (projects) field.
4. **Recommended sizes**:
   - Event covers: 1200×630px (landscape)
   - Project thumbnails: 800×450px (landscape)

---

## 5. Frontend Routes

| Route             | Page                    | Data Source                                   |
| ----------------- | ----------------------- | --------------------------------------------- |
| `/events`         | All events grid         | `/.netlify/functions/events`                  |
| `/events/:slug`   | Event detail + projects | `/.netlify/functions/event-projects?slug=`    |
| `/projects/:slug` | Project detail          | `/.netlify/functions/project?slug=`           |
| `/schools`        | Schools list            | `/.netlify/functions/schools`                 |
| `/schools/:slug`  | School's projects       | `/.netlify/functions/school-projects?school=` |

---

## 6. FAQ

**Q: Do I need to rebuild the site when I add an event or project?**
No. Data is fetched live from Airtable via Netlify Functions. Changes appear instantly.

**Q: How is the `slug` used?**
It becomes part of the URL (e.g. `/events/hack4impact-2025`). Keep it lowercase, use hyphens, no spaces.

**Q: What if I need to add a new project category?**
Just add a new option to the `category` multiple-select field in Airtable. The frontend renders whatever categories exist — no code change needed.

**Q: What about SEO for dynamic pages?**
Event and project pages are client-rendered. For better SEO in the future, consider adding prerendering (e.g. `netlify-plugin-prerender`). The static `/events` and `/schools` list pages are already in the sitemap.

**Q: How do I take down a project?**
Change its `status` to **Hidden** in Airtable. It will disappear from all pages immediately.

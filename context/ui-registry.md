# UI Registry — Youth Innovators Hub

Last imprint: 2026-07-13 (landing redesign)

## Baseline

| Property | Correct class / value |
| -------- | --------------------- |
| Page background | `bg-navy` (`#193441`) |
| Accent | `accent` / `#438CAF` |
| Display font | `font-display` (Bricolage Grotesque) |
| Body font | `font-body` (Source Sans 3) |
| Primary button | `bg-accent text-white font-display font-bold rounded-lg` |
| Nav CTA | `bg-white text-navy … rounded-lg hover:bg-accent hover:text-white` |
| Nav bar | `bg-navy/90 backdrop-blur-xl border-b border-white/5` |
| Photo scrapbook | `.photo-frame` + paper padding |
| Text primary | `text-white` / `text-navy` on light |
| Text muted | `text-white/55`–`/70` |

---

### Landing Hero

File: `App.tsx` (`#home`)  
Last updated: 2026-07-13

| Property | Class / note |
| -------- | ------------ |
| Logo | Nav only — not repeated in hero |
| Eyebrow | `text-accent text-sm font-semibold` — Kigali context |
| Photo | Full-bleed + `bg-gradient-to-r from-navy/95 via-navy/60 to-navy/20` |
| Headline | Bricolage Grotesque · `font-bold` · max `lg:text-6xl` |
| Proof line | `text-white/60` — Game Jam stat from `COMMUNITY_STAT` |
| Layout | `justify-center` · `py-28 md:py-32` |

---

### Moments

File: `App.tsx` + `lib/moments.ts`  
Last updated: 2026-07-13

| Property | Pattern |
| -------- | ------- |
| Layout | Alternating photo/text editorial chapters |
| Frame | `.photo-frame` |
| Labels | Small accent label (Recent / Where it started) |

**Pattern notes:** LinkedIn-backed Game Jam + Rwamagana. No Airtable project strip until projects exist.

---

### Programs list

File: `App.tsx` (`#build`)

| Property | Pattern |
| -------- | ------- |
| Structure | Divided editorial rows + `Link` |
| Hover | Accent title + arrow translate |

**Pattern notes:** Replaces Lucide gradient tiles.

---

### ShowcaseLayout

File: `components/ShowcaseLayout.tsx`  
Last updated: 2026-07-13

Matches landing nav/footer language (`font-display` / `font-body`, quiet CTAs).

---

### Section

File: `components/Section.tsx`

Minimal wrapper — padding/background come from caller `className`.

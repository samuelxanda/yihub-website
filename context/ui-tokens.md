# UI Tokens — Youth Innovators Hub

Updated 2026-07-13 — hero polish (Bricolage Grotesque).

## Colors

| Token | Value | Usage |
| ----- | ----- | ----- |
| `--dark-bg` / `navy` | `#193441` | Page background, dark sections, footer, nav |
| `--brand-blue` / `accent` | `#438CAF` | CTAs, links, labels, selection |
| `--paper` | `#F3EDE3` | Rare scrapbook photo frames only |
| Text on dark | `#FFFFFF` / `white/55`–`white/80` | Primary / muted |
| Text on light | `#193441` / navy at ~65–70% | Light sections |

Tailwind CDN aliases: `navy`, `accent`, `paper`.

## Typography

| Role | Spec |
| ---- | ---- |
| Display | **Bricolage Grotesque** — `font-display` · weights 500–700 · sentence case |
| Body | **Source Sans 3** — `font-body` · 400/600/700 |
| Hero eyebrow | `text-accent text-sm font-semibold tracking-wide` |
| Hero H1 | `font-display text-4xl`→`lg:text-6xl font-bold tracking-tight` |
| Hero proof line | `text-white/60 text-base` |
| Section H2 | `font-display text-3xl`→`md:text-5xl font-bold` |
| Nav | `text-sm font-semibold` · sentence case |

Avoid: Inter, DM Sans, Syne, all-caps italic display, hard text drop-shadows.

## Hero overlay

Left-weighted scrim: `bg-gradient-to-r from-navy/95 via-navy/60 to-navy/20` — text left, room visible right.

## Spacing

| Scale | Typical |
| ----- | ------- |
| Section Y | `py-20` / `md:py-28` |
| Hero Y | `py-28` / `md:py-32` · `justify-center` |
| Section X | `px-5` / `md:px-8` |

## Shadows

| Role | Value |
| ---- | ----- |
| Photo scrapbook | `--shadow-signature` via `.photo-frame` |
| Hard offset neo-brutal | **Deprecated** |

## Motion

Hero: single fade/slide up (~0.7s). No `animate-bounce` CTAs.

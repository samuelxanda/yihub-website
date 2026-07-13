# UI Rules — Youth Innovators Hub

Updated 2026-07-13 — hero polish.

## Brand voice & visual identity

- **Photo-forward, human:** Real rooms and gatherings over icon grids
- **Sentence-case headlines** in Bricolage Grotesque; calm Source Sans 3 body
- **Navy + accent blue** stay; never Hack Club red; never purple SaaS gradients
- **Scrapbook frames** (`.photo-frame`) for key photos only
- Soft professional shadows — not hard offset neo-brutal spam

## Layout rules

1. **Hero (first viewport):** Nav logo only (no duplicate in hero). Eyebrow + headline + subtext + one proof line + CTAs + full-bleed photo with left scrim. No badges, stickers, or stat grids.
2. **Moments before pitch:** Game Jam + Rwamagana — not a fake project gallery.
3. **Programs = editorial list**, not equal icon card grids.
4. **One honest number** in hero proof line and community section.
5. Showcase pages use `ShowcaseLayout` matching landing chrome.

## Navigation

- Fixed translucent navy nav; logo appears once
- Sentence-case links, `text-sm font-semibold`
- No Events link (not live yet)
- Join CTA: white → accent hover, `rounded-lg`

## Buttons & CTAs

| Role | Pattern |
| ---- | ------- |
| Primary | `bg-accent text-white font-display font-bold rounded-lg` |
| Inverse | `bg-navy` or `bg-white text-navy` |
| Text link | `font-semibold` + accent hover |

## Do / don't

**Do**

- Bricolage for display headlines only
- Show real event photography (lighter gradient, not crushed to black)
- Keep Rwanda/Kigali specificity

**Don't**

- Duplicate logo in hero
- Inter, DM Sans, Syne, all-caps italic heroes
- Lucide icon grids as the main story
- Events in nav until ready to publish

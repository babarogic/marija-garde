# Marija Garde — homepage

Astro + Tailwind CSS 4 static site. Homepage plus `/zakazivanje` (full-screen booking form).

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Structure

- `src/pages/index.astro` — homepage, assembled from one component per section. Hero is the
  editorial rotating slider (`HeroSliderEditorial`): three headline blocks on cream with the
  meadow image below, word-by-word stagger, Potreba lines as progress tabs, 7s autoplay with
  pause button, reduced-motion safe.
- `src/pages/a.astro` — alternate full-bleed hero variant (`HeroSliderFull`), kept for
  comparison. `Hero.astro`/`Potreba.astro` are the original static versions, currently unused
  but kept since the project has no git history yet.
- `src/pages/zakazivanje.astro` — full-viewport, one-question-per-screen booking form
- `src/components/` — Header, Hero, Potreba, Benefiti, OblastiRada, MapaPodrske, Statistika, Testimonials, EbookBand, ZakljucniCta, Footer
- `src/styles/global.css` — all design tokens (`@theme`), `@font-face`, buttons, reveal motion
- `public/fonts/` — self-hosted woff2, subset to Latin + Latin Extended-A

## Design tokens

Colors follow `resources/design.md` (cream / espresso / coral / peach / dusty / terracotta).
Type is exactly five roles — `text-display`, `text-h2`, `text-h3`, `text-body`, `text-small` —
defined once in `@theme`; no arbitrary font sizes or leading in components. Display and H2 use
`clamp()` so they step down on mobile; H2 never falls below 30px (Lora minimum). Lora is 400
only, Switzer 400/500 only.

## Deliberate deviation from design.md

`design.md` specifies coral-filled primary buttons with cream text. That pair measures **2.5:1**
(espresso on coral is 3.5:1) — both fail WCAG AA for button-size text, and the build brief makes
AA a hard requirement. Primary buttons are therefore **espresso fill / cream text (7.1:1)**, and
coral stays as the non-text accent (link underlines, step numbers, bullet marks, progress bar).
The terracotta closing band keeps cream text at display size only (3:1 passes as large text) with
the reversed cream button per design.md.

## Booking form backend

The form currently submits to a stub. Replace `submitBooking()` in
`src/pages/zakazivanje.astro` with a real endpoint — the collected payload is already a clean
`{ uloga, tema[], jezik, ime, email, termin }` object.

## Motion

Scroll-triggered fade + 16px rise, staggered ~100ms inside each section
(`data-reveal` / `data-reveal-group`, IntersectionObserver in `src/layouts/Base.astro`).
Disabled under `prefers-reduced-motion`; content is never hidden when JavaScript is off.

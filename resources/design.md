# Garde Marija — Design System (Light)
> Warm editorial. Cream canvas, espresso text, one coral accent doing all the work.

**Theme:** light

The Garde Marija system treats warmth as structure, not decoration: a single warm cream surface, espresso brown for every word instead of black, and one coral accent reserved for action and emphasis. Terracotta and dusty blue are not extra accents, they are mood surfaces used sparingly for specific section types. The system earns its calm by using fewer colors with more discipline, not more colors softened down.

> This file directs color only. Font, type scale, spacing, and layout are not dictated here — decide those per section based on content and usability. This is a strict-ish direction we don't have to strictly stick to; deviate when it serves the design.

## Tokens — Colors

| Name | Value | Token | Role |
|---|---|---|---|
| Warm Cream | `#FFF4E2` | `--color-warm-cream` | Default page background. The only background most of the site should use. |
| Espresso | `#53433C` | `--color-espresso` | All text and headlines. The only text color on light surfaces, never black. |
| Warm Coral | `#EC7F6B` | `--color-warm-coral` | The single accent. CTAs, links, active states, icon accents. Nothing else uses this role. |
| Soft Peach | `#F1BB99` | `--color-soft-peach` | Secondary surface for cards, testimonials, quote blocks. Background only, never text. |
| Dusty Blue | `#C6D3E4` | `--color-dusty-blue` | Grounding surface for FAQ, credibility, or expert-tone sections. Used for one section type, not general decoration. |
| Vivid Terracotta | `#EC5F56` | `--color-vivid-terracotta` | Reserved for one high-emphasis moment per page, footer or final CTA banner. Never a button color, never repeated within a page. |

Restraint rule: Coral is the only interactive color. Terracotta is the only "loud" color, and it appears once. Peach and Dusty Blue are backgrounds only, they never carry text or icons on their own.

## Color Usage by Component

### Primary CTA Button
Coral fill (#EC7F6B), Warm Cream text. This is the only filled interactive surface in the system. One primary CTA visible per screen.

### Secondary Button
Transparent background, Espresso border and text. Used for secondary actions like "Learn more" next to a primary CTA.

### Text Link
Espresso text with a Coral underline on hover. No container. Used inline and in nav.

### Card (Benefit / Offer)
Cream or white background. Coral used only for a small icon accent or price, never as the card background.

### Quote / Testimonial Block
Soft Peach background, quote text in Espresso or Coral.

### FAQ Accordion
Dusty Blue background, Espresso text. This is the one section type allowed to use Dusty Blue.

### Section Divider
Espresso at low opacity. Used between sections that share the same background, never decorative.

### Fixed Top Navigation
Cream background, Espresso wordmark. Active link gets a Coral underline, not a filled background.

### High-Emphasis Banner (Footer / Final CTA)
Vivid Terracotta background, Warm Cream text, CTA button in Warm Cream fill with Espresso text (reversed, since Coral would be too close to the terracotta background to read as distinct). This is the one section per page allowed to use Terracotta, and it should be the last thing the user sees before the footer.

## Do's and Don'ts

### Do
- Use #53433C (Espresso) for all text on light surfaces, never pure black.
- Use #EC7F6B (Coral) only for the primary CTA, active nav state, links, and small icon accents, this is the system's only interactive color.
- Use Soft Peach and Dusty Blue as backgrounds only, never as text or icon color.
- Limit Vivid Terracotta to one section per page, ideally the closing CTA or footer.
- Keep one primary CTA button visible per screen, everything else is secondary or a text link.

### Don't
- Never use pure white or pure black, Warm Cream and Espresso are the system.
- Never use more than one filled button color on a single screen.
- Never let Dusty Blue or Peach carry a headline or CTA, they are calm surfaces, not accents.
- Never repeat Vivid Terracotta more than once per page, its rarity is what makes it land.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-cream: #FFF4E2;
  --color-espresso: #53433C;
  --color-warm-coral: #EC7F6B;
  --color-soft-peach: #F1BB99;
  --color-dusty-blue: #C6D3E4;
  --color-vivid-terracotta: #EC5F56;
}
```

### Tailwind v4

```css
@theme {
  --color-warm-cream: #FFF4E2;
  --color-espresso: #53433C;
  --color-warm-coral: #EC7F6B;
  --color-soft-peach: #F1BB99;
  --color-dusty-blue: #C6D3E4;
  --color-vivid-terracotta: #EC5F56;
}
```

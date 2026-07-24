# Sense House — design system

This file records the production direction used by the site. Page-level
overrides, when needed, live in `pages/` and take precedence.

## Product direction

- Product: residential electrical and engineering systems
- Tone: precise, calm, premium, technical
- Primary task: explain the offer within the first viewport and lead to a
  project discussion
- Trust model: process, real documentation and clear deliverables; no invented
  numbers, testimonials, cases, prices or guarantees

## Color

| Role | Value | Usage |
| --- | --- | --- |
| Deep Navy | `#081A3A` | Primary background |
| Deepest Navy | `#050F26` | Header, contrast surfaces |
| Electric Blue | `#21B4FF` | CTA, focus, system states |
| Graphite | `#1B2435` | Secondary surfaces |
| Soft Silver | `#E8EDF3` | Primary text and documentation section |
| Warm Gold | `#F4C45B` | Small premium/status accents only |

Warm Gold must stay below roughly 10% of the visible palette. Electric Blue is
the only primary action color.

## Typography

- Manrope: all Ukrainian text, headings and body copy
- Space Grotesk: Latin wordmark, numbers and short Latin technical labels only
- Minimum body size: `16px`
- Body line height: `1.5–1.7`
- Large headings use tight tracking and balanced wrapping

## Layout

- Mobile-first, max content width `1280px`
- Gutters: `20px` mobile, `32px` tablet and desktop
- Section rhythm: `96px` mobile, `128px` larger screens
- No duplicated mobile/desktop content
- No horizontal carousels for primary content

## Components

- Primary CTA: Electric Blue fill, Deep Navy text, minimum 48px height
- Secondary CTA: transparent with visible silver border
- Cards are used only when an actual contained object exists; lists and ruled
  layouts are preferred for services and process
- Icons and diagrams use one thin-stroke technical language
- All controls have visible hover, active and focus states

## Motion

- Interaction transitions: `150–300ms`
- Reveal motion: subtle opacity and vertical translation, once per element
- No auto-rotating content or continuous decorative motion
- `prefers-reduced-motion` removes nonessential animation

## Accessibility and QA

- Normal text contrast at least 4.5:1
- Touch targets at least 44×44px
- One `h1` per page and sequential heading hierarchy
- Visible labels and inline form errors
- Keyboard support for tabs, dialog and mobile navigation
- Verify at 375, 768, 1024 and 1440px with no horizontal overflow

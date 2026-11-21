---
name: Chaudrel Rénovation
description: Façades, toitures, châssis et rénovations complètes, depuis Schaerbeek dans toute la Belgique.
colors:
  page: "#231E1A"
  raised: "#2C2621"
  inset: "#1D1916"
  deep: "#1A1613"
  text: "#EAE0D3"
  bronze: "#AE8A56"
  bronze-light: "#CDAE7E"
  bronze-hover: "#BE9A64"
  insert-cream: "#EAE0D3"
  insert-ink: "#24221E"
  insert-bronze: "#6E532C"
  green: "#7FB08D"
  error: "#E8917A"
typography:
  display:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(2.75rem, 7.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(2.375rem, 5.2vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(1.875rem, 3.7vw, 3.125rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.016em"
  subtitle:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.6vw, 1.375rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  numeral:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "3.25rem"
    fontWeight: 400
    lineHeight: 1
  menu:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.1
  name:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.1
  name-sm:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.1
  control:
    fontFamily: "Albert Sans Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
  nav:
    fontFamily: "Albert Sans Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1
  label:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.24em"
rounded:
  xs: "10px"
  sm: "14px"
  md: "18px"
  lg: "24px"
  xl: "32px"
  pill: "9999px"
spacing:
  group: "clamp(1.75rem, 2.5vw, 2.5rem)"
  block: "clamp(2.5rem, 4.5vw, 4.5rem)"
  section: "clamp(5rem, 9vw, 9.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.bronze}"
    textColor: "{colors.deep}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.bronze-hover}"
    textColor: "{colors.deep}"
  button-outline-light:
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 28px"
  nav:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
  field:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
---

# Design System: Chaudrel Rénovation

## Overview

**Creative North Star: "La porte entrouverte"**

The whole system comes from the client's logo: a high-contrast CR monogram whose R stands on a bronze door, CHAUDREL in calm wide capitals and RÉNOVATION tracked out between two bronze rules. The site is that logo turned into architecture, at evening: a warm, softened dark (never near-black against bright white, which tired the eyes), attenuated cream text, and the bronze door as the only accent. It always means "come in": the quote, the active page, a rule, a marker. Cream survives only as inserts (the contact dialog).

Glass is the window material of the house. It only appears where something sits behind it (a photo, the page scrolling under the navigation), frosted, with a one-pixel light edge and a top highlight; under the pointer a soft glow and a bronze edge follow the cursor. Motion is one authored moment per page and costs nothing at rest: the door opening on the home page, stacked project cards receding, CSS entrances elsewhere.

**Key Characteristics:**
- Softened warm dark, one metal (bronze), cream only for inserts.
- Prata for every title, Albert Sans for everything else; tracked caps only for small markers.
- Glass over content, never glass over nothing.
- Native scroll, compositor-only animation, zero work when idle.
- Real job photos, never captioned beyond what they show. The home hero photo is an ambience image and is never presented as a Chaudrel job.

## Colors

A softened warm dark with a single brushed-bronze accent. Tailwind names keep their original roles (`bg-cream` page, `text-ink` text); at the root the page is dark, and `.on-dark` / `.on-light` scopes restore the light-text-on-deep and dark-text-on-cream pairs.

### Primary
- **Door Bronze** (#AE8A56): the logo's door. Primary button fill with a deep label (`text-bark`, 5.6:1), rules, door marks, active-page dot, focus ring, selection. 5.2:1 on the page.
- **Light Bronze** (#CDAE7E): bronze text on dark (7.8:1 on the page).
- **Insert Bronze** (#6E532C): bronze text on cream inserts (5.5:1).

### Neutral
- **Page** (#231E1A): page ground (`bg-cream` at the root).
- **Raised** (#2C2621): cards, fields, alternate sections (`bg-shell`).
- **Inset** (#1D1916): image placeholders (`bg-sand`).
- **Deep** (#1A1613): hero, method, footer, navigation tint (`bg-bark`).
- **Text** (#EAE0D3): body and titles, 12.7:1 on the page; secondary at 70% (6.9:1), never below 55%.

### Named Rules
**The One Metal Rule.** Bronze is the only accent. Green means "done and verified", red means error; neither is decorative.

**The Soft Night Rule.** No pure white and no near-black: text is #EAE0D3, the darkest field is #1A1613.

## Typography

**Display Font:** Prata (with Georgia, serif)
**Body Font:** Albert Sans (with system-ui, sans-serif)

**Character:** Prata carries the monogram's high contrast and wedge terminals into every title; Albert Sans echoes the calm wide capitals of CHAUDREL and stays legible at small sizes.

### Hierarchy
- **Display** (400, clamp(2.75rem, 7.4vw, 6rem), 1.0): rare, reserved for a single statement.
- **Headline** (400, clamp(2.375rem, 5.2vw, 4.25rem), 1.04): page H1, home headline, closing call.
- **Title** (400, clamp(1.875rem, 3.7vw, 3.125rem), 1.08): section H2.
- **Subtitle** (Albert Sans 600, clamp(1.1875rem, 1.6vw, 1.375rem), 1.3): H3 under serif titles.
- **Lead / Body** (400, 1.0625–1.25rem / 1.0625rem, 1.6 / 1.7): max 66ch.
- **Numeral** (Prata 400, 3.25rem, ink/cream at 20%): step numbers on the stairs; numbers only where the sequence matters.
- **Menu / Name** (Prata 400, 2rem / 1.75rem / 1.25rem): mobile menu links, project, step, founder and service names.
- **Control** (Albert Sans 500, 15px): button and action labels, sentence case. **Nav** 14px.
- **Label** (500, 0.6875rem, 0.24em, uppercase): breadcrumbs, meta, card markers. Never above a heading.

### Named Rules
**The Two Voices Rule.** Serif titles, sans everything else; hierarchy comes from the contrast between the two, never from bold serif (Prata has one weight).

## Layout

One page container (max 1320px, 20/32/48px gutters). Three vertical intervals only: `section`, `block`, `group`. Sections alternate page / raised / deep, a gentle tonal step rather than a light-dark flash. Text and visuals alternate sides from one block to the next (services photo left, map right, founders photo left, contacts right). Inner pages open on a deep page hero. Mobile: one column, a glass action bar fixed at the bottom (quote + contact), hidden while a page call-to-action is on screen. The navigation is always visible.

## Elevation & Depth

Hybrid: tinted soft shadows on cream, glass on night and photos.

### Shadow Vocabulary
- **Soft** (`0 1px 2px rgb(8 6 4 / .2), 0 12px 30px -16px rgb(8 6 4 / .55)`): buttons, resting cards.
- **Lift** (`0 2px 4px rgb(8 6 4 / .25), 0 30px 60px -28px rgb(8 6 4 / .7)`): hover, open panels, project cards.
- **Glass dark** (`inset 0 1px 0 rgb(255 255 255 / .2), 0 30px 60px -32px rgb(0 0 0 / .6)` + `backdrop-filter: blur(16px) saturate(160%)`): navigation, hero card, call-to-action card, mobile bar.
- **Glass light** (`inset 0 1px 0 rgb(255 255 255 / .9), 0 26px 54px -30px rgb(36 34 30 / .4)`): contact dialog, links card.

### Named Rules
**The Window Rule.** Glass only where something shows through it. Without `backdrop-filter` support it falls back to a near-opaque surface.

## Shapes

Controls are pills; images and panels 24px; glass cards and windows 28–32px; fields 18px. The door trapezoid (from the logo, `M0 38 L67 0 L67 165 L0 142`) is the only ornamental shape: fact markers, the page-hero door, the logo.

## Components

### Buttons
- **Shape:** pill, heights 40 / 48 / 56px.
- **Primary:** Door Bronze fill, Warm Ink label 15px medium, sentence case, optional arrow chip.
- **Hover / Active:** Bronze Hover + Lift shadow; press scales to 0.97.
- **Outline light / dark:** 1px cream or ink border at 25/20%, fill at 8/4% on hover.

### Navigation
Deep-tinted glass pill fixed at the top and always visible: logo (monogram + CHAUDREL) left, links centred, contact icon + primary button right. A glass pill slides between links (`layoutId`), a bronze dot marks the current page. Mobile: full-height glass sheet, Prata links, staggered entrance. Page changes cross-fade with native View Transitions; the navigation is excluded and stays still.

### Glass card
Frosted panel on a photo, 28–32px radius, pointer-following glow and bronze edge. Carries the offer (home hero) and the direct lines in the closing call.

### Door hero (signature)
The cream monogram on deep with its bronze door. One screen of scroll: a deep mask pierced by the door scales up by `transform` around the door, the bronze panel fades to reveal the photo through it, the mask fades out and a glass card brings the offer. Web Animations driven by the native `ViewTimeline` (no JS per frame); passive-scroll fallback. Reduced motion shows the final state directly.

### Project grid
Editorial grid on two unequal columns (7/5, then 5/7, offset by 6rem), large photos with 24px radius, type label and Prata title underneath, round arrow button. The photo is revealed once by a sliding veil and scales to 1.04 on hover; nothing moves on scroll. A last project alone on its row spans the full width.

### Facts plate
The four verified facts engraved on a smoked-glass plate held by a brass frame and four brass screws, monogram on the left, the bronze door glowing behind the glass.

### Stairs (four steps)
Four steps rising like a staircase (15 → 25.5rem tall), bronze nosing on top, Chaudrel icon and a large faint numeral, the last step tinted bronze and carrying the key. Steps rise one after the other on entry; on phones they stack with an increasing indent.

### Project chooser (end of page)
"Quel est votre projet ?" with four answers (Façade, Toiture, Châssis et portes, Rénovation complète) that open `/devis?projet=…` pre-selected, plus direct lines and WhatsApp in plain text. No photo, no glass: it blends into the page.

### Icons
Chaudrel's own set (`src/components/ui/Icons.jsx`, plus `BrandIcons.jsx`): 24px grid, 1.6 stroke, round caps; the logo's door trapezoid is the door of every building. No icon library.

### Before / after
Two photos of the same viewpoint; the after image is clipped from the left at the handle, a cream rule with a bronze door knob. Drag (pointer capture), arrow keys, Home/End; one hint nudge on first view. Shown only for a real pair.

### Fields
Shell background, 1px ink 12% border, 18px radius; focus: bronze border + 3px bronze ring at 18%.

## Do's and Don'ts

### Do:
- **Do** use Door Bronze for the quote action on every page, label in Warm Ink.
- **Do** keep secondary text at ink 70% or cream 60% minimum.
- **Do** enter content with a 28px rise and fade, ease `cubic-bezier(0.22, 1, 0.36, 1)`, 0.9s, transform and opacity only.
- **Do** drive scroll effects with CSS `animation-timeline` or WAAPI on a `ViewTimeline`; nothing may run while the page is idle.
- **Do** honour `prefers-reduced-motion` (Motion `reducedMotion="user"`, CSS fallbacks show final states).

### Don't:
- **Don't** put a label or eyebrow above a heading.
- **Don't** use glass over a flat area with nothing behind it.
- **Don't** add smooth-scroll libraries, infinite animations, or animated `filter: blur` on large areas.
- **Don't** use an icon library; draw new icons in `Icons.jsx` on the same grid and stroke.
- **Don't** add a second accent colour, gradient text, or a colored side border on cards.
- **Don't** caption the ambience hero photo as a Chaudrel job, or show any number, review or delay Chaudrel has not validated.

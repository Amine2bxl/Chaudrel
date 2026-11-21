---
name: Chaudrel Rénovation
description: Façades, toitures, châssis et rénovations complètes, depuis Schaerbeek dans toute la Belgique.
colors:
  cream: "#FCF4EC"
  shell: "#FFFAF4"
  sand: "#F3E8DB"
  ink: "#24221E"
  night: "#191714"
  bronze: "#AE8A56"
  bronze-deep: "#7D6035"
  bronze-hover: "#BE9A64"
  bronze-light: "#C9A876"
  green: "#3D6B4E"
  error: "#9A3B23"
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
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.bronze-hover}"
    textColor: "{colors.ink}"
  button-outline-light:
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "56px"
    padding: "0 28px"
  nav:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  field:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
---

# Design System: Chaudrel Rénovation

## Overview

**Creative North Star: "La porte entrouverte"**

The whole system comes from the client's logo: a high-contrast CR monogram whose R stands on a bronze door, set over a warm cream ground, with CHAUDREL in calm wide capitals and RÉNOVATION tracked out between two bronze rules. The site is that logo turned into architecture. Night fields and cream fields alternate like rooms; the bronze door is the only accent and always means "come in": the quote, the active page, a rule, a marker.

Glass is the window material of the house. It only appears where something sits behind it (a photo, a night field, the page scrolling under the navigation), frosted, with a one-pixel light edge and a top highlight. Under the pointer it catches light: a soft glow and a bronze edge follow the cursor. Motion is one authored moment per page, not a garnish: the door opening on the home page, a rising, unblurring entrance elsewhere, a slow parallax behind glass cards.

**Key Characteristics:**
- Two materials (cream paper, night) and one metal (bronze).
- Prata for every title, Albert Sans for everything else; tracked caps only for small markers.
- Glass over content, never glass over nothing.
- Real job photos, never captioned beyond what they show. The home hero photo is an ambience image and is never presented as a Chaudrel job.

## Colors

A warm two-field palette with a single brushed-bronze accent.

### Primary
- **Door Bronze** (#AE8A56): the logo's door. Primary button fill (ink label, 5.0:1), rules, door marks, active-page dot, focus ring, text selection. Never text on cream (2.9:1).
- **Deep Bronze** (#7D6035): bronze when it must be read on cream: links in legal text, icons, small markers (5.4:1).
- **Light Bronze** (#C9A876): bronze on night: footer headings, active nav dot, kicker-free markers (8.0:1).
- **Bronze Hover** (#BE9A64): primary button hover (ink label 6.1:1).

### Neutral
- **Logo Cream** (#FCF4EC): page ground and light sections.
- **Shell** (#FFFAF4): raised surfaces on cream (fields, cards).
- **Sand** (#F3E8DB): image placeholders, quiet fills.
- **Warm Ink** (#24221E): text and monogram letters (14.6:1 on cream). Secondary text uses ink at 70% minimum.
- **Night** (#191714): dark fields, footer, page heroes, navigation tint (cream on night 16.4:1).

### Named Rules
**The One Metal Rule.** Bronze is the only accent. Green (#3D6B4E) means "done and verified", red (#9A3B23) means error; neither is ever decorative.

**The Readable Bronze Rule.** Door Bronze on cream is for fills and marks; any bronze text on cream uses Deep Bronze.

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
- **Label** (500, 0.6875rem, 0.24em, uppercase): breadcrumbs, footer headings, meta. Never above a heading.

### Named Rules
**The Two Voices Rule.** Serif titles, sans everything else; hierarchy comes from the contrast between the two, never from bold serif (Prata has one weight).

## Layout

One page container (max 1320px, 20/32/48px gutters). Three vertical intervals only: `section` between sections, `block` between a title and its content, `group` inside a block. Sections alternate cream and night; inner pages open on a night page hero so navigation reads the same everywhere. Mobile: one column, a glass action bar fixed at the bottom (quote + contact), hidden while a page call-to-action is on screen.

## Elevation & Depth

Hybrid: tinted soft shadows on cream, glass on night and photos.

### Shadow Vocabulary
- **Soft** (`0 1px 2px rgb(36 34 30 / .05), 0 12px 30px -16px rgb(36 34 30 / .22)`): buttons, resting cards.
- **Lift** (`0 2px 4px rgb(36 34 30 / .06), 0 30px 60px -28px rgb(36 34 30 / .4)`): hover, open panels.
- **Glass dark** (`inset 0 1px 0 rgb(255 255 255 / .2), 0 30px 60px -32px rgb(0 0 0 / .6)` + `backdrop-filter: blur(22px) saturate(160%)`): navigation, hero card, call-to-action card, mobile bar.
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
Night-tinted glass pill fixed at the top, logo (monogram + CHAUDREL) left, links centred, contact icon + primary button right. A glass pill slides between links (`layoutId`), a bronze dot marks the current page. Hides on scroll down, returns on scroll up. Mobile: full-height glass sheet, Prata links, staggered entrance.

### Glass card
Frosted panel on a photo or night field, 28–32px radius, pointer-following glow and bronze edge. Carries the offer (home hero), the founders and the closing call.

### Door hero (signature)
The cream monogram on night with its bronze door; on scroll the monogram scales around the door, the door turns into a window on the photo, then straightens to full-bleed and a glass card brings the offer. Reduced motion shows the final state directly.

### Fields
Shell background, 1px ink 12% border, 18px radius; focus: bronze border + 3px bronze ring at 18%.

## Do's and Don'ts

### Do:
- **Do** use Door Bronze for the quote action on every page, label in Warm Ink.
- **Do** keep secondary text at ink 70% or cream 60% minimum.
- **Do** enter content with a rise from 28px and a 6px blur, ease `cubic-bezier(0.22, 1, 0.36, 1)`, 0.9s.
- **Do** honour `prefers-reduced-motion`: Motion runs with `reducedMotion="user"`, Lenis is off.

### Don't:
- **Don't** put a label or eyebrow above a heading.
- **Don't** use glass over a flat cream area with nothing behind it.
- **Don't** add a second accent colour, gradient text, or a colored side border on cards.
- **Don't** caption the ambience hero photo as a Chaudrel job, or show any number, review or delay Chaudrel has not validated.

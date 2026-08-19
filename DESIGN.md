---
name: CLOSERS
description: Telegram Mini App для прокси-покупки товаров с POIZON — одна плоская тёмная поверхность, один холодный акцент, статус заказа и корзина видны как живые полосы
colors:
  ground: "#0d0e11"
  raise: "#16181d"
  raise-2: "#1e2128"
  line: "rgba(255, 255, 255, 0.09)"
  line-soft: "rgba(255, 255, 255, 0.055)"
  text: "#f4f5f7"
  text-secondary: "#a8adb8"
  text-tertiary: "#7d838f"
  accent: "#5b4fe8"
  accent-press: "#4438c4"
  accent-text: "#a99cff"
  accent-ink: "#ffffff"
  accent-wash: "rgba(91, 79, 232, 0.14)"
  good: "#3ddc91"
  bad: "#ff6a5e"
  plate: "#ffffff"
  plate-ink: "#6d6a64"
typography:
  display:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  none: "0px"
  full: "50%"
spacing:
  pad: "18px"
  tap: "44px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
  field-input:
    backgroundColor: "{colors.raise}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  product-plate:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.none}"
---

# Design System: CLOSERS

## Overview

**Creative North Star: "The Open Rail"**

CLOSERS is one flat surface, not a stack of cards. This is the third complete visual world the project has shipped (after a light Wildberries/Ozon-style grid, then a golden "Night Showroom" theme), and it fully replaces both of those, this file describes only what is in the build today. The page is a single near-black plane; hairline dividers separate sections instead of raised card boxes; and the only things that lift off that plane are two live status strips (the order-progress rail under the header, the cart summary bar pinned to the bottom) plus form fields, which get a faint inset highlight to read as tactile without becoming full cards. The name "Open Rail" is literal: the product's core promise is that price and order status are never hidden behind a card wall, they're a rail that's always visible.

Color follows the same restraint: one cold accent (`#5b4fe8`, indigo-violet) does every job color has to do, buttons, links, focus rings, the live pulse dot, and nothing else on screen carries chroma except the semantic green/coral pair reserved for payment success/failure. Because every catalog photo is shot on a white background, product imagery sits on an explicit pure-white **plate** rather than a dark well, a photo dropped straight onto a dark card reads as a broken white rectangle, a full-bleed white plate reads as a lit display case. Corners are sharp everywhere except the handful of live-state indicators (the pulse dot, step dots), which are full circles, this is a deliberate two-value shape system, not an oversight.

**Key Characteristics:**
- Near-black page (`#0d0e11`) as one continuous plane, sections divided by 1px hairlines, not boxed cards
- Exactly one chromatic accent, cold indigo-violet (`#5b4fe8`), used identically everywhere it appears
- Pure-white product plates inside an otherwise all-dark UI, matched to white-background product photography
- Two "live" strips (order rail, cart bar) are the only elements that persist across scroll and carry state
- Sharp corners by default; full-circle is reserved for live/status indicators only
- Golos Text (self-hosted, Cyrillic+Latin, 400–800) throughout, one family for every role

## Colors

A near-black neutral base, one cold chromatic accent, and one deliberately inverted "plate" surface reserved for product photography.

### Primary
- **Accent** (`#5b4fe8`): the only chromatic color in the system. Solid fill on primary buttons and the cart/order live bars, solid text/icon color (`accent-text`, `#a99cff`) for links, focus rings, active category underline, required-field markers, and the pulse dot on the order rail. Never a gradient, never a glow.
- **Accent Press** (`#4438c4`): `:active` state for accent-filled buttons and bars.
- **Accent Ink** (`#ffffff`): white text/icons on top of solid accent fills.
- **Accent Wash** (`rgba(91, 79, 232, 0.14)`): the tinted background of the order-status rail, and the focus-ring halo on the current order step.

### Neutral
- **Ground** (`#0d0e11`): the entire page background. There is no secondary "surface" plane, most content sits directly on ground.
- **Raise** (`#16181d`) / **Raise 2** (`#1e2128`): the two steps used only where content genuinely needs to read as an input or an inset panel, form fields, the disabled-button fill, the promo input, admin selects, the size-guide header.
- **Line** (`rgba(255,255,255,.09)`) / **Line Soft** (`rgba(255,255,255,.055)`): hairline dividers. Line for structural borders (inputs, buttons, the size guide table); Line Soft for section separators (header bottom edge, list-row dividers).
- **Text / Text Secondary / Text Tertiary** (`#f4f5f7` / `#a8adb8` / `#7d838f`): primary, secondary, and muted text. All three clear 4.5:1 against `ground`.

### Semantic
- **Good** (`#3ddc91`): payment confirmed, promo applied successfully.
- **Bad** (`#ff6a5e`): promo rejected, payment rejected.

### Inverted
- **Plate** (`#ffffff`) and **Plate Ink** (`#6d6a64`): the only light surface in the system. Used exclusively behind product imagery, catalog tiles, the product-modal gallery, cart-line thumbnails, and for the fallback icon drawn when a photo fails to load. Never used for text panels, cards, or chrome.

### Named Rules
**The One Accent Rule.** `#5b4fe8` is the only chromatic color anywhere except the `good`/`bad` semantic pair, which is reserved strictly for payment states. A second decorative hue is drift, not a variant.

**The Flat-By-Default Rule.** Content sits on `ground` with hairline dividers, not on raised card panels. A surface only lifts to `raise` when it is genuinely input-like (a field, a select, an inset panel), and even then the lift is a background-color step plus a faint top highlight, never a drop shadow.

## Typography

**Font:** Golos Text (self-hosted `.woff2`, Cyrillic + Latin subsets, weights 400/600/700/800), fallback `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. One family for every role, no display/body pairing.

**Character:** A grounded Cyrillic-native text grotesk. Hierarchy is carried by weight (400→800), size, and negative letter-spacing at the largest sizes, never by switching typeface. Sizes are drawn from a fixed token scale (`--fs-micro` 11px through `--fs-display` 28px) rather than one-off pixel values, so near-duplicate sizes don't accumulate.

### Hierarchy
- **Display** (800, 28px, −0.03em): `.page-title`, section-level page headers ("Ваши заказы", "Поддержка").
- **Title** (700–800, 18–21px, −0.015em to −0.02em): `.sec-title`, `.headline-name` (product modal), `.sheet-title` (modal headers), `.brand-mark` (wordmark).
- **Body** (400–600, 13–16px): product titles, cart-item detail lines, form inputs, FAQ answers, order step names.
- **Label** (600, 11–12px): form labels, order-status text, admin stat captions. Not uppercase, weight and size alone carry the "label" register.

### Named Rules
**The One Family Rule.** Golos Text is the only typeface, including the wordmark. Hierarchy is a weight/size problem, never a font-swap problem.

**The Fixed-Scale Rule.** Every font-size traces to a `--fs-*` token. A new component reaches for the nearest existing step before introducing a new pixel value.

## Elevation

The system is flat by default: most content sits directly on `ground` with a 1px `line` or `line-soft` border doing the separation work, not a shadow. The one elevation cue that exists, `--shadow-raise` (`inset 0 1px 0 rgba(255,255,255,.05)`), is a faint top highlight applied only to genuinely input-like surfaces sitting on `raise`, form fields, selects, the promo input, the size-guide header. It reads as "this is a control you type into or pick from," not as a lifted card. No component in the system uses an outer drop shadow.

### Named Rules
**The Inset-Not-Drop Rule.** When a surface needs to feel tactile, it gets `--shadow-raise`'s inset top highlight, never an outer `box-shadow` with blur and spread. Outer shadows on a near-black page read as muddy, not lifted.

## Components

### Buttons
- **Primary (`.btn`):** solid `accent` fill, `accent-ink` (white) text, weight 700, sharp corners, full width, `:active` darkens to `accent-press` and scales to 0.99. Disabled state fills `raise-2` with `text-tertiary` text.
- **Secondary (`.btn-line`):** transparent fill, primary text, 1px `line` border, `:active` fills `raise`.

### Category Tabs
- **Style:** plain text, no pill background, `text-tertiary` at rest, weight 600.
- **Active state:** text turns `text` (full white), a 2px `accent` underline scales in from the left (`transform: scaleX`).

### Live Rails (signature)
The two elements allowed to persist across scroll and carry ambient, indefinite-loop state. The **order rail** (`.rail`) sits under the sticky header when an order is active: `accent-wash` background, a 7px dot that pulses opacity 1↔0.35 on a 2.2s loop, and the current step's label. The **cart bar** (`.bar`) is fixed to the bottom edge, solid `accent` fill, `accent-ink` text, item count and running total. Both are the sole elements the "Flat-By-Default" rule exempts, they are meant to read as persistent, not as page content.

### Product Plate (signature)
A dark `ground`-level cell holding a pure-white `plate` square (`object-fit: contain`, 8% padding) for the photo. Two controls anchor to the plate's corners: a wishlist heart (top-right, turns `bad` red when saved) and an in-cart count badge (bottom-left, solid `accent`) when the item is already in the cart. Below the plate: price in `text` at weight 700, then a two-line-clamped `text-secondary` title, price outweighs the title.

### Add-to-Cart Confirmation (signature)
Adding a catalog item clones its plate photo and animates it (`transform`/`opacity` only, 520ms, the system's one easing curve `cubic-bezier(.2,.8,.3,1)`) from the product modal to the cart bar's bag icon, then the bar's count badge does a single 0.38s scale-bump (`bump` keyframe, not looped). A free-request add (no reliable product photo) skips the flight and plays only the bump. This is the one-shot counterpart to the Live Rails: it confirms a single action and then stops, it never loops.

### Loading Skeletons
Async content (the orders list, while the free-tier backend cold-starts) shows shape-matched skeleton blocks (`.skel-order`, mirroring `.order`/`.track`) pulsing on the same `pulse` keyframe as the order-rail dot, instead of spinner or placeholder text. The pulse is bounded: it exists only until real data arrives, then the skeleton is replaced outright. This is a loading signal, not ambient decoration, it plays by the same "confirms live state" logic as the rails, just scoped to "data is in flight" instead of "an order is active."

### Cards / Containers
There is no generic card component. Sections (orders, admin entries, FAQ items) are separated by `line-soft` top borders within a single continuous column, not wrapped in individually-bordered boxes.

### Inputs / Fields
- **Style:** `raise` fill, 1px `line` border, `--shadow-raise` inset highlight, sharp corners, 16px font (deliberately not smaller, to avoid iOS auto-zoom on focus).
- **Focus:** border turns `accent-text`.
- **Placeholder:** `text-tertiary`.

### Modals (Sheets)
Bottom sheets (`align-items: flex-end`), full width up to 640px, max-height 90vh, rising in from the bottom edge over 0.26s. A sticky header with title and close button; body content scrolls beneath it.

## Do's and Don'ts

### Do:
- **Do** keep the page one continuous `ground`-colored plane. New sections get a `line-soft` top divider, not a card wrapper.
- **Do** keep exactly one chromatic accent (`#5b4fe8`); the `good`/`bad` pair is reserved strictly for payment states.
- **Do** put product imagery on the pure-white `plate`, the photography is white-background, and a dark well turns every photo into a broken white rectangle.
- **Do** reach for an existing `--fs-*` token before introducing a new font-size value.
- **Do** keep the order rail and cart bar as the only elements with *indefinite* looping motion; a bounded loop tied to a real wait state (a loading skeleton) is allowed, it must stop the moment the wait ends.
- **Do** confirm one-shot actions (add to cart) with a single, non-looping animation (`flyToCart`'s clone-and-travel, the badge `bump`), not with a permanent visual change.

### Don't:
- **Don't** add drop shadows to cards or panels. Depth comes from `--shadow-raise`'s inset highlight or from a `line`/`line-soft` border, never from an outer blurred shadow.
- **Don't** add a second chromatic accent beside the indigo; a second hue is drift, not a variant.
- **Don't** use `--plate` white for anything but product imagery and its fallback, it is not a general-purpose surface.
- **Don't** round a corner beyond the two-value system (sharp by default, `50%` only for live/status dots). A rounded card or a pill-shaped button reintroduces a shape family the system doesn't have.
- **Don't** add an *indefinite* loop anywhere outside the order rail's pulse. A skeleton's pulse is fine because it's bounded by the fetch it represents; a decorative loop with no real state behind it is not.
- **Don't** add looping animation to anything that isn't the order-rail pulse; a second looping element competes with the one live signal the UI is built to highlight.
- **Don't** load a second typeface; Golos Text is the only family, including the wordmark.
- **Don't** invent fake social proof (reviews, ratings, "happy customers"), per PRODUCT.md: no real testimonials exist yet, and none may be fabricated.

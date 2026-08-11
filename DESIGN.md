---
name: CLOSERS
description: Telegram Mini App для прокси-покупки товаров с POIZON — плотный маркетплейс-каталог на белых карточках поверх мягкого серого фона, с одним бирюзовым акцентом POIZON
colors:
  bg: "#f1f1f4"
  surface: "#ffffff"
  surface-2: "#f5f5f8"
  border: "#e7e7ec"
  text: "#16161c"
  text-secondary: "#6b6b78"
  text-tertiary: "#6f6f79"
  accent: "#00a389"
  accent-dark: "#00806a"
  accent-dim: "rgba(0, 163, 137, 0.1)"
  accent-ink: "#ffffff"
  signal: "#ff3b30"
typography:
  display:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "13.5px"
    fontWeight: 700
  body:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.4px"
rounded:
  sm: "8px"
  md: "10px"
  lg: "16px"
  full: "999px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "20px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "15px"
  button-primary-active:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "15px"
  category-tab-active:
    backgroundColor: "{colors.text}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  quick-add-button:
    backgroundColor: "{colors.text}"
    textColor: "#ffffff"
    rounded: "50%"
    size: "30px"
  cart-item-type-tag:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "50%"
    size: "18px"
---

# Design System: CLOSERS

## Overview

**Creative North Star: "The Marketplace Shelf"**

CLOSERS reads as a real, dense marketplace, not a quiet one-page product-request form. This is the second complete visual world the project has shipped: the first (documented in an earlier version of this file) was a dark, single-accent minimalist shell — black chrome, one teal highlight, system font only. That world was replaced wholesale by this one, and the two should not be reconciled; this file describes only what is in the build today. The current world takes its trust cue from Wildberries/Ozon-style Russian marketplace catalogs, the grammar this audience already hands money to daily, rather than from a boutique single-product app: white product cards sit on a soft gray page, packed two-up in a dense grid, with bold black price outweighing the title and a circular quick-add control glued to every photo.

Depth here is not the previous world's flat dark tonal system — cards are white surfaces lifted off a gray page with a consistent soft ambient shadow. Color discipline is stricter than density: exactly one saturated hue (teal, `#00a389`) is allowed on screen, reserved for price emphasis, primary actions, and in-progress/complete status. A second, unsaturated "chrome" color — the same near-black used for body text — doubles as the fill for pill- and circle-shaped UI chrome (active category tab, promo strip, quick-add button, admin chat button, floating request button), so screens read as having two structural colors (teal + near-black) even though only one is saturated. Self-hosted Golos Text (Cyrillic + Latin subsets, weights 400–800) is the only typeface, including the wordmark — there is no display face distinct from body text.

**Key Characteristics:**
- Dense 2-column catalog grid (`repeat(2, 1fr)`, 10px gap) — marketplace density is the trust signal, not a decorative choice
- Exactly one saturated accent (teal `#00a389`); near-black (`#16161c`) is reused as a second, unsaturated "chrome" fill for pills and circular controls
- Golos Text (self-hosted, Cyrillic+Latin, weights 400–800) throughout, including the wordmark — no separate display face
- White cards lifted off a soft gray page with one shared ambient shadow (`--shadow-card`), not the previous world's flat dark tonal layering
- Item type (catalog vs. free request) is shown only as a small icon-tag on the thumbnail corner plus a quiet first-line label — never as a bold uppercase kicker/badge above a title

## Colors

Marketplace-neutral base (soft gray page, white cards) with exactly one saturated accent and a second unsaturated near-black used structurally, not just for text.

### Primary
- **POIZON Teal / Accent** (`#00a389`): the single saturated color in the system — primary button fill, in-cart card outline, product price emphasis is carried by weight not color but status/active states (wishlist toggle active, active category icon... see below), FAQ open-state icon/chevron, promo success text, status-dot completed/active, cart-item-type-tag icon fill, accent letter "O" in the wordmark.
- **Accent Dark** (`#00806a`): pressed/active state of accent-filled elements (`.btn:active`, `.admin-chat-btn:active`, `.floating-request-btn:active`), and text-on-tint contexts (VPN notice text, size-guide link, discount text, payment-confirmed text).
- **Accent Dim** (`rgba(0, 163, 137, 0.1)`): tinted background for icon tiles (referral icon, FAQ icon, admin avatar), the VPN notice strip, and the completed/active status-dot halo.
- **Accent Ink** (`#ffffff`): the text/icon color placed on top of accent fills.

### Secondary
- **Near-Black Chrome** (`#16161c`, same value as `colors.text`): a second, unsaturated structural color reused deliberately as UI-chrome fill rather than as text — active category pill, the free-request promo strip, the circular quick-add "+" on every product photo, the admin "Написать админу" pill, and the floating "Свой запрос" button. This is a real second color role in the built system, not a text-color leak.

### Tertiary
- **Signal Red** (`#ff3b30`): reserved for error/negative states only — promo-code error text, rejected-payment note, active (already-wishlisted) heart icon.

### Neutral
- **Page** (`#f1f1f4`): base app background.
- **Surface** (`#ffffff`): all elevated cards — product cards, cart items, order cards, admin/referral/FAQ cards, modal sheets, bottom nav.
- **Surface 2** (`#f5f5f8`): recessed/inset panels one step below surface — product-image and cart-thumb backdrops, promo-code box, modal product-preview strip, size-table header row.
- **Border** (`#e7e7ec`): hairlines on inputs, category-tab and search-field outlines, size-table dividers, bottom-nav top edge.
- **Text** (`#16161c` / `#6b6b78` / `#6f6f79`): primary / secondary / tertiary text. `text-tertiary` is tuned to `#6f6f79` specifically to clear 4.5:1 contrast against white/surface backgrounds (WCAG AA) — do not darken the surface or lighten this value without re-checking that ratio.

### Named Rules
**The One Saturated Color Rule.** Exactly one saturated hue is allowed on any screen — teal. Near-black chrome, white, and the grays are not "accents" even though near-black fills the same pill/circle shapes an accent normally would; if a second saturated color appears (green, blue, purple, orange), it is a drift from the system, not a variant of it.

## Typography

**Display/Body/Label Font:** Golos Text (self-hosted `.woff2`, Cyrillic + Latin subsets, weights 400/600/700/800), with fallback `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. One family for every role, including the wordmark — there is no separate display face.

**Character:** A grounded, slightly condensed-feeling text grotesk; hierarchy is carried entirely by weight (400→800), size, and negative letter-spacing on the largest sizes, never by switching typeface.

### Hierarchy
- **Display** (800, 19–22px, −0.01em to −0.02em): the "CL**O**SERS" wordmark, the "Поддержка" section header.
- **Title** (700–800, 13.5–16px): section-title labels, modal titles, product/modal price, cart-item title, order ID, admin name, referral title, FAQ question text.
- **Body** (400–500, 11.5–14px): catalog product-card title, cart-item detail lines, FAQ answers, form inputs/textareas, support intro text.
- **Label** (600–800, 9.5–12.5px, often uppercase): form field labels (uppercase, 0.4px tracking), order-status badge (uppercase), size-table headers (uppercase, 0.3px tracking), bottom-nav labels, category-tab labels, pill-button labels (not uppercase).

### Named Rules
**The One Family Rule.** Golos Text is the only typeface anywhere in the product, including the logotype. Hierarchy is a weight/size problem, never a font-swap problem.

## Layout

Single-column app shell, `max-width: 600px`, centered. A sticky header (wordmark + wishlist toggle, then a full-width search field) sits above category pills, a black promo strip for the free-request path, and then the catalog grid — matching the FIRST VIEWPORT contract. The catalog itself is a dense **2-column** grid (`grid-template-columns: repeat(2, 1fr)`, 10px gap) — not 1 and not 3 columns; this density is load-bearing for the marketplace thesis, not an incidental choice. Horizontal content margin is a consistent 14px almost everywhere (header, category-tabs, catalog-grid, cart-container, orders-list, support-section). Card internal padding runs 8–16px depending on density (product-card 8/8/12px, cart-item/admin-card 12–16px, order-card/modal 16–20px). A fixed bottom nav (z-index 100) and a floating "Свой запрос" pill (z-index 99) sit above scroll content; body reserves 96px of bottom padding so content never sits under them. Modals are bottom sheets (`align-items: flex-end`), capped at the same 600px width, max-height 85vh, with `env(safe-area-inset-bottom)` padding for notch devices.

## Elevation & Depth

Hybrid, not flat: page background and card surface are tonally distinct (`bg` `#f1f1f4` vs. `surface` `#ffffff`), and nearly every card-like surface additionally carries one shared, very soft two-layer ambient shadow — `--shadow-card: 0 1px 2px rgba(16,16,30,.04), 0 1px 1px rgba(16,16,30,.03)` — applied to product cards, the search field, admin/FAQ/referral cards, cart items, the cart summary, and order cards. A small number of circular chrome elements carry a visibly stronger shadow to read as floating controls rather than flat cards: the quick-add "+" circle (`0 2px 6px rgba(16,16,30,.25)`), the floating request pill (`0 8px 20px rgba(16,16,30,.25)`), and the wishlist heart circle (`0 1px 4px rgba(16,16,30,.16)`). The active status-dot gets an accent-colored halo instead of a gray shadow (`0 0 0 3px var(--accent-dim)`).

### Named Rules
**The Soft Lift Rule.** Every card-like surface gets the same shared ambient `--shadow-card` — never a heavier or custom shadow per component. Only free-floating circular controls (quick-add, floating request button, wishlist heart) are allowed a stronger, distinct shadow, and even those stay neutral-gray, not accent-colored.

## Shapes

Standard rounded rectangles at three steps — `--radius-sm` (8px) for inputs and inset panels, `--radius-md` (10px) for most cards, `--radius-lg` (16px) for the top-level order card, the promo strip, and modal-sheet top corners — plus full pill rounding (`--radius-full`, 999px) for category tabs, status/count badges, and pill buttons. A separate set of elements is fully circular (`50%`): the wishlist heart, the quick-add "+", the cart-item type tag, the mini cart-count badge, status-timeline dots, the admin avatar, and the modal close button. No sharp/unrounded corners anywhere, and no decorative borders on cards — borders appear only on inputs, the search field, category-tab pills, and as plain 1px dividers (size-table rows, order-meta separator, bottom-nav top edge).

## Components

### Buttons
- **Shape:** `--radius-md` (10px) for the full-width primary action; `--radius-full` for pill buttons (admin chat, quick-request CTA, promo apply).
- **Primary (`.btn`):** accent fill, `accent-ink` (white) text, 15px padding, weight 800, full container width; pressed state darkens to `accent-dark`; disabled drops to 0.5 opacity.
- **Secondary (`.btn-secondary`):** transparent fill, primary text color, 1.5px border — used for the referral "Копировать" action.
- **Near-black chrome pills/circles:** quick-add circle, floating request pill, admin chat pill — fill with `colors.text` (near-black), white icon/text, and switch to accent fill only on press (`:active`). This is a distinct button family from the accent primary button; it is chrome-colored at rest, accent-colored only as a press feedback.

### Chips
- **Category tabs:** `--radius-full` pills, `surface` background with 1.5px `border` at rest, 12.5px/600 weight text in `text-secondary`, horizontally scrollable with hidden scrollbar.
- **Active state:** fills with `colors.text` (near-black), not accent — border and text both switch to match. This is the Secondary near-black chrome role, not the Primary accent.

### Cards / Containers
- **Corner Style:** `--radius-md` (10px) default (product card, cart item, admin/FAQ/referral card); `--radius-lg` (16px) for order cards and the promo strip.
- **Background:** `surface` (white) on `bg` (soft gray) page; no border, ambient `--shadow-card` only (see Elevation).
- **Internal Padding:** 8–12px for the dense product card, 12–16px for list-style cards (cart item, admin card), 16px for order cards.

### Inputs / Fields
- **Style:** `surface` background, 1.5px `border`, `--radius-sm` (8px); the header search field additionally sits on `--shadow-card` even though it's not a "card."
- **Focus:** border color shifts to `accent`; no glow/ring.
- **Placeholder:** `text-tertiary`.
- **Photo upload:** dashed 1.5px border variant of the same field style; border turns solid `accent` on press.

### Navigation
- **Bottom nav:** fixed, `surface` background, 1px `border` top edge, five stacked icon+label items; inactive items are `text-tertiary`, the active item turns `accent` — a plain color change, no fill or pill behind it.
- **Top search/category row:** sticky header holds the wordmark, wishlist toggle, and search field; category pills scroll horizontally beneath it (see Chips).

### Product Card (signature)
The catalog's dense grid tile: a white `surface` card containing a `surface-2` image well (`object-fit: contain`, padded so the item is never cropped, with a `text-tertiary`-on-`surface-2` category-icon fallback if the photo fails to load). Two circular controls are pinned to the photo's corners — the wishlist heart (translucent white circle, top-left, turns `signal` red when active) and the quick-add "+" (solid near-black circle, bottom-right, turns accent on press). A small accent-filled `cart-badge-mini` circle appears top-right of the photo once the item is already in the cart. Below the photo: a two-line-clamped, `text-secondary`, 500-weight product title, then a bold 800-weight price in the primary text color — price deliberately outweighs the title, per the marketplace thesis.

### Cart Item Type Indicator (signature)
Item type (catalog product vs. free POIZON request) is never a bold uppercase kicker/badge sitting above the title — that treatment was removed. Instead it is carried by two quiet signals together: (a) `.cart-item-type-tag`, an 18px accent-filled circle with a 2px `surface`-colored ring, pinned to the bottom-right corner of the item's thumbnail, holding a small icon only (box icon for catalog items, search icon for free requests); and (b) `.cart-item-type-label`, a small (10.5px, 600-weight) `accent-dark` line that is simply the first line of the item's detail block ("Товар из каталога" / "Свободный запрос"), typographically no louder than the size/color/notes lines beneath it.

## Do's and Don'ts

### Do:
- **Do** keep the catalog at a dense 2-column grid (`repeat(2, 1fr)`, 10px gap) — this density is the trust signal the THESIS depends on, not a layout default to "improve" toward more whitespace.
- **Do** keep exactly one saturated accent color (`#00a389`) — reserve it for price emphasis, primary actions, and in-progress/complete status only.
- **Do** use near-black (`#16161c`) as the second, unsaturated chrome fill for pills and circular controls (active category tab, quick-add, floating request button) — it is a real structural color in this system, not stray text-color reuse.
- **Do** apply the shared `--shadow-card` ambient shadow to elevated white surfaces rather than inventing a new shadow value per component.
- **Do** show item type (catalog vs. free request) only via the small icon-tag + quiet first-line label — never as a bold/uppercase badge above a title.

### Don't:
- **Don't** add a second saturated accent color next to teal (no green, blue, purple, or orange).
- **Don't** collapse the catalog to a single column or thin out the grid — that reads as a calm boutique app, which is the opposite of the marketplace-density thesis this build commits to.
- **Don't** reintroduce a bold uppercase kicker/eyebrow above product or cart-item titles.
- **Don't** load a second typeface; Golos Text (with its system-font fallback stack) is the only family, including the wordmark.
- **Don't** lighten `text-tertiary` past `#6f6f79` on white/`surface` backgrounds — that value was set specifically to clear WCAG AA 4.5:1 contrast.

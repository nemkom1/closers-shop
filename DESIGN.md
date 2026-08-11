---
name: CLOSERS
description: Telegram Mini App для прокси-покупки товаров с POIZON — тёмный ночной шоурум под тёплым золотым светом, где светятся только товары, цены и прогресс заказа
colors:
  bg: "#08080b"
  surface: "#131318"
  surface-2: "#1a1a22"
  surface-3: "#202029"
  border: "rgba(255, 255, 255, 0.07)"
  border-strong: "rgba(232, 178, 95, 0.3)"
  text: "#f5f5f7"
  text-secondary: "#b4b4bf"
  text-tertiary: "#8f8f9c"
  accent: "#e8b25f"
  accent-soft: "#f4cd8c"
  accent-dark: "#c99548"
  accent-dim: "rgba(232, 178, 95, 0.12)"
  accent-ink: "#14120b"
  signal: "#ff6b5f"
  signal-dim: "rgba(255, 107, 95, 0.12)"
  plate: "#ffffff"
  plate-ink: "#6e6961"
typography:
  display:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Golos Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    letterSpacing: "-0.01em"
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
  sm: "10px"
  md: "14px"
  lg: "20px"
  full: "999px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "20px"
components:
  button-primary:
    background: "linear-gradient(135deg, {colors.accent-soft}, {colors.accent})"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "15px"
  button-secondary:
    background: "transparent"
    textColor: "{colors.text}"
    border: "1.5px solid {colors.border-strong}"
    rounded: "{rounded.md}"
    padding: "15px"
  category-tab-active:
    background: "linear-gradient(135deg, {colors.accent-soft}, {colors.accent})"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  quick-add-button:
    background: "linear-gradient(135deg, {colors.accent-soft}, {colors.accent})"
    textColor: "{colors.accent-ink}"
    rounded: "50%"
    size: "30px"
  product-plate:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.sm}"
---

# Design System: CLOSERS

## Overview

**Creative North Star: "The Night Showroom"**

CLOSERS is a night-lit private showroom, not a supermarket aisle. This is the third complete visual world the project has shipped, and it fully replaces the second (a light Wildberries/Ozon-style marketplace grid on white cards and a gray page) — the two must not be reconciled, and this file describes only what is in the build today. The change was driven by product truth: CLOSERS brokers €200–1200 goods through one named human manager, so the surface has to feel exclusive and hand-run rather than mass-market. A near-black page carries a warm gold halo bleeding from the top edge; every card is a lifted dark panel; and a single warm gold is the only chromatic color allowed on screen.

Gold here is never flat. It appears as a gradient fill (buttons, pills, quick-add circles), as a glow (focus rings, active nav, wordmark), or as a hairline gradient rule (header underline, card caplines, dividers) — but the one place it is deliberately *solid* is text, because gradient-filled text is a legibility and craft failure at these sizes.

Because every product photo in the catalog is shot on a white background, product imagery sits on an explicit pure-white **plate** rather than a dark well. This is load-bearing, not a compromise: a white-background photo dropped onto a dark surface reads as a broken white rectangle punched through the card, whereas a full-bleed white plate reads as a lit display case. Goods, prices and order progress are the only bright things on screen.

**Key Characteristics:**
- Near-black page (`#08080b`) with a fixed warm radial halo from the top edge — the room's light source
- Exactly one chromatic color: warm gold (`#e8b25f`), always gradient/glow when it is a surface and always solid when it is text
- Pure-white product plates inside dark cards — the lit display case, matched to white-background product photography
- Hairline structure: 1px `rgba(255,255,255,.07)` borders and gold gradient rules, never heavy dividers
- Motion is confirmation, not decoration — ripple on touch, cascade-in on lists, pulse on the live order step
- Golos Text (self-hosted, Cyrillic+Latin, 400–800) throughout, including the wordmark

## Colors

Dark neutral base with exactly one chromatic hue, plus one deliberately inverted "plate" surface for product imagery.

### Primary
- **Warm Gold / Accent** (`#e8b25f`): the only chromatic color in the system. Gradient fills (`linear-gradient(135deg, accent-soft, accent)`) on primary buttons, active category tabs, quick-add circles, cart badges, cart-item type tags, and completed/active status dots; glows on the wordmark "O", active nav item, and focus rings; hairline gradient rules under the header and across card caplines.
- **Accent Soft** (`#f4cd8c`): the lighter gradient stop, and the solid color for gold *text* — prices, active nav labels, payment-confirmed text, promo success, size-guide links, cart-item type labels.
- **Accent Dark** (`#c99548`): reserved as the darker gradient stop / pressed tone.
- **Accent Dim** (`rgba(232, 178, 95, 0.12)`): tinted fills — icon tiles, FAQ icons, admin avatar, VPN strip, status badges, and the active status-dot halo.
- **Accent Ink** (`#14120b`): the near-black text/icon color placed on top of gold fills. Never white on gold.

### Secondary
- **Border Strong** (`rgba(232, 178, 95, 0.3)`): the gold hairline. Used where a border must be visible as structure rather than as a mere edge — the free-request promo panel, secondary buttons, icon tiles, the modal drag handle, the floating request pill, the dashed photo-upload area.

### Tertiary
- **Signal** (`#ff6b5f`): error/negative only — promo-code errors, rejected-payment note, active (wishlisted) heart, cart remove on press. Warm-shifted from pure red so it belongs to the same warm room.

### Neutral
- **Page** (`#08080b`) with a fixed `radial-gradient(ellipse 900px 460px at 50% -8%, rgba(232,178,95,.08), transparent 60%)` halo — the background is a light source, not a flat fill.
- **Surface** (`#131318`): all lifted panels — product cards, cart items, order cards, admin/FAQ/referral cards, modal sheets.
- **Surface 2** (`#1a1a22`): recessed panels one step deeper — form inputs, promo box, modal product-preview strip, size-table header, inactive status dots.
- **Surface 3** (`#202029`): reserved deepest neutral step.
- **Border** (`rgba(255,255,255,.07)`): the default hairline on cards, inputs, and dividers.
- **Text** (`#f5f5f7` / `#b4b4bf` / `#8f8f9c`): primary / secondary / tertiary. All three clear 4.5:1 against `bg` and `surface`; `text-tertiary` at `#8f8f9c` is the floor — do not darken it further on these surfaces.

### Inverted
- **Plate** (`#ffffff`) and **Plate Ink** (`#6e6961`): the *only* light surface in the system, used exclusively behind product imagery — catalog tiles, modal gallery, cart thumbnails — and for the category-icon fallback drawn when a photo fails to load. Plate is not a general-purpose surface and must never be used for text panels, cards, or chrome.

### Named Rules
**The One Gold Rule.** Gold is the only chromatic color anywhere. A second hue (green, blue, purple, teal) is drift, not a variant. Signal red is an exception reserved strictly for failure states.

**The Lit-Not-Flat Rule.** Whenever gold is a *surface* (button, pill, circle, tag, dot) it must be a gradient and usually a glow. Whenever gold is *text*, it must be a solid color — never `background-clip: text`. Gradient-filled text is banned in this system.

## Typography

**Display/Body/Label Font:** Golos Text (self-hosted `.woff2`, Cyrillic + Latin subsets, weights 400/600/700/800), fallback `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. One family for every role, including the wordmark.

**Character:** A grounded Cyrillic-native text grotesk. Hierarchy is carried by weight (400→800), size, and negative letter-spacing at the largest sizes — never by switching typeface.

### Hierarchy
- **Display** (800, 20–22px, −0.01em to −0.02em): the "CL**O**SERS" wordmark, "Поддержка", "Часто задаваемые вопросы".
- **Title** (700–800, 13.5–18px): section titles, modal titles, product/modal price, cart-item title, order ID, admin name, referral title, FAQ question text.
- **Body** (400–500, 11.5–14px): product-card titles, cart-item detail lines, FAQ answers, form inputs, support intro.
- **Label** (600–800, 9–12.5px, sometimes uppercase): form labels (uppercase, 0.4px tracking), order-status badge (uppercase), size-table headers (uppercase, 0.3px tracking), bottom-nav labels, category-tab labels, pill-button labels.

### Named Rules
**The One Family Rule.** Golos Text is the only typeface, including the logotype. Hierarchy is a weight/size problem, never a font-swap problem.

## Layout

Single-column app shell, `max-width: 600px`, centered. A sticky glass header (translucent `rgba(8,8,11,.86)` + 10px backdrop blur, closed by a gold gradient hairline) holds the wordmark and wishlist toggle above a full-width search field; category pills scroll horizontally beneath it, then a gold-edged free-request panel, then the catalog grid — matching the FIRST VIEWPORT contract. The catalog is a dense **2-column** grid (`repeat(2, 1fr)`, 10px gap). Horizontal content margin is a consistent 14px throughout. A fixed bottom nav (z-index 100, glass + blur) and a floating "Свой запрос" pill (z-index 99) sit above scroll content; body reserves 96px bottom padding. Modals are bottom sheets (`align-items: flex-end`), capped at 600px, max-height 85vh, opened by a gold drag handle, with `env(safe-area-inset-bottom)` padding.

## Elevation & Depth

Depth is built from four stacked signals, not one: (1) tonal steps between page, surface, and surface-2; (2) a hairline border on every panel; (3) one shared shadow — `--shadow-card: inset 0 1px 0 rgba(255,255,255,.04), 0 10px 24px rgba(0,0,0,.4)` — whose *inset* top highlight simulates light catching the panel's top edge, which is what makes dark cards read as physical rather than as darker rectangles; and (4) gold caplines (a 2px `linear-gradient(90deg, accent, transparent)` bar) across the top of order cards and the cart summary. Gold-filled controls carry a colored glow instead of a neutral shadow (`--shadow-glow`, plus stronger per-control glows on the quick-add circle and floating pill). Glass surfaces (header, bottom nav) use backdrop blur rather than shadow to separate from content.

### Named Rules
**The Lit-Edge Rule.** Dark panels get the shared `--shadow-card` with its inset top highlight — never a plain drop shadow alone. Gold controls get a gold glow, never a neutral one.

## Shapes

Rounded rectangles at three steps — `--radius-sm` (10px) inputs and inset panels, `--radius-md` (14px) most cards, `--radius-lg` (20px) order cards, promo panel, and modal-sheet top corners — plus full pill rounding (`--radius-full`) for category tabs, badges, and pill buttons. Fully circular (`50%`): wishlist heart, quick-add "+", cart-item type tag, mini cart-count badge, status dots, admin avatar, modal close, and the active-nav indicator dot. No sharp corners anywhere.

## Motion

Motion exists to confirm input and to reveal content, never to decorate. All of it is disabled under `prefers-reduced-motion: reduce`.

- **Ripple** (`.ripple-dot`, 0.55s): a touch-origin circle expands from the exact pointer position on every interactive control (buttons, nav items, category tabs, quick-add, floating pill, wishlist toggle). Attached globally via one delegated `pointerdown` listener, so any control matching the selector inherits it for free — such controls must therefore be `position: relative; overflow: hidden`.
- **Cascade-in** (`card-in`, 0.45s, `cubic-bezier(.16,1,.3,1)`): product cards and cart items fade up in sequence via `animation-delay: calc(var(--i) * 45ms)`, where `--i` is set inline from the render loop index.
- **View transition** (`view-in`, 0.32s): each screen fades up on tab switch, paired with a Telegram `selectionChanged()` haptic tick.
- **Live-step pulse** (`dot-pulse`, 1.8s loop): only the *current* order-status dot breathes its gold halo — the one element on the surface allowed to loop indefinitely, because it represents live state.
- **Button sheen** (`btn-sheen`, 3.4s loop): a slow diagonal highlight crosses primary gold buttons.
- **Sheet-up** (0.22s): modals rise from the bottom edge.

### Named Rules
**The Confirmation Rule.** Every touch on an interactive control answers with a ripple; every tab switch answers with a haptic. Looping animation is reserved for elements representing live state (the active order step) and the primary CTA sheen — nothing else may loop.

## Components

### Buttons
- **Primary (`.btn`):** gold gradient fill, `accent-ink` text, 15px padding, weight 800, full width, gold glow, looping sheen, scales to 0.98 on press.
- **Secondary (`.btn-secondary`):** transparent fill, primary text, 1.5px `border-strong` gold hairline, no glow, no sheen.
- **Chrome pills (floating request, modal close):** translucent dark fill with a gold hairline and gold text — the quiet counterpart to the primary button.

### Chips
- **Category tabs:** pill-rounded, `surface` fill with a 1.5px hairline at rest, 12.5px/600 `text-secondary`, `flex-shrink: 0` so labels never compress, horizontally scrollable with hidden scrollbar.
- **Active state:** gold gradient fill, `accent-ink` text, gold glow.

### Cards / Containers
- **Corner Style:** `--radius-md` default; `--radius-lg` for order cards and the promo panel.
- **Background:** `surface` with a 1px hairline border and the shared `--shadow-card`.
- **Capline:** order cards and the cart summary carry a 2px gold-to-transparent gradient bar across the top edge.

### Inputs / Fields
- **Style:** `surface-2` fill, 1.5px hairline, `--radius-sm`.
- **Focus:** border turns gold plus a 3px `accent-dim` ring; the header search field additionally gains an outer gold glow.
- **Placeholder:** `text-tertiary`.

### Navigation
- **Bottom nav:** fixed, translucent `rgba(10,10,13,.9)` + 12px backdrop blur, hairline top edge with a faint gold line beneath it. Inactive items `text-tertiary`; the active item turns `accent-soft`, gains a text glow, and grows a small glowing gold dot beneath its label.

### Product Card (signature)
A dark `surface` panel wrapping a **pure-white plate** (`--plate`) that holds the product photo (`object-fit: contain`, 10px padding). Two circular controls pin to the plate's corners: the wishlist heart (translucent dark circle, top-left, turns `signal` when active) and the quick-add "+" (gold gradient circle with gold glow, bottom-right, scales to 0.88 on press). A gold `cart-badge-mini` appears top-right once the item is in the cart, and the whole card gains a gold border and glow in that state. Below the plate: a solid `accent-soft` 800-weight price, then a two-line-clamped `text-secondary` title — price deliberately outweighs the title. Cards cascade in on render.

### Cart Item Type Indicator (signature)
Item type (catalog product vs. free POIZON request) is never a bold uppercase kicker above the title. It is carried by two quiet signals: (a) `.cart-item-type-tag`, an 18px gold-gradient circle with a 2px `surface` ring pinned to the thumbnail's bottom-right corner, holding an icon only; and (b) `.cart-item-type-label`, a 10.5px/600 `accent-soft` line that is simply the first line of the detail block, typographically no louder than the size/color/notes lines beneath it.

## Do's and Don'ts

### Do:
- **Do** keep the page near-black with the warm top halo — the background is the room's light source and is what makes gold read as *lit* rather than merely yellow.
- **Do** keep exactly one chromatic color (gold `#e8b25f`), gradient-and-glowing as a surface, solid as text.
- **Do** put product imagery on the pure-white plate — the photography is white-background, and a dark well turns every photo into a broken white rectangle.
- **Do** give every dark panel the shared `--shadow-card` including its inset top highlight, rather than inventing a per-component shadow.
- **Do** build detail lines (cart items, order meta) by joining an array with `\n`, since these blocks use `white-space: pre-line` — literal newlines inside the template render as blank lines.

### Don't:
- **Don't** use `background-clip: text` with a gradient anywhere. Gold text is solid `accent-soft`.
- **Don't** add a second chromatic accent beside gold; `signal` red is for failure states only.
- **Don't** use `--plate` white for anything but product imagery and its fallback — it is not a general surface.
- **Don't** put white text or icons on a gold fill; gold fills always carry `accent-ink` (`#14120b`).
- **Don't** add looping animation to anything that is not live state or the primary CTA sheen.
- **Don't** collapse the catalog to one column, or reintroduce a bold uppercase kicker above product or cart-item titles.
- **Don't** load a second typeface; Golos Text is the only family, including the wordmark.

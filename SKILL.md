# SKILL.md — Shukritrade Premium UI Redesign

> **Project**: Shukritrade Trading Platform  
> **Edition**: v2 — Premium Design System  
> **Stack**: React + Vite + Tailwind CSS v4 + Framer Motion + Firebase  
> **Completed**: July 2026  

---

## 1. Design System

### 1.1 Color Palette (OKLCH)

All colors are defined as CSS custom properties in `App.css` and consumed via Tailwind's `@theme inline` block.

| Token | Dark Mode | Light Mode | Role |
|---|---|---|---|
| `--background` | `oklch(0.08 0.00 0)` | `oklch(0.98 0.002 85)` | Page background |
| `--foreground` | `oklch(0.97 0.00 0)` | `oklch(0.15 0.015 240)` | Primary text |
| `--card` | `oklch(0.12 0.005 85)` | `oklch(1.00 0.00 0)` | Card surfaces |
| `--primary` | `oklch(0.82 0.14 85)` | `oklch(0.59 0.10 72)` | Brand gold accent |
| `--secondary` | `oklch(0.16 0.01 85)` | `oklch(0.95 0.005 240)` | Subtle fills |
| `--muted-foreground` | `oklch(0.65 0.01 85)` | `oklch(0.45 0.02 240)` | De-emphasized text |
| `--border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` | Subtle borders |
| `--destructive` | `oklch(0.60 0.20 25)` | `oklch(0.55 0.22 25)` | Error states |

### 1.2 Typography

- **Latin**: `Inter` — geometric precision, excellent x-height
- **Arabic (RTL)**: `Cairo` — rounded, legible at all sizes
- Both loaded via Google Fonts in `index.html`
- Font rendering: `antialiased`, `optimizeLegibility`
- Body line length capped at ~70ch via `max-w-3xl` / `max-w-4xl` containers

### 1.3 Radius Scale

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `6px` | Inputs, small chips |
| `--radius-md` | `10px` | Buttons, badges, tight components |
| `--radius-lg` | `14px` | Cards, modals |
| `--radius-xl` | `18px` | Large panels |

Enforced rule: **never exceed `rounded-xl` (18px)** for any container. All `rounded-[2rem]`, `rounded-[3rem]`, `rounded-full` button patterns were removed.

### 1.4 Motion Principles

- **Entry**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- **Exit**: `exit={{ opacity: 0, y: -20 }}`
- **Hover lift**: `hover:-translate-y-0.5 transition-all`
- **Active press**: `active:scale-95` on interactive buttons
- **Spinner**: `border-t-primary animate-spin` with `border-primary/20` track
- No image hover animations — card hover uses `border-color` and `background-color` only

---

## 2. Design Violations Fixed

The following anti-patterns were systematically removed across all components:

| Anti-Pattern | Fix Applied |
|---|---|
| `rounded-[2rem]` / `rounded-[3rem]` containers | Replaced with `rounded-xl` (14px) |
| `rounded-full` on non-pill/avatar elements | Replaced with `rounded-md` |
| `bg-clip-text` gradient text on headings | Replaced with solid `text-primary` |
| `bg-black` / `bg-zinc-900` hardcoded backgrounds | Replaced with `bg-background` / `bg-card` |
| `text-white` / `text-gray-400` hardcoded | Replaced with `text-foreground` / `text-muted-foreground` |
| `border-white/5` / `border-white/10` | Replaced with `border-border` |
| `bg-amber-500` / `text-amber-500` hardcoded | Replaced with `bg-primary` / `text-primary` |
| `group-hover:scale-110` on images | Removed (banned per skill rules) |
| CSS `linear-gradient` grid background in Auth | Removed entirely |
| Dynamic color classes via string interpolation (`bg-${color}-500`) | Replaced with static `bg-primary/10` |
| `cursor-default` on interactive buttons | Added `cursor-pointer` consistently |

---

## 3. Components Redesigned

### Phase 1 — Design Foundation
- **`App.css`** — Established full `@theme inline` with OKLCH tokens, `@custom-variant dark`, light/dark CSS variable maps, and `@utility` premium card helpers
- **`index.css`** — Fixed Tailwind v4 dual-import issue: changed from `@import "tailwindcss"` to `@import "./App.css"` (single canonical entry point)
- **`index.html`** — Added Google Fonts (Inter + Cairo), set dark class default, added comprehensive SEO meta tags

### Phase 2 — Core Layout
- **`Header.jsx`** — Replaced over-rounded pill nav with `rounded-md` tabs; replaced `amber-500` hardcodes with `primary`; added liquid light/dark mode toggle; fixed dropdown clipping with proper z-index layering
- **`Hero.jsx`** — Removed gradient text on H1; replaced identical card grid with asymmetric highlight layout; replaced gradient CTA with solid `bg-primary` button; removed image hover scale animations
- **`Benefits.jsx`** — Replaced `rounded-full` icon containers with `rounded-md` squares; changed middle card from identical to visually emphasized with `border-primary/30` ring; removed group-hover image scale
- **`Footer.jsx`** — Expanded to premium 3-column grid layout with social links, legal links, and brand statement

### Phase 3 — Auth Screen
- **`Auth.jsx`** — Removed CSS `linear-gradient` grid background pattern; removed `bg-clip-text` gradient heading; reduced card border-radius to `rounded-xl`; standardized all form inputs to `bg-secondary border-border`

### Phase 4 — Dashboard & Data Pages
- **`Feed.jsx`** — Card tokens, border tokens, removed `rounded-[2.5rem]`, standardized comment inputs
- **`NewsPage.jsx`** — Replaced generic blue accents with gold primary, mapped all slate backgrounds to card/secondary tokens
- **`BooksPage.jsx`** — Mapped all dark hardcodes to semantic tokens
- **`Courses.jsx`** — Standardized card and button patterns
- **`Settings.jsx`** — Unified form card layout, standardized selects and inputs
- **`MarketIntelligence.jsx`** — Full token mapping for sidebar analytics panel and news feed
- **`AdminDashboard.jsx`** — Tab navigation uses `bg-primary` active state; user cards use `bg-card` with `hover:border-primary/20`; ban modal uses `destructive` tokens; settings toggles use `bg-primary` active state

### Phase 5 — UI Primitives
- **`badge.jsx`** — Already using design tokens, verified
- **`button.jsx`** — Uses `bg-primary` default variant
- **`card.jsx`** — Uses `bg-card border-border` with `rounded-lg`

### Phase 6 — App Shell
- **`App.jsx`** — `LoadingScreen` uses `border-t-primary`; `BannedScreen` uses `bg-card border-destructive/20 rounded-xl`; main layout `bg-background`
- **`PageSkeletons.jsx`** — All skeletons replaced `bg-black`/`bg-zinc-900` with `bg-background`/`bg-card`; replaced `rounded-[2.5rem]` with `rounded-xl`; replaced `border-white/5` with `border-border`

---

## 4. CSS Architecture

```
src/
├── index.css          ← Entry: @import "./App.css" + utilities
└── App.css            ← @theme inline (OKLCH tokens) + :root vars + @layer base
```

**Key decision**: In Tailwind v4, `@apply bg-background` only resolves when `@theme inline { --color-background: var(--background) }` is in the **same** CSS compilation chain. Having a second `@import "tailwindcss"` in `index.css` created an isolated compilation context that couldn't see the tokens defined in `App.css`. Fixed by removing the duplicate import and making `index.css` import `App.css` instead.

---

## 5. Build Verification

```
✓ 2959 modules transformed
✓ 0 errors
✓ 0 type errors
Build time: ~27s
```

Output: `dist/` — production-ready bundle.

---

## 6. Light / Dark Mode

Both modes tested and functional:
- Toggle via `html.light` class (set by `ThemeContext`)
- All 18 CSS token pairs switch cleanly
- Scrollbar thumb, skeleton shimmer, and glass-card all adapt to mode
- Primary gold shifts from `oklch(0.82 0.14 85)` (dark, bright) to `oklch(0.59 0.10 72)` (light, WCAG-safe readable)

---

## 7. What Was NOT Changed

Per the brief, the following were intentionally untouched:

- Firebase configuration (`lib/firebase.js`)
- All API integrations and data fetching logic  
- React Router routes in `App.jsx`
- Authentication logic (`onAuthStateChanged`, etc.)
- Admin permission checks
- Cloudinary upload logic
- i18n translations (`i18n.js`)
- All business logic, handlers, and state management

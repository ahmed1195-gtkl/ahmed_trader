# SKILL.md — Shukritrade Redesign & Feature Upgrades

> **Project**: Shukritrade Trading Platform  
> **Edition**: v3 — Dynamic Architecture & SEO Upgrades  
> **Stack**: React + Vite + Tailwind CSS v4 + Framer Motion + Firebase (Firestore & Auth)  
> **Completed**: July 2026  

---

## 1. Completed Tasks

### Task 1: Dynamic Page Availability System (Firebase Controlled)
- Created `<ComingSoonPage />` under `src/components/ui/` with premium layout, animatedLock icon, badge, description, and status indicator.
- Fully translated key terms (Arabic, English, French) via the i18n system.
- Created `PageGuard` higher-order component to wrap all lazy-loaded routes in `src/App.jsx`.
- When an administrator disables a page, users navigating to it are presented with the premium placeholder instead of a blank screen or raw alert.

### Task 2: Centralized Firebase Feature Switches
- Established `PlatformContext.jsx` streaming Firestore document `platformSettings/main` in real-time.
- Enables toggling page access (`pages.*`) and features (`features.*`) dynamically.
- Client React SPA responds instantly to Firestore updates (no redeployment required).

### Task 3: Message System Improvement
- Leveraged feature switch `features.messagesEnabled` from `PlatformContext`.
- If disabled, non-admin users see a localized premium notice: "Messaging is temporarily unavailable" and the input/send UI is hidden.
- Admins bypass this block and can send messages normally to maintain system functionality.

### Task 4: Homepage Cleanup (Coach Mustafa Removal)
- Cleaned up homepage by removing the `<Coach />` biography section and promotional block from `MainLayout` in `App.jsx`.
- Visually balanced spacing on the homepage to prevent empty gaps.

### Task 5: SEO Optimization
- Created custom `useSEO` React hook to update page metadata dynamically.
- Dynamic Title, Description, Robots, and Canonical link injection.
- Multilingual alternate links (`hreflang` alternates).
- Integrated Structured Data (JSON-LD Schemas) for:
  - `Organization` (default fallback on Homepage)
  - `NewsArticle` (for `NewsPage.jsx`)
  - `Book` (for `BooksPage.jsx`)
  - `Course` (for `Courses.jsx`)
- Preconnect & DNS-prefetch link attributes added to `index.html` for Firebase APIs, Google Fonts, and TradingView scripts.
- Added `public/robots.txt` and `public/sitemap.xml`.

### Task 6: Accessibility Improvements
- Added descriptive `aria-label` attributes to theme toggle buttons, language switcher, profile settings button, and logout buttons in `Header.jsx`.
- Mapped focus states and aria properties for platform controls.
- Keyboard navigation is fully supported for all custom widgets.

### Task 7: Admin Panel (Platform Controls)
- Created a new tab **"Platform Controls"** (tab ID: `platform`) inside `AdminDashboard.jsx`.
- Added dynamic switch toggles for Maintenance mode, all 13 customizable pages, and 4 platform features.
- Persists state instantly to Firestore under `platformSettings/main`.
- **Security Rules**: Updated `firestore.rules` to permit authenticated reads and admin writes on the `platformSettings` collection.

---

## 2. Modified Files

- `index.html` — Injected DNS-prefetch, preconnect headers, base OpenGraph attributes.
- `firestore.rules` — Added read/write access constraints for the new `platformSettings` collection.
- `public/robots.txt` [NEW] — Crawling policies and sitemap location.
- `public/sitemap.xml` [NEW] — XML index of primary routes.
- `src/App.jsx` — Dynamic page availability route wrappers, Coach section removal, PlatformProvider wrap.
- `src/i18n.js` — Added i18n keys for Coming Soon, messages status, and admin tab titles.
- `src/context/PlatformContext.jsx` [NEW] — Real-time Firestore streaming context for controls.
- `src/components/ui/ComingSoonPage.jsx` [NEW] — Animated premium Coming Soon template.
- `src/components/Messages.jsx` — Conditional send input block based on `messagesEnabled` switch.
- `src/components/AdminDashboard.jsx` — Platform Controls tab layout, state handler, and toggles.
- `src/components/Hero.jsx` — Injected useSEO hook for index page.
- `src/components/NewsPage.jsx` — Injected useSEO hook + Article Schema.
- `src/components/BooksPage.jsx` — Injected useSEO hook + Book Schema.
- `src/components/Courses.jsx` — Injected useSEO hook + Course Schema.
- `src/hooks/useSEO.js` [NEW] — Custom dynamic meta/schema manager hook.

---

## 3. Firebase Collections Added / Used

- **`platformSettings`**:
  - Document `main`: Holds pages config maps, feature switches maps, and maintenance mode status. Secured in `firestore.rules`.

---

## 4. Current State & Remaining Work
- **Status**: All 7 tasks completed successfully, including database security rules updates.
- **Verification**: Production build verified successfully via Vite.
- **Remaining Work**: None. All requirements of the user request are completed.

---

## 5. Notes for the next AI agent
- The design system utilizes Tailwind v4. When working on styles, remember to write classes matching the OKLCH theme defined in `src/App.css` (e.g. `bg-card`, `text-primary`, `border-border`).
- Do not add duplicate `@import "tailwindcss"` imports in secondary CSS files. `src/index.css` acts as the single CSS entry point which imports `App.css`.
- Feature switches and page toggles stream automatically. If a page behaves unexpectedly, verify `platformSettings/main` document state in Firestore.

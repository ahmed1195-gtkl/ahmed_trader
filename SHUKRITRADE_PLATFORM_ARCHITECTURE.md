# SHUKRITRADE — Platform System Architecture & Engineering Blueprint

## 1. Executive Summary & Overview

**SHUKRITRADE** is an advanced, production-oriented educational and financial intelligence trading platform. Designed with high-performance Web standards, micro-animations, real-time Firestore synchronization, and strict role-based access control (RBAC), SHUKRITRADE delivers real-time market data, interactive academy courses, algorithmic trading challenges, community feeds, and market intelligence tools.

---

## 2. Technology Stack & Frameworks

- **Frontend Core**: React 19, Vite (JSX), React Router v7 (HashRouter architecture).
- **Design System & Styling**: Tailwind CSS v4, Vanilla CSS variable design system, Framer Motion for micro-animations, Lucide React for iconography.
- **Backend & Database**: Firebase v12 (Firestore real-time document listener streams & Authentication).
- **Internationalization**: i18next & react-i18next (Dual LTR/RTL support for English and Arabic).
- **Media Hosting**: Cloudinary API integrations for user media uploads.

---

## 3. Core Architectural Principles

1. **Zero-Downtime Hot Upgrades**: Non-destructive upgrades that preserve all existing user accounts, course data, subscription functional hooks, and database schemas.
2. **Real-time Configuration Engine**: Dynamic configuration streamed from `platformSettings/main` via `PlatformContext` without requiring client rebuilds or hard reloads.
3. **Decoupled System Roles vs. Account Tiers**:
   - **System Roles**: Controls access permissions, administrative control panels, and bypass rights (`admin`, `account_manager`, `user`).
   - **Account Tiers**: Controls feature level & subscription benefits (`pro`, `premium`, `normal`).
4. **Zero Fake Metrics Directive**: Absolute removal of hardcoded numbers, mock user counts, or fake reviews. All metrics reflect 100% real Firestore database data.
5. **Strict Field-Level Security**: Firestore Security Rules enforce that clients cannot manipulate their own `role`, `accountTier`, `isAccountManager`, `isAdmin`, `isPro`, `isPremium`, or unauthorized `socialLinks`.

---

## 4. Roles & Tiers Matrix

| Badge Label | Classification | Key Attributes | Badge Theme | Permissions & Access |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | System Role | `role: 'admin'`, `isAdmin: true` | Gold / Amber (`bg-amber-500/15`) | Full administrative access, user role management, per-page maintenance control, full bypass. |
| **ACCOUNT MANAGER** | System Role | `role: 'account_manager'`, `isAccountManager: true` | Purple (`bg-purple-500/15`) | Authorized staff role. Access to maintenance pages, ability to configure public social media links. |
| **PREMIUM** | Account Tier | `accountTier: 'premium'`, `isPremium: true` | Emerald (`bg-emerald-500/15`) | Full platform feature access, premium content unlocked. |
| **PRO** | Account Tier | `accountTier: 'pro'`, `isPro: true` | Sky Blue (`bg-sky-500/15`) | Advanced features and trading challenge participation unlocked. |
| **NORMAL** | Account Tier | `accountTier: 'normal'` | Minimal Default | Base educational content & community feed access. |

---

## 5. Maintenance System & Per-Page Access Control

Per-page maintenance mode is dynamically enforced at the router layer (`App.jsx`) via `PageGuard` and streamed real-time from `platformSettings/main` through `PlatformContext`.

### 5.1 Configuration Schema (`platformSettings/main`)
```json
{
  "maintenance": false,
  "pages": {
    "courses": true,
    "news": true,
    "academy": true,
    "aiBot": true,
    "challenges": true,
    "messages": true,
    "community": true,
    "books": true,
    "brokers": true,
    "marketIntelligence": true
  },
  "pageMaintenance": {
    "courses": {
      "enabled": false,
      "message": "Updating trading course curriculum for 2026",
      "startTime": "2026-08-20T02:00:00Z",
      "returnTime": "2026-08-20T06:00:00Z"
    }
  }
}
```

### 5.2 Router Enforcement Flow (`PageGuard`)
1. `PageGuard` inspects current route `pageKey`.
2. Checks global `maintenance` toggle and per-page `pageMaintenance[pageKey].enabled`.
3. **Bypass Check**: If caller is `ADMIN` or `ACCOUNT MANAGER`, maintenance UI is bypassed and full access is granted for testing/management.
4. **Maintenance Screen**: Normal users encounter the `MaintenancePage` UI displaying custom banner messages, start time, expected return time, and home navigation.

---

## 6. Profile Privacy & Staff Social Links Rules

### 6.1 Public Profile Privacy Matrix
- **Normal Users**: Exposes **Display Name** and compact **UserBadge** ONLY. Email, phone number, age, country, bio, and internal identifiers are hidden from public view.
- **Staff Accounts (Admin & Account Manager)**: Exposes Display Name, UserBadge, and verified **Official Staff Links** (LinkedIn, TikTok, Facebook, Telegram, Instagram).
- **Profile Owner**: Exposes full profile info, edit controls, email, phone, age, country, and security settings.

### 6.2 URL Sanitization & Security
All staff social links are sanitized prior to saving and rendering to prevent XSS and protocol injection attacks:
```js
function sanitizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) return '';
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}
```

---

## 7. Firestore Security Rules Architecture

Located in `firestore.rules`, enforcing server-side document and field-level security:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.isAdmin == true ||
        request.auth.token.email == 'mchokri100@gmail.com' ||
        request.auth.token.email == 'ahmed1195@gmail.com'
      );
    }
    function isStaffRole() {
      return isSignedIn() && (
        isAdmin() ||
        request.auth.token.role == 'account_manager' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'account_manager' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAccountManager == true
      );
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId);
      allow update: if isAdmin() || (
        isOwner(userId) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'accountTier', 'isAccountManager', 'isAdmin', 'isPro', 'isPremium']) &&
        (isStaffRole() || !request.resource.data.diff(resource.data).affectedKeys().hasAny(['socialLinks']))
      );
      allow delete: if isAdmin();
    }

    match /platformSettings/{settingsId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 8. Verification & Operational Playbook

### 8.1 Build & Code Verification
Execute Vite build to confirm clean compilation:
```bash
npm run build
```

### 8.2 Maintenance Testing Procedure
1. Navigate to `/admin` dashboard -> **Page Maintenance** tab.
2. Toggle maintenance mode ON for `/courses`.
3. Log out or log in as normal user -> Navigate to `/courses` -> `MaintenancePage` UI is displayed with custom message.
4. Log in as Admin or Account Manager -> Navigate to `/courses` -> Page renders normally (Staff Bypass active).

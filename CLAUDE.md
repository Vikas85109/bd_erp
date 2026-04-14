# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeadFlow CRM — a frontend-only Lead Management & Sales Automation System built as a single-page React application. No backend; all data is structured dummy JSON in `/src/data/`. The app is the only thing in the repo — there is no server, no API layer, and no test suite.

## Commands

All commands run from the `lead-management/` subdirectory (the repo root only contains `CLAUDE.md` and that one folder):

```bash
cd lead-management
npm install          # install dependencies
npm run dev          # start dev server (http://localhost:5173)
npm run build        # production build to dist/
npm run lint         # ESLint (flat config, eslint.config.js)
npm run preview      # preview production build
```

There is no test runner configured.

## Tech Stack

- **React 19** with functional components and hooks (JSX, no TypeScript)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — uses `@theme` block in `index.css` (not `tailwind.config.js`)
- **React Router v7** — client-side routing with `BrowserRouter`
- **lucide-react** — icon library used throughout all components
- **@headlessui/react** — available but not yet used

## Architecture

All source code lives in `lead-management/src/`:

- **`App.jsx`** — Router with all routes, every route nested inside a single `MainLayout` element route
- **`layouts/MainLayout.jsx`** — Shell with collapsible `Sidebar` + glass `Navbar` + `<Outlet />`
- **`pages/`** — One component per route: Dashboard, Leads, LeadDetails (`:id`), Quotations, AIAssistant, FollowUps, CRM, Clients, Products, Categories, Users, EditUser (`:id/edit`), Permissions, Settings
- **`components/`** — Reusable UI: StatCard, DataTable, Badge, ChatBubble, TaskCard, KanbanColumn, Modal, Toast, SkeletonLoader, ComingSoon, Sidebar, Navbar
- **`data/`** — Dummy data modules: `leads.js`, `chat.js`, `followups.js`, `quotations.js`, `crm.js`, `dashboard.js`, `products.js`, `users.js`. Each exports arrays/objects plus helper functions (e.g., `getStatusColor()`, `getChatMessages(leadId)`, `getLeadFollowups(leadId)`)
- **`utils/`** — Currently empty; reserved for future shared helpers

### Routing

All routes are nested inside `MainLayout` so the sidebar/navbar shell is shared. Dynamic routes:
- `/leads/:id` → `LeadDetails` reads `id` and joins data from `leads.js`, `chat.js`, and `followups.js`
- `/users/:id/edit` → `EditUser`
- `/products/categories` → `Categories` (nested under Products in the sidebar grouping)

### Design System

Defined entirely in `src/index.css` using Tailwind v4 `@theme` block — custom color tokens:
- `primary-*` (soft indigo), `secondary-*` (warm slate), `accent-*` (teal), `warning-*` (amber), `error-*` (rose)
- `surface-bg`, `surface-card`, `surface-border`, `surface-muted` for neutral surfaces
- Design intent: light, airy, whisper-soft tints — no heavy gradients or saturated blocks
- Icons use black/white or neutral gray (`text-secondary-800` on `bg-gray-100`)

### Data Pattern

Each data file exports arrays/objects + helper functions. Chat messages and follow-ups are keyed by `leadId` so each lead detail page shows its own data. Adding a new lead requires entries in `leads.js` and optionally in `chat.js` (via `chatMessagesByLead[id]`) and `followups.js` (with `leadId` field).

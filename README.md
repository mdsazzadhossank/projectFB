# MessageHub — Multichannel Customer Inbox

A production-oriented React + PHP/MySQL customer messaging dashboard. Unifies **Facebook Messenger** and **WhatsApp Business** conversations into one inbox with CRM contacts, real-time updates (Pusher), analytics (Recharts), and integration management.

## Tech Stack

- **Frontend:** React 19, TypeScript (strict), Vite 6, Tailwind CSS v4
- **Backend:** PHP 8 (PDO/MySQL) REST endpoints under `api/`
- **Database:** MySQL (`messagehub`)
- **Realtime:** Pusher (`pusher-js`)
- **Charts:** Recharts · **Icons:** lucide-react

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PHP 8.0+ with `pdo_mysql` and `curl` extensions
- MySQL (XAMPP, Laragon, or standalone)

### 2. Database

1. Create the database and tables, then load seed data:

```sql
CREATE DATABASE IF NOT EXISTS messagehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE messagehub;
SOURCE schema.sql;
```

2. Verify credentials in `api/db_connect.php` (defaults to XAMPP: root / empty password). Override via `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASS`.

### 3. Backend

Serve the `api/` directory with PHP. For example with XAMPP, copy `api/` into `htdocs/messagehub-api/`, or run:

```bash
php -S localhost:8000 -t api
```

> The Vite dev server proxies `/api` → `localhost:8000` (see `vite.config.ts`). Adjust if your PHP server runs on a different port.

### 4. Frontend

```bash
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### 5. Environment Variables

Copy `.env.example` to `.env` and fill in values:

| Variable | Purpose | Required |
| --- | --- | --- |
| `VITE_PUSHER_KEY` / `VITE_PUSHER_CLUSTER` | Pusher realtime channel | Dev fallback built in |
| `VITE_FACEBOOK_APP_ID` | Facebook OAuth page-connect flow | Optional |
| `VITE_MESSAGEHUB_API_SECRET` / `MESSAGEHUB_API_SECRET` | Shared write-auth secret | **Yes for production** |
| `MESSAGEHUB_FB_PAGE_ID` / `MESSAGEHUB_FB_PAGE_TOKEN` | Outbound Messenger sends (Graph API) | Optional |
| `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASS` | MySQL connection | Defaults to XAMPP |

**Important:** In production, set `MESSAGEHUB_API_SECRET` on the server. When it is set, every `POST`/`PUT`/`DELETE` to the PHP API must send the secret in the `X-MessageHub-Secret` header. When it is empty, write auth is disabled for local development.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with `/api` proxy |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

## Project Structure

```
api/            PHP backend (auth, contacts, conversations, messages, integrations)
schema.sql      DB schema + seed data
src/
  components/   UI components (inbox, modals, layout, ui)
  context/      MessagingContext, ThemeContext
  data/         mock/fallback data
  lib/api.ts    typed API layer + DTO normalization
  pages/        Dashboard, Inbox, Contacts, Analytics, Integrations, Settings
  types/        domain TypeScript types
```

## Notes

- The UI seeds from bundled mock data and swaps in live backend data when the API is reachable, so the app renders even without the backend running.
- Hardcoded secrets are not committed. Real tokens/keys live in environment variables.

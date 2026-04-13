# EcoSpark Hub Frontend

EcoSpark Hub Frontend is a Next.js 16 application for discovering, publishing, reviewing, and purchasing sustainability ideas. It combines a public idea catalog, member publishing tools, admin moderation workflows, newsletter management, payment return handling, and AI-assisted discovery into a single frontend that talks to an external backend API.

## Key Features

- Public homepage with featured ideas, platform overview sections, newsletter entry points, and a floating AI support chat widget
- Approved ideas catalog with keyword search, category and access filters, sort options, pagination, and AI-generated search guidance
- Idea detail pages with vote actions, threaded comments, paid/free access handling, and Stripe purchase entry for locked premium ideas
- Member workspace for creating drafts, editing existing ideas, deleting non-approved ideas, and submitting drafts for admin review
- AI-assisted draft generation for member idea forms, including readiness scoring and auto-filled content suggestions
- Member dashboard with charts, purchase history, premium spend tracking, and AI insight cards
- Admin dashboard with moderation analytics, review queue management, category CRUD, newsletter subscriber management, and user administration
- Authentication flows for register, login, logout, Google sign-in bootstrap, email verification, forgot-password reset, change-password, and protected profile access
- Role-based access control for `MEMBER` and `ADMIN` users, plus user status handling for `ACTIVE` and `DEACTIVATED`
- Responsive UI with light/dark theme support

## Tech Stack

### Core

- Next.js 16.2.2
- React 19.2.4
- TypeScript 6
- Tailwind CSS 4
- pnpm

### Data, Forms, and API

- Axios
- TanStack Query
- TanStack Form
- TanStack React Table
- Zod

### UI and Interaction

- shadcn/ui-style primitives
- `@base-ui/react`
- Radix UI
- Lucide React
- Framer Motion
- Recharts
- Sonner
- next-themes
- input-otp
- Lenis

### Important Note on Dependencies

The package manifest also includes `better-auth` and `jsonwebtoken`, but those libraries are not referenced in the current frontend source. The implemented auth flow is built around custom API services, cookie-based backend sessions, and Next route-handler proxies.

## Project Structure

```text
.
├─ public/                         Static SVG assets
├─ src/
│  ├─ app/                         App Router layouts, pages, loading/error states
│  │  ├─ (public)/                 Public pages, auth pages, payment return pages
│  │  ├─ (dashboardLayout)/        Member and admin dashboard routes
│  │  └─ api/v1/auth/              Auth proxy route handlers and Google callback bridge
│  ├─ components/
│  │  ├─ ecospark/                 Product-specific UI, dashboards, auth, ideas, chat, payments
│  │  ├─ shared/                   Header, footer, brand components
│  │  └─ ui/                       Reusable UI primitives
│  ├─ data/                        Mock/reference content modules
│  ├─ hooks/                       Custom hooks such as current-user fetching
│  ├─ lib/                         App config, routes, helpers, AI utilities, client auth helpers
│  │  └─ server/                   Server-side fetch helpers
│  ├─ providers/                   Theme and React Query providers
│  ├─ services/                    API service layer for auth, ideas, admin, payments, newsletter, AI
│  ├─ types/                       Shared API and domain contracts
│  └─ proxy.ts                     Request proxy header middleware for app traffic
├─ .env.example
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
└─ tsconfig.json
```

## Installation

### Prerequisites

- Node.js installed locally
- pnpm installed locally
- A running backend API that matches the contract used by `src/services/*`

### Setup

```bash
git clone https://github.com/arefin008/eco_spark_hub_frontend.git
cd eco_spark_hub_frontend
pnpm install
```

## Environment Variables

Create a `.env` file in the project root.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for the external backend API. Used by rewrites and auth proxy handlers. Example: `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public frontend origin used for callback URL resolution. Example: `http://localhost:3000` |
| `NEXT_PUBLIC_GOOGLE_AUTH_URL` | No | Overrides the Google auth start URL. Defaults to `/api/v1/auth/google` |
| `NEXT_PUBLIC_DEMO_USER_EMAIL` | No | Demo login autofill email shown on the login page |
| `NEXT_PUBLIC_DEMO_USER_PASSWORD` | No | Demo login autofill password shown on the login page |
| `NEXT_PUBLIC_FACEBOOK_AUTH_URL` | No | Supported by config/service code, but no Facebook sign-in control is currently rendered in the UI |

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
# NEXT_PUBLIC_GOOGLE_AUTH_URL=/api/v1/auth/google
# NEXT_PUBLIC_DEMO_USER_EMAIL=member@ecospark.dev
# NEXT_PUBLIC_DEMO_USER_PASSWORD=demo123456
```

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Starts the Next.js development server with webpack |
| `pnpm dev:reset` | Deletes `.next` and restarts the dev server |
| `pnpm clean` | Removes the `.next` build cache |
| `pnpm build` | Creates the production build |
| `pnpm start` | Starts the production server |
| `pnpm lint` | Runs ESLint |

There is currently no `test` script in `package.json`.

## Running the Project Locally

1. Start the backend API referenced by `NEXT_PUBLIC_API_BASE_URL`.
2. Add the required environment variables.
3. Run:

```bash
pnpm dev
```

4. Open `http://localhost:3000`.

Notes:

- Most core features depend on the external backend being available, including auth, ideas, comments, voting, admin metrics, AI responses, and purchase status.
- Google sign-in callback handling depends on `NEXT_PUBLIC_APP_URL` matching the frontend origin you are using.
- Paid idea access expects the backend purchase endpoint to return a Stripe checkout URL.

## Main Modules and Pages

| Route / Module | Purpose |
| --- | --- |
| `/` | Public homepage with hero, featured ideas, newsletter CTA, and platform overview sections |
| `/ideas` | Approved ideas browser with filters, sorting, pagination, AI search summary, trending suggestions, and personalized matches |
| `/ideas/[ideaId]` | Idea detail page with access gating, purchase entry, voting, and threaded comments |
| `/about-us` | Static platform overview page |
| `/newsletter` | Newsletter signup page |
| `/newsletter/unsubscribe` | Newsletter unsubscribe flow |
| `/blog` | Static editorial placeholder page |
| `/privacy-policy` | Static privacy policy page |
| `/terms-of-use` | Static terms page |
| `/login` and `/register` | Guest-only auth entry pages |
| `/forgot-password` | OTP-based password recovery page |
| `/verify-email` | OTP-based email verification page |
| `/change-password` | Auth-protected password change page |
| `/my-profile` | Auth-protected account management page |
| `/payments/stripe/success` and `/payments/stripe/cancel` | Payment return pages that resolve purchase status |
| `/dashboard` | Role-aware overview page for members and admins |
| `/dashboard/member/ideas` | Member idea management and draft editing |
| `/dashboard/member/ideas/new` | Member idea creation view using the same manager component |
| `/dashboard/member/purchases` | Member purchase history |
| `/dashboard/member/purchases/[purchaseId]` | Purchase status detail page |
| `/dashboard/admin/ideas` | Admin moderation queue and manual idea lookup |
| `/dashboard/admin/categories` | Category create/edit/delete management |
| `/dashboard/admin/newsletters` | Newsletter subscriber management |
| `/dashboard/admin/users` | User table with filters, pagination, and status actions |
| `/dashboard/admin/users/[userId]` | Individual user detail and edit page |

## Authentication and Authorization Overview

The current authentication implementation is frontend-to-backend and cookie-based.

- Email/password register and login are handled through `/auth/register` and `/auth/login`
- Current user state is fetched with `/auth/me`
- Auth requests use `withCredentials: true`
- Failed auth requests can trigger an automatic refresh-token attempt through `/auth/refresh-token`
- Logout is handled through `/auth/logout`
- Email verification, forgot-password, reset-password, and change-password all use dedicated backend auth endpoints
- Google OAuth is supported through frontend route handlers that proxy the backend start and callback endpoints
- Demo login autofill is available on the login form through optional env values

### Access Control

- `GuestGuard` redirects authenticated users away from auth pages
- `AuthGuard` protects profile and dashboard routes
- Dashboard sections are role-gated:
  - `MEMBER` users can access member idea and purchase routes
  - `ADMIN` users can access admin moderation, user, category, and newsletter routes

### User Roles and Status

The frontend domain model includes:

- Roles: `MEMBER`, `ADMIN`
- Statuses: `ACTIVE`, `DEACTIVATED`
- Email verification state: `emailVerified: boolean`

## API Overview

### Next.js Route Handlers in This Repo

These are the only backend-facing modules implemented inside this frontend repository:

| Route | Purpose |
| --- | --- |
| `/api/v1/auth/[...path]` | Generic auth proxy to the backend auth endpoints |
| `/api/v1/auth/me` | Current-user proxy that normalizes backend `401` into `{ data: null }` |
| `/api/v1/auth/google` | Google auth start proxy |
| `/api/v1/auth/google/callback` | Google callback proxy with cookie forwarding |

These handlers exist mainly to preserve auth cookies and normalize backend `Set-Cookie` behavior across environments.

### Backend Endpoint Groups Consumed by the Frontend

The service layer calls the following resource groups from the external backend:

- `auth`
- `ideas`
- `ai`
- `categories`
- `comments`
- `votes`
- `newsletters`
- `payments`
- `purchases`
- `users`
- `admins`

All non-handler client calls are made against `/api/v1/*`, and `next.config.ts` rewrites those requests to `NEXT_PUBLIC_API_BASE_URL`.

## Database Overview

This repository does **not** include a database schema, ORM configuration, or migration files. There is no Prisma, Drizzle, TypeORM, Sequelize, or Mongoose implementation in the frontend codebase.

What the frontend does expose is the backend data contract through TypeScript models in `src/types/domain.ts`. The main entities inferred from that contract are:

- `User`
- `Category`
- `Idea`
- `IdeaMedia`
- `Comment` / `ThreadComment`
- `Purchase`
- `NewsletterSubscription`
- `AdminStats`

The frontend also assumes vote records and auth/session records exist in the backend, but their persistence layer is not part of this repository.

## Feature-Specific Backend Expectations

Based on the implemented frontend services, the backend is expected to provide:

- Auth session handling with access/refresh behavior
- User profile updates and admin-level user updates
- Idea CRUD plus review actions
- Comment creation, listing, nested reply support, and deletion
- Vote creation/removal
- Category CRUD
- Newsletter subscribe, list, and unsubscribe actions
- Purchase creation and payment status lookup
- Stripe checkout initiation and return handling
- AI assistant responses and AI draft suggestions
- Admin statistics for dashboard analytics

## Future Improvements

- Add automated tests for auth flows, dashboard permissions, idea submission, and payment return paths
- Publish backend API documentation and database schema alongside the frontend for easier onboarding
- Either complete the Facebook sign-in UI or remove the dormant config/service path
- Replace placeholder blog content with a real editorial feed
- Audit and either wire up or remove currently unused helper/reference modules

## Author

Nasimul Arafin Rounok

- GitHub: [arefin008](https://github.com/arefin008)
- LinkedIn: [nasimul-arafin-rounok](https://www.linkedin.com/in/nasimul-arafin-rounok)
- Email: [arefinrounok@gmail.com](mailto:arefinrounok@gmail.com)

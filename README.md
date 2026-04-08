# EcoSpark Hub Frontend

EcoSpark Hub Frontend is a modern sustainability platform built with Next.js 16 and React 19. It combines a public idea discovery experience, member publishing tools, admin moderation workflows, premium purchase flows, and AI-assisted interactions in a single frontend application.

## Live URLs

- Frontend: https://ecospark-hub-frontend.vercel.app/
- Backend API: https://ecosparkhubbackend.vercel.app/

## What Changed

The current frontend includes a broader feature set than the earlier project summary:

- Redesigned public homepage with structured sections, animated reveals, featured ideas, and newsletter entry points
- Public AI chat widget for idea discovery and support prompts
- AI-assisted idea drafting for members with readiness scoring and draft suggestions
- Upgraded auth UX with Google sign-in, demo login autofill, stronger validation, and improved password flows
- Expanded profile area with account editing, email verification, signed-in password change, and OTP-based reset tools
- Richer member and admin dashboards with analytics cards, charts, filters, tables, and AI insight panels
- Updated site navigation with role-aware menus, profile dropdowns, resource links, and mobile navigation
- Dedicated public resource pages such as newsletter, blog, privacy policy, and terms of use

## Core Features

- Public landing page focused on sustainability idea discovery
- Browse approved ideas with search, filtering, rankings, comments, and voting
- Member idea lifecycle: create, edit, submit, track review status, and manage paid/free ideas
- Admin moderation workflow for reviewing ideas, categories, newsletters, and users
- Premium idea purchase flow with Stripe success/cancel handling and purchase tracking
- Authentication with email/password, Google sign-in, protected routes, and logout support
- Account center with profile updates, email verification, password change, and password reset by OTP
- Newsletter subscription and unsubscribe flow
- AI endpoints for assistant-style responses and draft generation
- Responsive UI for desktop and mobile

## Tech Stack

- Next.js 16.2.2
- React 19.2.4
- TypeScript 6
- Tailwind CSS 4
- TanStack Query
- TanStack Form
- Axios
- Zod
- Framer Motion
- Recharts
- Sonner
- next-themes
- better-auth
- shadcn/ui + Base UI primitives
- Lucide React
- Lenis

## Project Structure

```text
src/
  app/                  App routes, layouts, public pages, dashboard pages, API proxy routes
  components/           Shared UI, ecosystem-specific features, chat, forms, dashboards
  hooks/                Client hooks such as current-user state
  lib/                  App config, routes, helpers, AI utilities, client auth helpers
  providers/            Query and app-level providers
  services/             API service layers for auth, ideas, AI, payments, admin, newsletter
  types/                Shared TypeScript models
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/arefin008/eco_spark_hub_frontend.git
cd eco_spark_hub_frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Required:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional:

```env
# If omitted, the frontend falls back to /api/v1/auth/google
NEXT_PUBLIC_GOOGLE_AUTH_URL=/api/v1/auth/google

# Supported by app config and auth service when the backend exposes it
NEXT_PUBLIC_FACEBOOK_AUTH_URL=/api/v1/auth/facebook

# Demo login autofill shown on the login page
NEXT_PUBLIC_DEMO_USER_EMAIL=member@ecospark.dev
NEXT_PUBLIC_DEMO_USER_PASSWORD=demo123456
```

### 4. Start development

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

### 5. Production build

```bash
pnpm build
pnpm start
```

## Available Scripts

- `pnpm dev` runs the Next.js development server with webpack
- `pnpm clean` removes the `.next` build cache
- `pnpm dev:reset` clears the cache and restarts development
- `pnpm build` creates the production build
- `pnpm start` starts the production server
- `pnpm lint` runs ESLint

## Main User Flows

### Public users

- Explore featured and approved sustainability ideas
- Ask the embedded AI chat widget for discovery guidance
- Subscribe to newsletter updates
- Read supporting public pages and platform policies

### Members

- Register or sign in with email/password or Google
- Use demo credential autofill on the login page
- Create idea drafts with AI-assisted content suggestions
- Submit ideas for review and track approval status
- Purchase premium idea content and view purchase history
- Manage profile, password, and verification settings

### Admins

- Review submitted ideas and moderate approvals/rejections
- Monitor platform health from analytics-heavy dashboard views
- Manage users, categories, and newsletter data
- Use AI insight panels to surface moderation and growth signals

## Backend Integration

The frontend communicates with the backend for:

- authentication and session refresh
- idea CRUD and review actions
- comments and votes
- category management
- newsletter subscriptions
- purchases and Stripe checkout/status flows
- admin statistics and user controls
- AI assistant and AI draft endpoints

## Notes

- The frontend uses client-relative API auth routes by default, with environment-based fallbacks for deployed backends.
- Demo login values are configurable through environment variables.
- Facebook auth is supported in config/service code, but the current auth card UI exposes Google sign-in.


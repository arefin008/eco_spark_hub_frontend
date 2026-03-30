# EcoSpark Hub Frontend

EcoSpark Hub Frontend is a modern sustainability community platform built with Next.js. It allows members to publish environmental ideas, explore community-driven proposals, purchase access to premium idea content, and participate in a moderated ecosystem where admins review submissions and manage platform activity.

## Live URLs

- Frontend: https://ecospark-hub-frontend.vercel.app/
- Backend API: https://ecosparkhubbackend.vercel.app/

## Features

- Public landing page with featured sustainability ideas and newsletter signup
- Email/password authentication with profile and password management flows
- Google authentication entry point
- Browse, search, and filter approved ideas
- Detailed idea pages with voting and community discussion support
- Paid idea access flow with Stripe payment return handling
- Member dashboard for creating, updating, submitting, and tracking ideas
- Admin dashboard for reviewing ideas, managing users, categories, and newsletters
- Responsive interface optimized for desktop and mobile usage

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Node.js
- Tailwind CSS 4
- shadcn/ui styling setup
- Base UI
- TanStack Query
- TanStack React Form
- Axios
- Zod
- Framer Motion
- Recharts
- Sonner
- next-themes
- Lucide React
- date-fns

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/arefin008/eco_spark_hub_frontend.git
cd eco_spark_hub_frontend
```

### 2. Install dependencies

```bash
pnpm install
```

If you do not use `pnpm`, install it first or adapt the commands for your package manager.

### 3. Configure environment variables

Create a `.env` file in the project root and use the following values as a reference:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:5000/api/v1/auth/google
```

### 4. Start the development server

```bash
pnpm dev
```

The application will run at `http://localhost:3000`.

### 5. Build for production

```bash
pnpm build
pnpm start
```

## Available Scripts

- `pnpm dev` starts the development server
- `pnpm dev:reset` clears the Next.js build cache and restarts development
- `pnpm build` creates the production build
- `pnpm start` runs the production server
- `pnpm lint` runs ESLint

## Project Description

This frontend powers the client-facing experience for EcoSpark Hub, a platform focused on collecting, validating, and promoting sustainability ideas. It is designed for two primary user roles:

- Members who create ideas, purchase premium content, and engage with the community
- Admins who moderate content, review submissions, and oversee platform operations

The application communicates with a backend API for authentication, idea management, payments, newsletters, user administration, and category management.

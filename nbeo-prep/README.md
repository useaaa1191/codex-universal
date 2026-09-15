# OptiPrep — NBEO Board Prep (Parts 1, 2 & 3)

A modern, high-performance NBEO board-prep platform and a next-gen alternative to legacy question banks. Built full-stack on Next.js 14 (App Router + React Server Components) and designed to deploy to Vercel with Postgres on Neon.

- **3,000+ questions** categorized by part / subject / topic / difficulty
- **Randomized & tutored modes**, timed **block simulators** that mirror real exam pacing, flag-and-review, and detailed explanations with references
- **Adaptive learning**: SM-2 spaced repetition for missed items, weak-topic detection, and a daily personalized quiz
- **Part 3 clinical-skills module**: video demos, step-by-step procedural checklists, and self-assessment rubrics
- **Content library**: study guides, high-yield sheets, mnemonics, and optics/pharmacology formula references
- **AI tutor**: streaming chat grounded in the question bank + prompt-driven quiz generation (degrades gracefully with no API key)
- **Analytics**: score trends, percentile estimate, subject-mastery radar, time-by-difficulty, and predicted scaled score
- **PWA**: installable, offline app-shell caching, dark mode, framer-motion micro-interactions, skeleton loaders
- **Payments**: Stripe subscriptions (monthly, part bundle, full 3-part bundle) with a free tier (degrades gracefully with no keys)
- **Admin CMS**: role-based question/video management and cohort analytics
- **Type-safe end to end** with Zod validation and accessible UI (shadcn/ui + Radix)

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS + shadcn/ui · Prisma + PostgreSQL · NextAuth (credentials) · Vercel AI SDK · Stripe · Recharts · framer-motion · Zod

## Quick start (local)

Requirements: Node 18+ and a PostgreSQL database.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   - set DATABASE_URL to your Postgres instance
#   - set NEXTAUTH_SECRET (openssl rand -base64 32)

# 3. Create the schema and seed content (3,000+ questions, demo users, media)
npm run db:push
npm run db:seed

# 4. Run
npm run dev      # http://localhost:3000
```

### Demo accounts

Seeded on `npm run db:seed`:

- **Student** — `demo@optiprep.app` / `demo1234` (pre-populated with practice history so the dashboard and analytics are alive on first load)
- **Admin** — `admin@optiprep.app` / `admin1234` (access to the Admin CMS at `/admin`)

The login page also has a one-click "Continue with demo account" button.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start the production server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:seed` | Seed questions, media, and demo users |
| `npm run db:reset` | Force-reset the schema and re-seed |

## Environment variables

All optional integrations degrade gracefully — the app is fully explorable with only `DATABASE_URL` and `NEXTAUTH_SECRET` set.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon in prod) |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Prod | Canonical site URL for NextAuth |
| `OPENAI_API_KEY` | No | Enables live streaming AI tutor; falls back to bank-grounded answers |
| `OPENAI_MODEL` | No | Defaults to `gpt-4o-mini` |
| `STRIPE_SECRET_KEY` | No | Enables real checkout; otherwise a demo activation flow is used |
| `STRIPE_WEBHOOK_SECRET` | No | Verifies Stripe webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Client publishable key |
| `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_PART_BUNDLE` / `STRIPE_PRICE_FULL_BUNDLE` | No | Stripe Price IDs per tier |
| `NEXT_PUBLIC_SITE_URL` | No | Used for SEO canonical + PWA |

## Deploy to Vercel (with Neon)

1. Create a **Neon** Postgres database and copy its pooled connection string.
2. Import the repo into **Vercel**. Set the project root to `nbeo-prep` (this app lives in a subdirectory).
3. Add the environment variables above in Vercel (at minimum `DATABASE_URL` and `NEXTAUTH_SECRET`; set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your deployment URL).
4. The build runs `prisma generate && next build`. After the first deploy, push the schema and seed once from your machine against the production database:
   ```bash
   DATABASE_URL="<neon-url>" npm run db:push
   DATABASE_URL="<neon-url>" npm run db:seed
   ```
5. (Optional) For Stripe, add a webhook endpoint pointing at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.

### Performance & delivery notes

- **RSC-first**: pages are server components; client bundles are scoped to interactive islands (quiz runner, charts, tutor).
- **ISR / static**: public marketing and blog pages are statically generated (`generateStaticParams`) for edge caching and SEO.
- **Edge middleware** guards authenticated and admin routes.
- **PWA**: `manifest.webmanifest` + a service worker cache the app shell for offline access; icons live in `public/icons`.

## Project layout

```
nbeo-prep/
├─ prisma/
│  ├─ schema.prisma          # full data model
│  ├─ seed.ts                # orchestrates seeding
│  ├─ question-bank.ts       # parametric generators (computed, correct answers)
│  ├─ concept-facts.ts       # hand-authored questions + free samples
│  └─ media-content.ts       # videos, checklists, resources, blog posts
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/        # landing, pricing, faq, blog (SEO)
│  │  ├─ (auth)/             # login, register
│  │  ├─ (app)/              # dashboard, practice, session, daily, srs,
│  │  │                       parts, part3, analytics, tutor, library,
│  │  │                       videos, study, billing, settings, admin
│  │  └─ api/                # auth, register, tutor, stripe
│  ├─ components/            # ui (shadcn), practice, analytics, admin, ...
│  └─ lib/                   # auth, prisma, srs, analytics, entitlements, ...
└─ public/                   # service worker + PWA icons
```

## Accessibility

Built on Radix primitives (keyboard + screen-reader friendly), semantic landmarks, labelled controls, visible focus states, and color tokens with dark-mode contrast targeting WCAG 2.1 AA.

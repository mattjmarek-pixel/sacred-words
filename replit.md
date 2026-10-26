# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Sacred Words (mobile app)
- **Kind**: Expo / React Native mobile app
- **Dir**: `artifacts/sacred-words`
- **Preview**: Expo Go or web at `$REPLIT_EXPO_DEV_DOMAIN`
- **Workflow**: `artifacts/sacred-words: expo`

**Features:**
- **Build tab** — 4-step prayer builder: choose tradition, intentions (up to 3), tone, personal context → calls Claude via `/api/prayers/generate`
  - 13 traditions with free/premium tiers: free — Universal, Christian, Catholic, Jewish, Islamic, Secular; premium — Buddhist, Hindu, Sikh, Orthodox Christian, Bahá'í, Taoist, Indigenous & Land-Based Traditions. Premium chips show a 🔒 lock and open the paywall instead of selecting; tapping "Generate" for a locked tradition is also blocked client-side before the request is sent.
- **Library tab** — locally saved prayers using AsyncStorage; searchable; tap to open detail screen with share/copy/delete
- **Browse tab** — community prayers fetched from `/api/prayers/browse` (PostgreSQL); filterable by tradition; tap to read, save, or share

**UI:** Playfair Display (headings, prayer text) + Lato (UI), warm parchment/gold/sage palette, animated chip selectors, slide-up prayer modal

### API Server
- **Kind**: Express API
- **Dir**: `artifacts/api-server`
- **Workflow**: `artifacts/api-server: API Server`
- **Routes:**
  - `GET  /api/healthz` — health check
  - `POST /api/prayers/generate` — AI prayer generation via Anthropic claude-sonnet-4-6. Requires Replit OIDC auth (401 if unauthenticated). Enforces server-side free-tier limit (`FREE_LIMIT = 3`/month); returns `403` with `{ error: "free_limit_reached", count, limit }` when exceeded. Also gates premium-tier traditions (`PREMIUM_TRADITIONS` set in `prayers.ts`) server-side via `checkPremiumServerSide`; returns `403` with `{ error: "premium_tradition_locked", tradition }` if a non-premium user requests one. System prompt (`TRADITION_VOICES`) has a dedicated authenticity guide per tradition, including all 7 premium traditions.
  - `GET  /api/prayers/usage` — current usage status for the authenticated user. Returns `{ generationsThisMonth, limit, month, isPremium }`.
  - `POST /api/prayers/submit` — submit a prayer to the community collection. Requires auth (401 if unauthenticated); validates `title`/`tradition`/`intention`/`text`.
  - `GET  /api/prayers/browse` — community prayers (filterable by `?tradition=`)
  - `POST /api/prayers/browse` — legacy community-submission route, kept for back-compat; prefer `/api/prayers/submit`

### OpenAPI / Codegen
- **Spec**: `lib/api-spec/openapi.yaml`
- **Generated client**: `lib/api-client-react/src/generated/`
- **Generated hooks**: `useGeneratePrayer` (mutation), `useGetBrowsePrayers` (query), `useGetPrayerUsage` (query), `useSubmitPrayer` (mutation)
- **Regenerate**: `pnpm --filter @workspace/api-spec run codegen`

## Database

- **Schema**: `lib/db/src/schema/`
  - `communityPrayersTable` — id, title, tradition, intention, text, isUserSubmitted, createdAt
  - `prayerUsageTable` — server-side per-user, per-month generation counts; backs the free-tier limit (no separate `usersTable` — identity comes from Replit OIDC `req.user.id`)
- **Push**: `pnpm --filter @workspace/db run push`
- Seeded with 12 multi-faith community prayers on first API server start

## Subscriptions

- **Provider**: RevenueCat (not yet connected — run seed script once account is created)
- **Entitlement**: `premium`
- **Free tier**: 3 AI prayer generations per month, enforced server-side via `prayerUsageTable` (not just tracked client-side)
- **Premium**: Unlimited generations + community submission
- **Seed script**: `pnpm --filter @workspace/scripts exec tsx src/seedRevenueCat.ts`
- **Env vars needed** (after seeding): `EXPO_PUBLIC_REVENUECAT_TEST_API_KEY`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`, `REVENUECAT_PROJECT_ID`

## Key Files

| File | Purpose |
|------|---------|
| `artifacts/sacred-words/app/(tabs)/index.tsx` | Build tab — prayer generation UI + free-tier gate |
| `artifacts/sacred-words/app/(tabs)/library.tsx` | Library tab — saved prayers |
| `artifacts/sacred-words/app/(tabs)/browse.tsx` | Browse tab — community prayers |
| `artifacts/sacred-words/app/prayer/[id].tsx` | Prayer detail screen |
| `artifacts/sacred-words/hooks/useDatabase.ts` | AsyncStorage CRUD |
| `artifacts/sacred-words/constants/colors.ts` | Sacred Words design tokens |
| `artifacts/sacred-words/lib/auth.tsx` | AuthProvider + useAuth (Replit OIDC) |
| `artifacts/sacred-words/lib/revenuecat.tsx` | SubscriptionProvider + useSubscription (RevenueCat) |
| `artifacts/sacred-words/components/PaywallScreen.tsx` | Paywall modal |
| `artifacts/api-server/src/routes/prayers.ts` | generate + browse backend routes |
| `scripts/src/seedRevenueCat.ts` | RevenueCat seed script (run once after account created) |
| `lib/api-spec/openapi.yaml` | OpenAPI contract |

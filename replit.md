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
- **Library tab** — locally saved prayers using AsyncStorage; searchable; tap to open detail screen with share/copy/delete
- **Browse tab** — community prayers fetched from `/api/prayers/browse` (PostgreSQL); filterable by tradition; tap to read, save, or share

**UI:** Playfair Display (headings, prayer text) + Lato (UI), warm parchment/gold/sage palette, animated chip selectors, slide-up prayer modal

### API Server
- **Kind**: Express API
- **Dir**: `artifacts/api-server`
- **Workflow**: `artifacts/api-server: API Server`
- **Routes:**
  - `GET  /api/healthz` — health check
  - `POST /api/prayers/generate` — AI prayer generation via Anthropic claude-sonnet-4-6
  - `GET  /api/prayers/browse` — community prayers (filterable by `?tradition=`)

### OpenAPI / Codegen
- **Spec**: `lib/api-spec/openapi.yaml`
- **Generated client**: `lib/api-client-react/src/generated/`
- **Generated hooks**: `useGeneratePrayer` (mutation), `useGetBrowsePrayers` (query)
- **Regenerate**: `pnpm --filter @workspace/api-spec run codegen`

## Database

- **Schema**: `lib/db/src/schema/`
  - `communityPrayersTable` — id, title, tradition, intention, text, createdAt
- **Push**: `pnpm --filter @workspace/db run push`
- Seeded with 12 multi-faith community prayers on first API server start

## Key Files

| File | Purpose |
|------|---------|
| `artifacts/sacred-words/app/(tabs)/index.tsx` | Build tab — prayer generation UI |
| `artifacts/sacred-words/app/(tabs)/library.tsx` | Library tab — saved prayers |
| `artifacts/sacred-words/app/(tabs)/browse.tsx` | Browse tab — community prayers |
| `artifacts/sacred-words/app/prayer/[id].tsx` | Prayer detail screen |
| `artifacts/sacred-words/hooks/useDatabase.ts` | AsyncStorage CRUD |
| `artifacts/sacred-words/constants/colors.ts` | Sacred Words design tokens |
| `artifacts/api-server/src/routes/prayers.ts` | generate + browse backend routes |
| `lib/api-spec/openapi.yaml` | OpenAPI contract |

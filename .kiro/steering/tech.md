# Tech Stack

## Runtime & Framework
- **Next.js 16** (App Router, RSC-first)
- **React 19**
- **TypeScript** (strict mode, no `any`)

## Styling & UI
- **Tailwind CSS v4**
- **shadcn/ui** (base-vega style, CSS variables, neutral base color)
- **Base UI** (`@base-ui/react`) for headless primitives
- **lucide-react** for icons
- **clsx** + **tailwind-merge** (`cn()` from `@/lib/utils`) for conditional classes

## Database & ORM
- **Neon PostgreSQL** (serverless)
- **Prisma ORM** with `@prisma/adapter-pg` adapter via `pg` connection pool
- UUID primary keys, UTC timestamps, soft deletes (`deletedAt`)

## Authentication
- **Better Auth** with Prisma adapter
- Supports email/password and Google OAuth
- Sessions: 7-day expiry, 1-day update age, 5-min cookie cache

## Validation
- **Zod v4** for all input validation
- Schemas live in `lib/validations/` and are used by both services and server actions

## Storage
- **Cloudflare R2** via `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- Only URLs stored in DB; binary files go to R2

## Email & Notifications
- **Resend** for transactional email
- **Novu** (`@novu/node`) for in-app and broadcast notifications

## Error Monitoring
- **Sentry** (`@sentry/nextjs`) — configured via `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

## Environment Variables
- Validated at startup via **`@t3-oss/env-nextjs`** + Zod in `lib/env.ts`
- Always import from `@/lib/env` — never use `process.env` directly

## Package Manager
- **pnpm** (see `pnpm-workspace.yaml` and `pnpm-lock.yaml`)

---

## Common Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Prisma — generate client after schema changes
pnpm prisma generate

# Prisma — create and apply a migration
pnpm prisma migrate dev --name <migration-name>

# Prisma — push schema without migration (prototyping only)
pnpm prisma db push

# Prisma — open Prisma Studio
pnpm prisma studio

# Seed the database
pnpm prisma db seed

# Run a script with tsx
pnpm tsx <script.ts>
```

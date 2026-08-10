# 01_PROJECT_SETUP.md

# Project Setup & Engineering Standards

> This document defines the foundational standards for developing **Vistara Connect**. Every contributor should complete this phase before implementing features.

---

# Objective

Establish a scalable, secure, and maintainable engineering foundation.

---

# Development Philosophy

1. Database First
2. Authentication Before Features
3. Authorization Before UI
4. Service-Oriented Business Logic
5. Reusable Components
6. Type Safety Everywhere
7. Security by Default
8. Documentation-Driven Development

---

# Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Prisma ORM
- Neon PostgreSQL
- Better Auth
- Cloudflare R2
- Resend
- Novu
- Sentry
- Vercel

---

# Required Software

- Node.js LTS
- pnpm
- Git
- VS Code
- Docker (optional)
- PostgreSQL client (optional)

---

# Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Error Lens
- GitLens
- Path IntelliSense

---

# Initial Folder Structure

```text
app/
components/
features/
actions/
services/
lib/
hooks/
providers/
schemas/
prisma/
emails/
constants/
types/
public/
middleware.ts
```

---

# Package Installation Order

1. Tailwind & shadcn/ui
2. Prisma
3. Better Auth
4. Validation (Zod)
5. UI Utilities
6. Email & Notifications
7. Monitoring
8. Testing Libraries

Install dependencies in stages and verify the project builds after each stage.

---

# Coding Standards

## Naming

- Components: PascalCase
- Hooks: useSomething
- Services: SomethingService
- Types: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (except React components)

## General Rules

- Use TypeScript everywhere.
- Avoid `any`.
- Keep business logic out of components.
- Prefer Server Components unless client-side interactivity is required.
- Validate all external input.

---

# Git Workflow

Branch naming:

```text
feature/member-management
feature/event-module
fix/auth-session
refactor/database
```

Commit examples:

```text
feat: configure prisma
feat: implement authentication
feat: create member service
fix: resolve session issue
refactor: simplify event workflow
```

---

# Environment Variables

Maintain a `.env.example` containing all required variables.

Typical variables:

```text
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET=
RESEND_API_KEY=
NOVU_API_KEY=
SENTRY_AUTH_TOKEN=
```

Never commit secrets.

---

# Folder Responsibilities

- app/ → Routing
- components/ → Shared UI
- features/ → Feature modules
- services/ → Business logic
- actions/ → Server Actions
- lib/ → Utilities
- hooks/ → Custom hooks
- schemas/ → Validation
- prisma/ → Database schema
- providers/ → Global providers
- emails/ → Email templates

---

# Quality Checklist

Before starting feature development:

- Project builds successfully
- ESLint passes
- Type checking passes
- Folder structure created
- Environment variables documented
- Git repository initialized
- README completed

---

# Definition of Done

A task is complete only if:

- Code is typed
- Validation exists
- Authorization is implemented (if required)
- No lint errors
- Production build succeeds
- Documentation updated

---

# Deliverables

At the end of Phase 01:

- Project initialized
- Engineering standards established
- Folder architecture finalized
- Dependencies planned
- Development workflow documented

---

# Next Phase

Proceed to **02_DATABASE_DESIGN.md**.

No feature development should begin until the complete database schema and relationships have been designed.

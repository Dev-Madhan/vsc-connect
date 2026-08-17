# Vistara Connect — Product Overview

Vistara Connect (VSC Connect) is a club management platform for a university or organization-level club. It serves two audiences:

- **Public visitors** — can browse events, news, projects, gallery, and recruitment info
- **Authenticated members & admins** — access a private dashboard to manage members, events, gallery, OD documents, and club settings

## Core Capabilities

- Member registration and management (with membership ID generation, e.g. `VSC-2026-0001`)
- Event creation, lifecycle management, and participant tracking
- Gallery and media management (images stored in Cloudflare R2)
- OD (On-Duty) document generation as PDFs
- Membership card generation
- Sub-club management (each sub-club has a secretary/moderator)
- News, blogs, projects, and sponsor content
- Role-based access with four tiers: `USER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`
- Audit logging for sensitive actions
- Email notifications via Resend; in-app/broadcast notifications via Novu
- Error monitoring via Sentry

## User Roles

| Role | Description |
|---|---|
| `SUPER_ADMIN` | Full system access |
| `ADMIN` | President/VP — manages events, members, content |
| `MODERATOR` | Sub-club secretary — manages their own sub-club only |
| `USER` | Regular member |

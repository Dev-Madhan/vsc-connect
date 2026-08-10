# 02_SYSTEM_ARCHITECTURE.md

# System Architecture

## Purpose
This document defines the high-level architecture of Vistara Connect. It establishes how every layer of the application interacts and serves as the blueprint before implementation.

## Architectural Principles
- Modular Monolith
- Database-First
- Server-First Rendering
- Role-Based Access Control
- Separation of Concerns
- Feature-Oriented Modules
- Type Safety
- Scalability

## High-Level Architecture

```text
Users
   │
Cloudflare CDN
   │
Next.js 16 Application
 ├── Public Website
 ├── Dashboard
 ├── API Route Handlers
 └── Server Actions
   │
Better Auth
   │
RBAC Middleware
   │
Service Layer
   │
Prisma ORM
   │
Neon PostgreSQL
   │
Cloudflare R2
```

## Application Layers

### Presentation Layer
- Public website
- Admin dashboard
- Shared UI components

### Authentication Layer
- Better Auth
- Session management
- Protected routes

### Authorization Layer
- RBAC
- Permission guards
- Role middleware

### Business Layer
- Member Service
- Event Service
- Gallery Service
- Notification Service
- Document Service
- Audit Service

### Data Layer
- Prisma ORM
- Neon PostgreSQL
- Transactions
- Migrations

### Storage Layer
- Cloudflare R2
- Images
- PDFs
- Documents

## Feature Modules
- Authentication
- Members
- Events
- Participants
- Gallery
- News
- Projects
- Sponsors
- Recruitment
- Notifications
- Membership Cards
- OD Documents
- Analytics
- Settings

## Request Flow

```text
Client
 ↓
Middleware
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Service
 ↓
Prisma
 ↓
Database
 ↓
Response
```

## Folder Architecture

```text
app/
components/
features/
services/
actions/
lib/
hooks/
schemas/
prisma/
providers/
emails/
types/
constants/
```

## Security
- Server-side validation
- RBAC on every protected endpoint
- Environment secrets
- Secure cookies
- Rate limiting
- Audit logging

## Scalability
- Multi-club ready
- Independent services
- CDN-backed media
- Background jobs
- Redis-ready caching
- Horizontal scaling

## Design Rules
1. No business logic in UI.
2. Services own business rules.
3. Components remain reusable.
4. Database accessed only through Prisma.
5. Validate all inputs.
6. Log critical actions.
7. Prefer Server Components.

## Phase Deliverables
- Architecture finalized
- Module boundaries defined
- Layer responsibilities documented
- Ready for database design

## Next Phase
Proceed to **03_DATABASE_DESIGN.md**. No feature implementation should begin until the database schema and relationships are finalized.

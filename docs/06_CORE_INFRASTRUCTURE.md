# 06_CORE_INFRASTRUCTURE.md

# Core Infrastructure

> This phase establishes the shared infrastructure used by every module in Vistara Connect. No business feature should bypass these services.

---

# Objectives

- Centralize infrastructure
- Ensure scalability
- Standardize integrations
- Improve observability
- Simplify maintenance

---

# Infrastructure Stack

| Layer | Technology |
|---|---|
| Hosting | Vercel |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| Object Storage | Cloudflare R2 |
| CDN | Cloudflare |
| Email | Resend |
| Notifications | Novu |
| Monitoring | Sentry |
| Background Jobs (Future) | Trigger.dev |
| Cache (Future) | Upstash Redis |

---

# Infrastructure Architecture

```text
Client
  ↓
Cloudflare CDN
  ↓
Next.js Application
  ↓
Middleware
  ↓
Services
 ├── Prisma → Neon PostgreSQL
 ├── Better Auth
 ├── Cloudflare R2
 ├── Resend
 ├── Novu
 └── Sentry
```

---

# Shared Services

## Database Service
- Prisma Client singleton
- Transactions
- Migrations
- Connection management

## Storage Service
- Upload
- Download
- Delete
- Signed URLs
- File validation

## Email Service
- Transactional emails
- Password reset
- Welcome emails
- Event notifications

## Notification Service
- In-app notifications
- Email notifications
- Broadcast announcements

## Logging Service
- Structured logging
- Error logging
- Request logging

## Monitoring Service
- Error tracking
- Performance monitoring
- Release tracking

---

# Environment Variables

```text
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
RESEND_API_KEY=
NOVU_API_KEY=
SENTRY_DSN=
```

---

# Folder Structure

```text
lib/
services/
providers/
emails/
prisma/
```

---

# Engineering Rules

- Never access external services directly from UI.
- Wrap every integration in a service.
- Keep secrets in environment variables.
- Reuse shared infrastructure.
- Log all critical failures.

---

# Error Handling

- Standard API responses
- Global error handler
- User-friendly messages
- Retry transient failures
- Capture exceptions in Sentry

---

# File Storage Strategy

Cloudflare R2 stores:
- Profile images
- Gallery images
- Membership cards
- OD PDFs
- Documents

Database stores only file metadata and URLs.

---

# Deliverables

- Infrastructure configured
- External services connected
- Shared service layer created
- Logging enabled
- Monitoring enabled

---

# Definition of Done

- Database connection verified
- Authentication working
- Storage uploads tested
- Email delivery tested
- Notifications operational
- Error tracking active

---

# Next Phase

Proceed to **07_SERVICE_LAYER.md** to build reusable business services on top of this infrastructure.

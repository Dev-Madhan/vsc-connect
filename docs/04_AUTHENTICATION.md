# 04_AUTHENTICATION.md

# Authentication & Authorization Foundation

> This phase establishes the identity, session management, and access control foundation for Vistara Connect.

## Objectives
- Secure authentication
- Session management
- Role-Based Access Control (RBAC)
- Protected routes and APIs
- Audit-ready identity management

## Technology Stack

| Component | Technology |
|-----------|------------|
| Authentication | Better Auth |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Session Storage | Database |
| Hosting | Vercel |

## Authentication Flow

```text
User
 ↓
Login Request
 ↓
Better Auth
 ↓
Credential Validation
 ↓
Create Session
 ↓
Secure Cookie
 ↓
Dashboard
```

## Features
- Email & Password Login
- Logout
- Remember Me
- Password Reset
- Email Verification
- Session Management

## Roles
- Super Admin
- President
- Vice President
- Sub-Club Secretary
- Media Secretary
- Public Visitor

## RBAC Flow

```text
Request
 ↓
Authentication
 ↓
Session Validation
 ↓
Role Validation
 ↓
Permission Check
 ↓
Business Logic
```

## Route Protection

Public:
- Home
- Events
- Gallery
- Projects
- News
- Contact

Protected:
- Dashboard
- Members
- Events
- Gallery Management
- Sponsors
- Settings

## Session Security
- HTTP-only cookies
- Secure cookies
- SameSite protection
- Session expiry
- Logout revocation

## Middleware Responsibilities
- Validate session
- Attach authenticated user
- Verify role
- Redirect unauthorized users
- Log failures

## Security Checklist
- CSRF protection
- Rate limiting
- Input validation
- HTTPS
- Audit logging

## Deliverables
- Better Auth configured
- Prisma adapter connected
- Protected routes implemented
- RBAC middleware completed

## Definition of Done
- Secure login works
- Protected routes secured
- Roles enforced
- Sessions validated

## Next Phase
Proceed to **05_AUTHORIZATION.md**.

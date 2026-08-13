# 05_AUTHORIZATION.md

# Role-Based Authorization (RBAC)

> This document defines the authorization model for Vistara Connect. Authorization determines **what an authenticated user is allowed to do** after successfully signing in.

---

# Objective

- Enforce least-privilege access
- Protect every route and API
- Centralize permission checks
- Prevent unauthorized actions
- Maintain an auditable security model

---

# Authorization Architecture

```text
Request
   ↓
Authentication
   ↓
Session Validation
   ↓
Role Resolution
   ↓
Permission Evaluation
   ↓
Business Rules
   ↓
Database
```

---

# Roles

| Role | Description |
|------|-------------|
| Super Admin | Full platform control |
| President | Club administration |
| Vice President | Shared administration |
| Sub-Club Secretary | Manage assigned sub-club |
| Media Secretary | Secretary + Gallery management |
| Public Visitor | Public website access only |

---

# Permission Matrix

## Super Admin
- Full CRUD on every module
- Manage users & roles
- System settings
- View audit logs

## President
- Manage members
- Create & publish events
- Generate membership cards
- Generate OD documents
- Manage website content

## Vice President
- Assist President
- Manage events
- Manage news, blogs & sponsors
- Generate OD documents

## Sub-Club Secretary
- Manage members in assigned sub-club
- Select event participants
- Request member removal

## Media Secretary
- All Secretary permissions
- Upload galleries
- Manage media assets

## Public Visitor
- Read-only access to public pages

---

# Route Guards

Public Routes
- /
- /events
- /gallery
- /projects
- /news
- /contact

Protected Routes
- /dashboard/**
- /members/**
- /events/manage/**
- /settings/**

---

# API Authorization Rules

Every protected endpoint must:

1. Validate session
2. Resolve authenticated user
3. Resolve role
4. Verify permission
5. Execute business logic

Never trust client-side role checks.

---

# Resource-Level Authorization

Users may only access resources they own or are permitted to manage.

Examples:
- Secretaries can edit only members in their assigned sub-club.
- Media Secretary can upload gallery content but cannot modify system settings.
- President cannot modify Super Admin configuration.

---

# Middleware Responsibilities

- Validate session
- Load user & role
- Enforce permissions
- Redirect unauthorized users
- Log denied requests

---

# Audit Logging

Record:
- User ID
- Role
- Action
- Resource
- Timestamp
- IP Address
- Result (Allowed / Denied)

---

# Best Practices

- Default deny access
- Use server-side authorization
- Centralize permission helpers
- Avoid duplicated permission logic
- Keep permissions role-driven
- Log privileged operations

---

# Deliverables

- RBAC implemented
- Route guards completed
- API authorization enforced
- Permission helpers created
- Audit logging enabled

---

# Definition of Done

- Unauthorized users cannot access protected resources
- Every API validates permissions
- Role hierarchy tested
- Permission matrix documented

---

# Next Phase

Proceed to **06_CORE_INFRASTRUCTURE.md** to configure storage, email, logging, notifications, monitoring, and shared infrastructure services.

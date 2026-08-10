# Vistara Connect

> The Official Digital Platform of the Vistara Student Club

## Overview

Vistara Connect is an enterprise-grade full-stack web application that centralizes the operations of the Vistara Student Club into a single digital platform. It combines a modern public-facing website with a secure, role-based administration dashboard to manage members, events, galleries, projects, news, sponsors, recruitment, and official club documents.

The platform replaces spreadsheets, manual documentation, and scattered communication with a scalable, secure, and maintainable system designed for long-term growth.

---

# Vision

Build a reliable digital ecosystem that:

- Simplifies club administration
- Improves collaboration between executives
- Automates repetitive tasks
- Provides a professional public presence
- Scales as the organization grows

---

# Core Objectives

- Public website with SEO-friendly pages
- Secure role-based dashboard
- Centralized member management
- Event planning and participant management
- Gallery and media management
- News & blog publishing
- Project showcase
- Sponsor management
- Recruitment management
- Membership ID & card generation
- On-Duty (OD) form generation
- Notification system
- Analytics and audit logging

---

# User Roles

- Public Visitor
- Super Admin
- President
- Vice President
- Sub-Club Secretary
- Media Secretary

Each role has clearly defined permissions enforced through Role-Based Access Control (RBAC).

---

# Recommended Technology Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Authentication | Better Auth |
| Storage | Cloudflare R2 |
| CDN | Cloudflare |
| Email | Resend |
| Notifications | Novu |
| Hosting | Vercel |
| Monitoring | Sentry |

---

# System Architecture

```
Users
   │
Cloudflare CDN
   │
Next.js Application
   │
Better Auth
   │
Route Handlers / Server Actions
   │
Prisma ORM
   │
Neon PostgreSQL
   │
Cloudflare R2 (Media Storage)
```

---

# Development Philosophy

The project follows a **Database-First** approach.

```
Project Setup
      ↓
Database Design
      ↓
Authentication
      ↓
Authorization (RBAC)
      ↓
Core Services
      ↓
Business Modules
      ↓
Dashboard
      ↓
Public Website
      ↓
Testing
      ↓
Deployment
```

---

# Major Modules

- Authentication & Authorization
- Member Management
- Event Management
- Participant Workflow
- Gallery Management
- News & Blog CMS
- Project Management
- Sponsor Management
- Recruitment
- Notifications
- Membership Cards
- OD Document Generator
- Analytics
- Audit Logs
- System Settings

---

# Folder Structure

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

# Scalability Goals

- Modular architecture
- Service-based business logic
- Multi-club ready architecture
- S3-compatible object storage
- Horizontal scalability
- Production-ready deployment
- Easy maintenance and future feature expansion

---

# Development Roadmap

1. Foundation & Project Setup
2. Database Design
3. Authentication
4. Authorization (RBAC)
5. Core Infrastructure
6. Service Layer
7. Feature Modules
8. Dashboard
9. Public Website
10. Automation & Documents
11. Testing
12. Deployment
13. Future Enhancements

---

# License

This project is developed as the official digital platform for the Vistara Student Club and is intended to provide a scalable foundation for future growth and digital transformation.

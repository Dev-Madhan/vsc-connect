# 03_DATABASE_DESIGN.md

# Database Design

> This document defines the data architecture for **Vistara Connect**. The database is the foundation of the application and must be finalized before authentication, APIs, or UI development.

---

# Goals

- Normalize data
- Maintain referential integrity
- Support future scalability
- Keep business logic independent from storage
- Design for multi-club support

---

# Database Technology

- PostgreSQL (Neon)
- Prisma ORM
- UUID primary keys
- UTC timestamps
- Soft deletes where applicable

---

# Core Design Principles

- Database First
- UUID for all primary keys
- Foreign keys for relationships
- Use enums for statuses
- Add indexes to frequently queried fields
- Never store uploaded files in the database
- Store media URLs only

---

# Core Entities

## Authentication
- User
- Session
- Account
- VerificationToken
- Role

## Club
- Club
- SubClub
- Member

## Events
- Event
- EventParticipant

## Content
- Gallery
- GalleryImage
- News
- Blog
- Project
- Sponsor

## Documents
- MembershipCard
- ODDocument

## System
- Notification
- AuditLog
- Setting

---

# High-Level Relationships

```text
Club
 ├── SubClub
 │     └── Members
 ├── Events
 │     └── Participants
 ├── Gallery
 ├── Projects
 ├── Sponsors
 └── News

Role
 └── Users

User
 └── Member
```

---

# Suggested Prisma Models

```text
User
Role
Club
SubClub
Member
Event
EventParticipant
Gallery
GalleryImage
News
Blog
Project
Sponsor
Notification
MembershipCard
ODDocument
AuditLog
Setting
```

---

# Common Fields

Every major table should include:

```text
id (UUID)
createdAt
updatedAt
deletedAt (nullable)
createdBy
updatedBy
```

---

# Important Indexes

- email
- registerNumber
- membershipId
- slug
- eventDate
- subClubId
- roleId

---

# Enums

```text
Role
EventStatus
Gender
Year
NotificationType
DocumentType
MemberStatus
```

---

# File Storage Strategy

Database stores:

- imageUrl
- pdfUrl
- thumbnailUrl

Actual files are stored in **Cloudflare R2**.

---

# Transactions

Use database transactions for:

- Member creation
- Event creation
- Participant selection
- Membership card generation
- OD document generation

---

# Seed Data

Initial seed should create:

- Default Club
- Roles
- Super Admin
- Sub Clubs
- Settings

---

# Migration Strategy

1. Update schema.prisma
2. Generate migration
3. Review SQL
4. Apply migration
5. Regenerate Prisma Client

---

# Future Scalability

- Multi-club support
- Additional roles
- Archive strategy
- Background jobs
- Analytics warehouse

---

# Definition of Done

- All entities finalized
- Relationships validated
- Indexes added
- Enums defined
- Seed strategy completed
- Migration plan documented

---

# Next Phase

Proceed to **04_AUTHENTICATION.md** after the database schema and ER diagram are fully approved.

# 07_SERVICE_LAYER.md

# Service Layer

The Service Layer is the heart of the application. All business logic must live here. Pages, components, Server Actions, and API routes should orchestrate requests but never implement business rules.

## Objectives
- Centralize business logic
- Reuse functionality
- Keep UI thin
- Enforce validation and RBAC
- Improve maintainability and testing

## Layer Flow

```text
UI
 ↓
Server Actions / API Routes
 ↓
Validation (Zod)
 ↓
RBAC
 ↓
Service Layer
 ↓
Prisma
 ↓
Neon PostgreSQL
```

## Core Services

### AuthService
- Current user
- Session helpers
- Permission helpers

### MemberService
- Create, update, archive members
- Generate membership IDs
- Search & filtering

### EventService
- Create, publish, update, cancel events
- Manage event lifecycle

### ParticipantService
- Select participants
- Validate eligibility
- Finalize participant lists

### GalleryService
- Upload and manage galleries
- Organize by event

### ContentService
- News
- Blogs
- Projects
- Sponsors
- Contact content

### NotificationService
- In-app notifications
- Email notifications
- Broadcasts

### DocumentService
- Membership cards
- OD documents
- PDF generation

### AuditService
- Track sensitive actions
- Record metadata

### StorageService
- Upload
- Delete
- Signed URLs
- File validation

## Service Rules
- One responsibility per service
- No UI rendering
- No direct browser APIs
- Use transactions where needed
- Return typed results
- Log critical actions

## Validation Flow

```text
Request
 ↓
Validation
 ↓
Authorization
 ↓
Service
 ↓
Database
 ↓
Audit Log
 ↓
Notification
 ↓
Response
```

## Deliverables
- Service architecture completed
- Business logic centralized
- Shared interfaces established
- Transaction support added

## Definition of Done
- UI contains no business logic
- Services are reusable
- Validation precedes execution
- Authorization enforced

## Next Phase
Proceed to **08_FEATURE_MODULES.md**.

# Project Tasks, Issues & Deliverables

**Project Title:** Campus Club Resource Exchange and Intelligent Allocation System  
**Team No:** 15 (SRN: PES2UG24CS191 & PES2UG24CS215)

---

## 1. Schema & DDL Updates Needed from Previous Submission
1. **Migrate DDL from MySQL to PostgreSQL Syntax:**
   - Replace `AUTO_INCREMENT` with `SERIAL` or `GENERATED ALWAYS AS IDENTITY`.
   - Replace inline `ENUM(...)` with PostgreSQL `CREATE TYPE ... AS ENUM (...)` or `CHECK` constraints.
   - Quote or rename the reserved identifier `"user"` / `users` in PostgreSQL.
2. **Add Missing Columns (`ALTER TABLE` Demonstration):**
   - Add `condition` column to `RESOURCE` (referenced by `idx_resource_condition` and required for filtering by resource condition).
   - Add reservation time window columns (`start_time`, `end_time`, `returned_at`) to `REQUEST` and `ALLOCATION` to support scheduling conflict detection and time-based filtering.

---

## 2. Project Tasks / Issues Breakdown (For 2 Team Members)

### Phase 1: Database Design & Implementation (PostgreSQL + MongoDB)
- [ ] **Issue #1: PostgreSQL Schema & DDL Implementation**
  - Create tables: `USER`, `STUDENT`, `CLUB_OFFICER`, `ADMIN`, `CLUB`, `USER_CLUB`, `RESOURCE_CATEGORY`, `RESOURCE`, `REQUEST`, `ALLOCATION`, `NOTIFICATION`.
  - Demonstrate `CREATE`, `ALTER`, `DROP`, Primary/Foreign keys, `CHECK` constraints (`chk_resource_qty`, `chk_request_qty`, `chk_allocation_qty`), and Indexes.
- [ ] **Issue #2: MongoDB Collections & Schema Setup**
  - `resource_specs`: Store flexible category-specific attributes (e.g., camera sensor/lens details, projector lumens/ports, space capacity/AV facilities), usage guidelines, and media links.
  - `maintenance_logs`: Track resource maintenance history, condition updates, inspection checklists, and damage reports.
- [ ] **Issue #3: Advanced Database Features (Minimum 4 Required)**
  - **Transactions:** Atomic request approval, quantity validation, allocation creation, and notification dispatch.
  - **Stored Procedures / Functions:** Conflict detection for overlapping reservation time windows and automatic suggestion of alternative available resources in the same category.
  - **Triggers:** Auto-generate notifications in `NOTIFICATION` on `REQUEST` status change or `ALLOCATION` update; prevent over-allocation.
  - **Views:** Create analytical views (`vw_resource_availability`, `vw_club_utilization`, `vw_underutilized_resources`).
  - **Full-Text Search & Indexing:** Implement full-text search across resource names, descriptions, and specifications.
  - **NoSQL Aggregation:** MongoDB aggregation pipelines for maintenance summaries and condition analytics.

### Phase 2: Backend API Layer (Next.js Route Handlers)
- [ ] **Issue #4: Authentication & Role-Based Access Control (RBAC)**
  - Implement password hashing and session/JWT authentication.
  - Enforce permissions across roles: `Student` (Club Member), `Club Officer` (Coordinator), and `Admin`.
- [ ] **Issue #5: Club & Resource Management APIs**
  - Endpoints for registering clubs, categories, and resources across PostgreSQL and MongoDB.
  - Search and filter API supporting category, availability window, condition, and club filters.
- [ ] **Issue #6: Request, Conflict Detection & Intelligent Allocation APIs**
  - Create/update/cancel inter-club resource requests.
  - Detect scheduling conflicts and query alternative resources when requested items are unavailable.
  - Handle approval workflows, borrowing (`allocated`), and returns (`returned`).
- [ ] **Issue #7: Maintenance Tracking & Notification APIs**
  - Record and fetch maintenance events from MongoDB.
  - Retrieve and mark user notifications as read.
- [ ] **Issue #8: Admin Analytics API**
  - Execute complex SQL queries using `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, aggregate functions, and subqueries for utilization metrics.

### Phase 3: Frontend Web Interface (Next.js)
- [ ] **Issue #9: Auth Pages & Role-Based Navigation**
  - Login/Signup views, role indicators, and notification drawer.
- [ ] **Issue #10: Resource Discovery & Detail Pages**
  - Filterable resource catalog, availability calendar, technical specifications view, and maintenance log history.
- [ ] **Issue #11: Request & Alternative Suggestion Workflow UI**
  - Reservation request form with conflict alerts and one-click alternative resource selection.
- [ ] **Issue #12: Coordinator Portal (Approvals, Returns & Maintenance)**
  - Dashboard for club officers to manage club inventory, approve/reject requests, log returns, and add maintenance entries.
- [ ] **Issue #13: Admin Analytics Dashboard**
  - Visual insights into resource utilization, borrowing patterns, frequently requested items, and underutilized assets.

---

## 3. Deliverables & Evaluation Checklist
- [ ] **Problem Statement, Objectives, Scope & Functional Requirements**
- [ ] **ER Diagram & Relational Schema** (with entities, attributes, PK/FK, relationships, constraints)
- [ ] **NoSQL Data Model Documentation** (MongoDB collections, documents, indexes, retrieval strategy)
- [ ] **Database Justification** (why PostgreSQL is used for relational/transactional workflows and MongoDB for flexible resource specs & maintenance logs)
- [ ] **Data Dictionary / Schema Description**
- [ ] **SQL & NoSQL Implementation Scripts** (DDL, DML, Triggers, Stored Procedures, Views, Aggregations)
- [ ] **Important & Complex Queries** (`JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, aggregates, subqueries)
- [ ] **Working Next.js Web Application** connected via API routes using environment variables (`.env`)
- [ ] **Authentication, RBAC (3 Roles) & Database-Level Validation**
- [ ] **System Architecture Diagram, Screenshots & Test Cases**
- [ ] **GitHub Repository** showing balanced commits from both team members across DB and application code

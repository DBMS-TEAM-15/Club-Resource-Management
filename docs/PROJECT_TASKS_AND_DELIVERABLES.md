# Project Tasks, Issues & Deliverables

**Project Title:** Campus Club Resource Exchange and Intelligent Allocation System  
**Team No:** 15 (SRN: PES2UG24CS191 & PES2UG24CS215)

---

## 1. Schema & DDL Enhancements Needed from Initial Submission
1. **Add Missing Columns (`ALTER TABLE` Demonstration in MySQL):**
   - Add `` `condition` `` column (`ENUM('excellent','good','fair','needs_maintenance')`) to `RESOURCE` (referenced by `idx_resource_condition` in `submission_ddl.sql` and required for filtering by resource condition).
   - Add reservation time window columns (`start_time`, `end_time`, `returned_date`) to `REQUEST` and `ALLOCATION` to support scheduling conflict detection and time-based filtering.

---

## 2. Project Tasks / Issues Breakdown (For 2 Team Members)

### Phase 1: Database Design & Implementation (MySQL + MongoDB)
- [ ] **Order 01 (Issue #2): MySQL Core Schema, DDL Enhancements & Seed Data (`Hemaksh-b`)**
  - Create tables: `USER`, `STUDENT`, `CLUB_OFFICER`, `ADMIN`, `CLUB`, `USER_CLUB`, `RESOURCE_CATEGORY`, `RESOURCE`, `REQUEST`, `ALLOCATION`, `NOTIFICATION`.
  - Demonstrate `CREATE`, `ALTER`, `DROP`, Primary/Foreign keys, `CHECK` constraints (`chk_resource_qty`, `chk_request_qty`, `chk_allocation_qty`), and Indexes.
- [ ] **Order 02 (Issue #3): MongoDB Collections Setup, Schema Validation & Seed Script (`aaryesh246`)**
  - `resource_specs`: Store flexible category-specific attributes (e.g., camera sensor/lens details, projector lumens/ports, space capacity/AV facilities), usage guidelines, and media links.
  - `maintenance_logs`: Track resource maintenance history, condition updates, inspection checklists, and damage reports.
- [ ] **Order 03 (Issue #4): MySQL Advanced Features: Triggers, Views & Full-Text Search (`Hemaksh-b`)**
  - **Triggers:** Auto-generate notifications in `NOTIFICATION` on `REQUEST` status change or `ALLOCATION` update; prevent over-allocation (`SIGNAL SQLSTATE '45000'`).
  - **Views:** Create analytical views (`vw_resource_availability`, `vw_club_utilization_summary`, `vw_underutilized_assets`).
  - **Full-Text Search & Indexing:** Implement MySQL `FULLTEXT` index on `RESOURCE(name, description, location)`.
- [ ] **Order 04 (Issue #5): MySQL Stored Procedures, Conflict Detection & MongoDB Aggregations (`aaryesh246`)**
  - **Stored Procedures:** Conflict detection (`sp_check_scheduling_conflict`) for overlapping reservation time windows and automatic suggestion of alternative available resources (`sp_suggest_alternative_resources`).
  - **NoSQL Aggregation:** MongoDB aggregation pipelines for maintenance summaries and condition analytics.

### Phase 2: Backend API Layer (Next.js Route Handlers)
- [ ] **Order 05 (Issue #6): Authentication, Password Hashing & Role-Based Access Control (RBAC) API (`Hemaksh-b`)**
  - Implement password hashing and session/token authentication.
  - Enforce permissions across roles: `Student` (Club Member), `Club Officer` (Coordinator), and `Admin`.
- [ ] **Order 06 (Issue #7): Clubs, Categories & Hybrid Resource Catalog API (MySQL + MongoDB) (`aaryesh246`)**
  - Endpoints for registering clubs, categories, and resources across MySQL and MongoDB.
  - Search and filter API supporting category, availability window, condition, and club filters.
- [ ] **Order 07 (Issue #8): Inter-Club Resource Requests, Conflict Detection & Alternative Suggestions API (`Hemaksh-b`)**
  - Create/update/cancel inter-club resource requests.
  - Detect scheduling conflicts and query alternative resources when requested items are unavailable.
- [ ] **Order 08 (Issue #9): Transactional Request Approval, Borrowing, Return & Maintenance API (`aaryesh246`)**
  - Handle approval workflows, borrowing (`allocated`), and returns (`returned`) using MySQL ACID transactions (`beginTransaction` / `commit` / `rollback`).
  - Record and fetch maintenance events from MongoDB and user notifications from MySQL.
- [ ] **Order 09 (Issue #10): Admin Analytics & Utilization Insights API (Complex SQL + NoSQL) (`Hemaksh-b`)**
  - Execute complex MySQL queries using `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, aggregate functions, and subqueries for utilization metrics alongside MongoDB aggregations.

### Phase 3: Frontend Web Interface (Next.js)
- [ ] **Order 10 (Issue #11): Frontend Auth UI, Role-Aware Navigation & Resource Catalog Page (`aaryesh246`)**
  - Login/Signup views, role-aware navigation bar, and filterable resource catalog displaying MySQL inventory + MongoDB specs.
- [ ] **Order 11 (Issue #12): Frontend Request Reservation Modal, Conflict Alerts & Coordinator Portal (`Hemaksh-b`)**
  - Reservation request form with conflict alerts, one-click alternative resource selection, and Coordinator portal for approvals/returns.
- [ ] **Order 12 (Issue #13): Frontend Admin Analytics Dashboard & Final Documentation (`aaryesh246`)**
  - Visual insights into resource utilization, borrowing patterns, frequently requested items, underutilized assets, and final documentation.

---

## 3. Deliverables & Evaluation Checklist
- [ ] **Problem Statement, Objectives, Scope & Functional Requirements**
- [ ] **ER Diagram & Relational Schema** (with entities, attributes, PK/FK, relationships, constraints)
- [ ] **NoSQL Data Model Documentation** (MongoDB collections, documents, indexes, retrieval strategy)
- [ ] **Database Justification** (why MySQL is used for relational/transactional workflows and MongoDB for flexible resource specs & maintenance logs)
- [ ] **Data Dictionary / Schema Description**
- [ ] **SQL & NoSQL Implementation Scripts** (DDL, DML, Triggers, Stored Procedures, Views, Aggregations)
- [ ] **Important & Complex Queries** (`JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, aggregates, subqueries)
- [ ] **Working Next.js Web Application** connected via API routes using environment variables (`.env`)
- [ ] **Authentication, RBAC (3 Roles) & Database-Level Validation**
- [ ] **System Architecture Diagram, Screenshots & Test Cases**
- [ ] **GitHub Repository** showing balanced commits from both team members across DB and application code

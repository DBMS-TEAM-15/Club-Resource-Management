# Data Dictionary, Database Justification & Important Queries

## 1. Database Choice & Justification (MySQL + MongoDB)
- **MySQL (Relational SQL):** Manages structured entities (`USER`, `STUDENT`, `CLUB_OFFICER`, `ADMIN`, `CLUB`, `RESOURCE`, `REQUEST`, `ALLOCATION`, `NOTIFICATION`) requiring referential integrity (PK/FK constraints), `CHECK` validation, ACID transactions during concurrent resource allocations, and relational analytics.
- **MongoDB (Document NoSQL):** Manages `resource_specs` (schema-less technical attributes that vary widely between DSLR cameras, projectors, microphones, and auditoriums) and `maintenance_logs` (inspection checklists and repair logs).

## 2. Advanced Database Features Implemented
1. **ACID Transactions:** Atomic request approval + allocation insertion (`src/app/api/allocations/route.ts`).
2. **Triggers:** Stock availability validation (`trg_validate_allocation_stock`) and automatic notification dispatch (`trg_notify_request_status`).
3. **Stored Procedures:** Time-window conflict detection (`sp_check_scheduling_conflict`) and same-category alternative resource recommendations (`sp_suggest_alternative_resources`).
4. **Views:** `vw_resource_availability`, `vw_club_utilization_summary`, and `vw_underutilized_assets`.
5. **Full-Text Search & Indexes:** MySQL `FULLTEXT` index (`idx_resource_fts`) and MongoDB compound/text indexes.
6. **MongoDB Aggregation Pipelines:** Maintenance breakdown by issue type and cost (`src/lib/db/aggregations.ts`).
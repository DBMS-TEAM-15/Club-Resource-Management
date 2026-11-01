-- ============================================================
-- MySQL Analytical Views & FULLTEXT Search Index
-- ============================================================

USE campus_club_resource_exchange;

-- 1. FULLTEXT Search Index on RESOURCE
ALTER TABLE RESOURCE
ADD FULLTEXT INDEX idx_resource_fts (name, description, location);

-- 2. View: Real-time Resource Availability & Active Allocations
CREATE OR REPLACE VIEW vw_resource_availability AS
SELECT
    r.resource_id,
    r.name AS resource_name,
    r.description,
    r.location,
    r.`condition`,
    r.quantity_total,
    c.club_id AS owner_club_id,
    c.club_name AS owner_club_name,
    cat.category_id,
    cat.category_name,
    COALESCE(SUM(CASE WHEN a.status = 'allocated' THEN a.quantity_allocated ELSE 0 END), 0) AS quantity_currently_allocated,
    (r.quantity_total - COALESCE(SUM(CASE WHEN a.status = 'allocated' THEN a.quantity_allocated ELSE 0 END), 0)) AS quantity_currently_available
FROM RESOURCE r
JOIN CLUB c ON c.club_id = r.club_id
JOIN RESOURCE_CATEGORY cat ON cat.category_id = r.category_id
LEFT JOIN REQUEST req ON req.resource_id = r.resource_id
LEFT JOIN ALLOCATION a ON a.request_id = req.request_id AND a.status = 'allocated'
GROUP BY r.resource_id, r.name, r.description, r.location, r.`condition`, r.quantity_total, c.club_id, c.club_name, cat.category_id, cat.category_name;

-- 3. View: Club Resource Utilization Summary
CREATE OR REPLACE VIEW vw_club_utilization_summary AS
SELECT
    c.club_id,
    c.club_name,
    c.category AS club_category,
    COUNT(DISTINCT r.resource_id) AS total_resources_owned,
    COUNT(DISTINCT req.request_id) AS total_requests_made,
    COALESCE(SUM(CASE WHEN req.status = 'approved' THEN 1 ELSE 0 END), 0) AS approved_requests_count
FROM CLUB c
LEFT JOIN RESOURCE r ON r.club_id = c.club_id
LEFT JOIN REQUEST req ON req.club_id = c.club_id
GROUP BY c.club_id, c.club_name, c.category;

-- 4. View: Underutilized Assets (0 or 1 requests ever made)
CREATE OR REPLACE VIEW vw_underutilized_assets AS
SELECT
    r.resource_id,
    r.name AS resource_name,
    c.club_name AS owner_club,
    cat.category_name,
    r.quantity_total,
    r.`condition`,
    COUNT(req.request_id) AS lifetime_request_count
FROM RESOURCE r
JOIN CLUB c ON c.club_id = r.club_id
JOIN RESOURCE_CATEGORY cat ON cat.category_id = r.category_id
LEFT JOIN REQUEST req ON req.resource_id = r.resource_id
GROUP BY r.resource_id, r.name, c.club_name, cat.category_name, r.quantity_total, r.`condition`
HAVING COUNT(req.request_id) <= 1;

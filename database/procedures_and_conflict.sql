-- ============================================================
-- MySQL Stored Procedures: Conflict Detection & Alternative Suggestions
-- ============================================================

USE campus_club_resource_exchange;

DROP PROCEDURE IF EXISTS sp_check_scheduling_conflict;
DROP PROCEDURE IF EXISTS sp_suggest_alternative_resources;

DELIMITER $$

-- 1. Check availability of a specific resource during [p_start, p_end]
CREATE PROCEDURE sp_check_scheduling_conflict(
    IN p_resource_id INT,
    IN p_qty_needed INT,
    IN p_start DATETIME,
    IN p_end DATETIME
)
BEGIN
    SELECT
        ((r.quantity_total - COALESCE(SUM(a.quantity_allocated), 0)) < p_qty_needed) AS has_conflict,
        r.quantity_total,
        COALESCE(SUM(a.quantity_allocated), 0) AS quantity_reserved,
        GREATEST(0, r.quantity_total - COALESCE(SUM(a.quantity_allocated), 0)) AS quantity_available
    FROM RESOURCE r
    LEFT JOIN REQUEST req
        ON req.resource_id = r.resource_id
        AND req.status = 'approved'
        AND req.start_time < p_end
        AND req.end_time > p_start
    LEFT JOIN ALLOCATION a
        ON a.request_id = req.request_id
        AND a.status = 'allocated'
    WHERE r.resource_id = p_resource_id
    GROUP BY r.resource_id, r.quantity_total;
END$$

-- 2. Suggest alternative available resources in the same category for [p_start, p_end]
CREATE PROCEDURE sp_suggest_alternative_resources(
    IN p_resource_id INT,
    IN p_qty_needed INT,
    IN p_start DATETIME,
    IN p_end DATETIME
)
BEGIN
    DECLARE v_category_id INT;
    SELECT category_id INTO v_category_id FROM RESOURCE WHERE resource_id = p_resource_id;

    SELECT
        r.resource_id,
        r.name AS resource_name,
        c.club_name AS owner_club_name,
        r.location,
        r.`condition`,
        (r.quantity_total - COALESCE(SUM(a.quantity_allocated), 0)) AS available_qty
    FROM RESOURCE r
    JOIN CLUB c ON c.club_id = r.club_id
    LEFT JOIN REQUEST req
        ON req.resource_id = r.resource_id
        AND req.status = 'approved'
        AND req.start_time < p_end
        AND req.end_time > p_start
    LEFT JOIN ALLOCATION a
        ON a.request_id = req.request_id
        AND a.status = 'allocated'
    WHERE r.category_id = v_category_id
      AND r.resource_id <> p_resource_id
      AND r.`condition` <> 'needs_maintenance'
    GROUP BY r.resource_id, r.name, c.club_name, r.location, r.`condition`, r.quantity_total
    HAVING available_qty >= p_qty_needed
    ORDER BY available_qty DESC;
END$$

DELIMITER ;
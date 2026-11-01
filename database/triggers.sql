-- ============================================================
-- MySQL Triggers: Stock Validation & Auto-Notifications
-- ============================================================

USE campus_club_resource_exchange;

DROP TRIGGER IF EXISTS trg_validate_allocation_stock;
DROP TRIGGER IF EXISTS trg_notify_request_status;

DELIMITER $$

-- 1. Trigger: Validate available quantity before inserting an allocation
CREATE TRIGGER trg_validate_allocation_stock
BEFORE INSERT ON ALLOCATION
FOR EACH ROW
BEGIN
    DECLARE v_resource_id INT;
    DECLARE v_total_qty INT;
    DECLARE v_currently_allocated INT;
    DECLARE v_start DATETIME;
    DECLARE v_end DATETIME;

    SELECT r.resource_id, res.quantity_total, r.start_time, r.end_time
    INTO v_resource_id, v_total_qty, v_start, v_end
    FROM REQUEST r
    JOIN RESOURCE res ON res.resource_id = r.resource_id
    WHERE r.request_id = NEW.request_id;

    SELECT COALESCE(SUM(a.quantity_allocated), 0)
    INTO v_currently_allocated
    FROM ALLOCATION a
    JOIN REQUEST req ON req.request_id = a.request_id
    WHERE req.resource_id = v_resource_id
      AND a.status = 'allocated'
      AND req.start_time < v_end
      AND req.end_time > v_start;

    IF (v_currently_allocated + NEW.quantity_allocated) > v_total_qty THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient resource quantity available for the requested time window';
    END IF;
END$$

-- 2. Trigger: Automatically notify club members when request status changes
CREATE TRIGGER trg_notify_request_status
AFTER UPDATE ON REQUEST
FOR EACH ROW
BEGIN
    DECLARE v_resource_name VARCHAR(150);

    IF OLD.status <> NEW.status THEN
        SELECT name INTO v_resource_name FROM RESOURCE WHERE resource_id = NEW.resource_id;

        INSERT INTO NOTIFICATION (user_id, message, type, is_read)
        SELECT
            uc.user_id,
            CONCAT('Request #', NEW.request_id, ' for "', v_resource_name, '" status changed from ', OLD.status, ' to ', NEW.status, '.'),
            'request_update',
            FALSE
        FROM USER_CLUB uc
        WHERE uc.club_id = NEW.club_id;
    END IF;
END$$

DELIMITER ;

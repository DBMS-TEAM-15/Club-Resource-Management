# Step-by-Step Issue Resolution Manual (MySQL + MongoDB)

> [!IMPORTANT]
> - **Repository:** https://github.com/SE-TEAM-15/Club-Resource-Management
> - **No changes were made to the repository.**
> - Follow the issues strictly in order (`Order 01` $\rightarrow$ `Order 12`).
> - **Hemaksh (`Hemaksh-b`)** works on branch `hemaksh` and resolves **Issues `#2`, `#4`, `#6`, `#8`, `#10`, `#12`** (12 commits total).
> - **Aaryesh (`aaryesh246`)** works on branch `aaryesh` and resolves **Issues `#3`, `#5`, `#7`, `#9`, `#11`, `#13`** (12 commits total).

---

## Quick Overview: Ordered Task Schedule

| Order | Issue | Who | What to Do | Branch | Commits |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Order 01** | [#2](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/2) | **Hemaksh** | MySQL Core Schema, DDL Enhancements & Seed Data | `hemaksh` | 2 |
| **Order 02** | [#3](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/3) | **Aaryesh** | MongoDB Collections Setup, Schema Validation & Seed Script | `aaryesh` | 2 |
| **Order 03** | [#4](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/4) | **Hemaksh** | MySQL Advanced Features: Triggers, Views & Full-Text Search | `hemaksh` | 2 |
| **Order 04** | [#5](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/5) | **Aaryesh** | MySQL Stored Procedures, Conflict Detection & MongoDB Aggregations | `aaryesh` | 2 |
| **Order 05** | [#6](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/6) | **Hemaksh** | Authentication, Password Hashing & Role-Based Access Control (RBAC) API | `hemaksh` | 2 |
| **Order 06** | [#7](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/7) | **Aaryesh** | Clubs, Categories & Hybrid Resource Catalog API (MySQL + MongoDB) | `aaryesh` | 2 |
| **Order 07** | [#8](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/8) | **Hemaksh** | Inter-Club Resource Requests, Conflict Detection & Alternative Suggestions API | `hemaksh` | 2 |
| **Order 08** | [#9](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/9) | **Aaryesh** | Transactional Request Approval, Borrowing, Return & Maintenance API | `aaryesh` | 2 |
| **Order 09** | [#10](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/10) | **Hemaksh** | Admin Analytics & Utilization Insights API (Complex MySQL + NoSQL) | `hemaksh` | 2 |
| **Order 10** | [#11](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/11) | **Aaryesh** | Frontend Auth UI, Role-Aware Navigation & Resource Catalog Page | `aaryesh` | 2 |
| **Order 11** | [#12](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/12) | **Hemaksh** | Frontend Request Reservation Modal, Conflict Alerts & Coordinator Portal | `hemaksh` | 2 |
| **Order 12** | [#13](https://github.com/SE-TEAM-15/Club-Resource-Management/issues/13) | **Aaryesh** | Frontend Admin Analytics Dashboard & Final Documentation | `aaryesh` | 2 |

---

## Order 01 — Hemaksh : Issue #2 : Do :
**Issue Title:** `[Order 01] MySQL Core Schema, DDL Enhancements & Seed Data`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `database/mysql_schema.sql`
Create `database/mysql_schema.sql` with the following contents:
```sql
-- ============================================================
-- Campus Club Resource Exchange and Intelligent Allocation System
-- MySQL Core Schema (DDL: CREATE, ALTER, DROP, PK/FK, CHECK, INDEX)
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_club_resource_exchange;
USE campus_club_resource_exchange;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS NOTIFICATION;
DROP TABLE IF EXISTS ALLOCATION;
DROP TABLE IF EXISTS REQUEST;
DROP TABLE IF EXISTS RESOURCE;
DROP TABLE IF EXISTS RESOURCE_CATEGORY;
DROP TABLE IF EXISTS USER_CLUB;
DROP TABLE IF EXISTS ADMIN;
DROP TABLE IF EXISTS CLUB_OFFICER;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS CLUB;
DROP TABLE IF EXISTS USER;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USER (Supertype entity)
CREATE TABLE USER (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    phone          VARCHAR(20),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLUB
CREATE TABLE CLUB (
    club_id      INT AUTO_INCREMENT PRIMARY KEY,
    club_name    VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT,
    category     VARCHAR(100),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENT (ISA subtype of USER)
CREATE TABLE STUDENT (
    user_id   INT PRIMARY KEY,
    roll_no   VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

-- 4. CLUB_OFFICER (ISA subtype of USER)
CREATE TABLE CLUB_OFFICER (
    user_id    INT PRIMARY KEY,
    club_role  VARCHAR(100) NOT NULL,
    CONSTRAINT fk_officer_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

-- 5. ADMIN (ISA subtype of USER)
CREATE TABLE ADMIN (
    user_id       INT PRIMARY KEY,
    admin_level   VARCHAR(50) NOT NULL,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

-- 6. USER_CLUB (Junction table for BELONGS_TO)
CREATE TABLE USER_CLUB (
    user_id  INT NOT NULL,
    club_id  INT NOT NULL,
    PRIMARY KEY (user_id, club_id),
    CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_uc_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id) ON DELETE CASCADE
);

-- 7. RESOURCE_CATEGORY
CREATE TABLE RESOURCE_CATEGORY (
    category_id    INT AUTO_INCREMENT PRIMARY KEY,
    category_name  VARCHAR(100) NOT NULL UNIQUE
);

-- 8. RESOURCE
CREATE TABLE RESOURCE (
    resource_id      INT AUTO_INCREMENT PRIMARY KEY,
    club_id          INT NOT NULL,
    category_id      INT NOT NULL,
    name             VARCHAR(150) NOT NULL,
    description      TEXT,
    quantity_total   INT NOT NULL DEFAULT 1,
    location         VARCHAR(150),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_category FOREIGN KEY (category_id) REFERENCES RESOURCE_CATEGORY(category_id),
    CONSTRAINT chk_resource_qty CHECK (quantity_total >= 0)
);

-- Demonstrate ALTER TABLE to add condition column for filtering & maintenance tracking
ALTER TABLE RESOURCE
ADD COLUMN `condition` ENUM('excellent', 'good', 'fair', 'needs_maintenance') NOT NULL DEFAULT 'good';

CREATE INDEX idx_resource_club ON RESOURCE(club_id);
CREATE INDEX idx_resource_category ON RESOURCE(category_id);
CREATE INDEX idx_resource_condition ON RESOURCE(`condition`);

-- 9. REQUEST
CREATE TABLE REQUEST (
    request_id           INT AUTO_INCREMENT PRIMARY KEY,
    club_id              INT NOT NULL,
    resource_id          INT NOT NULL,
    purpose              VARCHAR(255) NOT NULL,
    quantity_requested   INT NOT NULL,
    request_date         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status               ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    CONSTRAINT fk_request_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id) ON DELETE CASCADE,
    CONSTRAINT fk_request_resource FOREIGN KEY (resource_id) REFERENCES RESOURCE(resource_id) ON DELETE CASCADE,
    CONSTRAINT chk_request_qty CHECK (quantity_requested > 0)
);

-- Demonstrate ALTER TABLE to add scheduling time window columns
ALTER TABLE REQUEST
ADD COLUMN start_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN end_time   DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 4 HOUR),
ADD CONSTRAINT chk_request_time_window CHECK (end_time > start_time);

CREATE INDEX idx_request_status ON REQUEST(status);
CREATE INDEX idx_request_date ON REQUEST(request_date);
CREATE INDEX idx_request_window ON REQUEST(resource_id, start_time, end_time);

-- 10. ALLOCATION
CREATE TABLE ALLOCATION (
    allocation_id       INT AUTO_INCREMENT PRIMARY KEY,
    request_id          INT NOT NULL,
    allocated_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_date       TIMESTAMP NULL,
    quantity_allocated  INT NOT NULL,
    status              ENUM('allocated', 'returned', 'cancelled') DEFAULT 'allocated',
    approved_by         INT NULL,
    CONSTRAINT fk_allocation_request FOREIGN KEY (request_id) REFERENCES REQUEST(request_id) ON DELETE CASCADE,
    CONSTRAINT fk_allocation_approver FOREIGN KEY (approved_by) REFERENCES USER(user_id) ON DELETE SET NULL,
    CONSTRAINT chk_allocation_qty CHECK (quantity_allocated > 0)
);

CREATE INDEX idx_allocation_request ON ALLOCATION(request_id);
CREATE INDEX idx_allocation_status ON ALLOCATION(status);

-- 11. NOTIFICATION
CREATE TABLE NOTIFICATION (
    notification_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    message          TEXT NOT NULL,
    type             VARCHAR(50) DEFAULT 'request_update',
    is_read          BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES USER(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_notification_user ON NOTIFICATION(user_id, is_read);
```

### Step 2: Create File `database/mysql_seed.sql`
Create `database/mysql_seed.sql` with the following contents:
```sql
-- ============================================================
-- Seed Data for MySQL Relational Schema
-- ============================================================

USE campus_club_resource_exchange;

INSERT INTO USER (name, email, password_hash, phone) VALUES
('Aditi Rao', 'aditi@pes.edu', 'scrypt:demo:aditi123', '9876543210'),
('Rohan Mehta', 'rohan@pes.edu', 'scrypt:demo:rohan123', '9876500001'),
('Sara Khan', 'sara@pes.edu', 'scrypt:demo:sara123', '9876500002'),
('Vikram Singh', 'vikram@pes.edu', 'scrypt:demo:vikram123', '9876500003'),
('Priya Nair', 'priya@pes.edu', 'scrypt:demo:priya123', '9876500004');

INSERT INTO CLUB (club_name, description, category) VALUES
('Photography Club', 'Handles campus photo and video coverage', 'Media'),
('Robotics Club', 'Builds and competes with autonomous robots', 'Technical'),
('Drama Society', 'Organizes theatre, street plays, and stage events', 'Cultural'),
('Music Club', 'Campus bands, acoustic nights, and audio production', 'Cultural');

INSERT INTO STUDENT (user_id, roll_no) VALUES
(1, 'PES2UG24CS191'),
(3, 'PES2UG24CS215');

INSERT INTO CLUB_OFFICER (user_id, club_role) VALUES
(2, 'President - Robotics Club'),
(5, 'Secretary - Drama Society');

INSERT INTO ADMIN (user_id, admin_level) VALUES
(4, 'Super Admin');

INSERT INTO USER_CLUB (user_id, club_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(3, 3),
(5, 3);

INSERT INTO RESOURCE_CATEGORY (category_name) VALUES
('Camera'),
('Projector'),
('Microphone'),
('Event Space'),
('Lighting & Audio');

INSERT INTO RESOURCE (club_id, category_id, name, description, quantity_total, location, `condition`) VALUES
(1, 1, 'Canon EOS 200D DSLR', 'DSLR camera with 18-55mm and 50mm prime lens', 2, 'Media Room A1', 'excellent'),
(1, 1, 'Sony Alpha A6400 Mirrorless', '4K mirrorless camera with gimbal stabilizer', 1, 'Media Room A1', 'good'),
(2, 2, 'Epson EX3260 Projector', 'Portable 3300-lumen HDMI projector for demos', 2, 'Robotics Lab B2', 'good'),
(2, 2, 'BenQ MW560 WXGA Projector', 'High-contrast conference projector', 1, 'Seminar Hall 2', 'excellent'),
(3, 3, 'Shure SM58 Dynamic Microphone', 'Wired dynamic vocal microphone with XLR cable', 4, 'Drama Store Room', 'good'),
(4, 3, 'Rode Wireless GO II', 'Dual channel wireless microphone system', 2, 'Music Studio C1', 'excellent'),
(3, 4, 'Main Auditorium Stage Wing', 'Rehearsal and performance space with stage lighting', 1, 'Auditorium Block', 'excellent'),
(4, 5, 'Yamaha Stagepas 400BT PA System', 'Portable PA speaker system with 8-channel mixer', 1, 'Music Studio C1', 'fair');

INSERT INTO REQUEST (club_id, resource_id, purpose, quantity_requested, status, start_time, end_time) VALUES
(2, 1, 'Recording robotics demo for annual showcase', 1, 'approved', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY + INTERVAL 4 HOUR),
(3, 3, 'Projector needed for play rehearsal briefing', 1, 'pending', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 2 DAY + INTERVAL 3 HOUR),
(1, 5, 'Mic needed for photography club workshop', 2, 'rejected', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 3 HOUR);

INSERT INTO ALLOCATION (request_id, quantity_allocated, status, approved_by) VALUES
(1, 1, 'allocated', 4);

INSERT INTO NOTIFICATION (user_id, message, type, is_read) VALUES
(2, 'Your request for Canon EOS 200D DSLR has been approved.', 'request_update', TRUE),
(5, 'Your request for Epson EX3260 Projector is pending review.', 'request_update', FALSE),
(1, 'Your request for Shure SM58 Dynamic Microphone was rejected.', 'request_update', FALSE);
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git pull origin hemaksh
git add database/mysql_schema.sql
git commit -m "feat(db): add MySQL DDL schema with ALTER, constraints, and indexes (#2)"
git add database/mysql_seed.sql
git commit -m "feat(db): add initial MySQL seed data for all tables (Closes #2)"
git push origin hemaksh
```

---

## Order 02 — Aaryesh : Issue #3 : Do :
**Issue Title:** `[Order 02] MongoDB Collections Setup, Schema Validation & Seed Script`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `database/mongodb_schema.js`
Create `database/mongodb_schema.js` with the following contents:
```javascript
// ============================================================
// MongoDB Collections, JSON Schema Validation & Indexes
// Run with: mongosh "$MONGODB_URI" database/mongodb_schema.js
// ============================================================

const dbName = "campus_club_resource_exchange";
const database = db.getSiblingDB(dbName);

database.resource_specs.drop();
database.maintenance_logs.drop();

database.createCollection("resource_specs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resource_id", "category_name", "specifications"],
      properties: {
        resource_id: {
          bsonType: "int",
          description: "References MySQL RESOURCE.resource_id"
        },
        category_name: { bsonType: "string" },
        specifications: {
          bsonType: "object",
          description: "Flexible schema-less key-value attributes specific to asset type"
        },
        accessories_included: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        usage_guidelines: { bsonType: "string" },
        tags: {
          bsonType: "array",
          items: { bsonType: "string" }
        }
      }
    }
  }
});

database.resource_specs.createIndex({ resource_id: 1 }, { unique: true });
database.resource_specs.createIndex({ category_name: 1 });
database.resource_specs.createIndex({ tags: 1 });
database.resource_specs.createIndex({ usage_guidelines: "text", category_name: "text" });

database.createCollection("maintenance_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resource_id", "reported_by_user_id", "issue_type", "condition_after", "created_at"],
      properties: {
        resource_id: { bsonType: "int" },
        reported_by_user_id: { bsonType: "int" },
        issue_type: {
          enum: ["routine_check", "repair", "damage_report", "calibration", "cleaning"]
        },
        notes: { bsonType: "string" },
        condition_before: { bsonType: "string" },
        condition_after: {
          enum: ["excellent", "good", "fair", "needs_maintenance"]
        },
        checklist: { bsonType: "object" },
        cost_incurred: { bsonType: ["double", "int"] },
        created_at: { bsonType: "date" }
      }
    }
  }
});

database.maintenance_logs.createIndex({ resource_id: 1, created_at: -1 });
database.maintenance_logs.createIndex({ issue_type: 1 });
```

### Step 2: Create File `database/mongodb_seed.js`
Create `database/mongodb_seed.js` with the following contents:
```javascript
// ============================================================
// MongoDB Seed Data for resource_specs and maintenance_logs
// ============================================================

const database = db.getSiblingDB("campus_club_resource_exchange");

database.resource_specs.insertMany([
  {
    resource_id: Int32(1),
    category_name: "Camera",
    specifications: {
      sensor: "24.1MP APS-C CMOS",
      video_resolution: "1080p 60fps",
      iso_range: "100-25600",
      battery_life_shots: 650,
      mount: "Canon EF/EF-S"
    },
    accessories_included: ["18-55mm Lens", "50mm f/1.8 Lens", "64GB SDXC Card", "Dual Charger", "Padded Bag"],
    usage_guidelines: "Format SD card before returning. Do not expose lens sensor to direct stage lasers.",
    tags: ["dslr", "photography", "video", "canon"]
  },
  {
    resource_id: Int32(2),
    category_name: "Camera",
    specifications: {
      sensor: "24.2MP APS-C Exmor CMOS",
      video_resolution: "4K 30fps HDR",
      autofocus_points: 425,
      mount: "Sony E-mount"
    },
    accessories_included: ["16-50mm Power Zoom Lens", "DJI Ronin SC Gimbal", "2x NP-FW50 Batteries"],
    usage_guidelines: "Balance the gimbal prior to powering on motors.",
    tags: ["mirrorless", "4k", "sony", "gimbal"]
  },
  {
    resource_id: Int32(3),
    category_name: "Projector",
    specifications: {
      brightness_lumens: 3300,
      native_resolution: "SVGA (800x600)",
      ports: ["HDMI", "VGA", "USB-B"],
      lamp_hours_remaining: 4200
    },
    accessories_included: ["HDMI Cable (5m)", "Power Cord", "Remote Control"],
    usage_guidelines: "Allow cooling fan to run for 5 minutes before unplugging power cord.",
    tags: ["projector", "hdmi", "presentation", "epson"]
  },
  {
    resource_id: Int32(4),
    category_name: "Projector",
    specifications: {
      brightness_lumens: 4000,
      native_resolution: "WXGA (1280x800)",
      contrast_ratio: "20000:1",
      ports: ["2x HDMI", "VGA", "Audio Out"]
    },
    accessories_included: ["HDMI Cable (10m)", "Remote"],
    usage_guidelines: "Suitable for bright seminar rooms.",
    tags: ["projector", "wxga", "benq", "high-lumen"]
  },
  {
    resource_id: Int32(5),
    category_name: "Microphone",
    specifications: {
      polar_pattern: "Cardioid",
      frequency_response: "50Hz - 15kHz",
      connector: "3-pin XLR",
      impedance_ohms: 150
    },
    accessories_included: ["XLR Cable (6m)", "Mic Stand Clip", "Foam Windscreen"],
    usage_guidelines: "Do not drop or tap the grille forcefully.",
    tags: ["microphone", "vocal", "stage", "xlr", "shure"]
  }
]);

database.maintenance_logs.insertMany([
  {
    resource_id: Int32(1),
    reported_by_user_id: Int32(2),
    issue_type: "routine_check",
    notes: "Cleaned CMOS sensor and verified autofocus calibration after Robotics showcase.",
    condition_before: "good",
    condition_after: "excellent",
    checklist: { lens_clean: true, battery_health_ok: true, sd_slot_ok: true },
    cost_incurred: 0,
    created_at: new Date()
  },
  {
    resource_id: Int32(3),
    reported_by_user_id: Int32(5),
    issue_type: "cleaning",
    notes: "Replaced air filter mesh and cleaned projector optics.",
    condition_before: "fair",
    condition_after: "good",
    checklist: { air_filter_clean: true, hdmi_port_tested: true },
    cost_incurred: 250,
    created_at: new Date()
  }
]);
```

### Step 3: Commands for Aaryesh to Run
```bash
git fetch origin
git checkout -b aaryesh origin/hemaksh
git add database/mongodb_schema.js
git commit -m "feat(mongo): add MongoDB schema validation and indexes for specs and maintenance (#3)"
git add database/mongodb_seed.js
git commit -m "feat(mongo): add seed script for resource_specs and maintenance_logs (Closes #3)"
git push -u origin aaryesh
```

---

## Order 03 — Hemaksh : Issue #4 : Do :
**Issue Title:** `[Order 03] MySQL Advanced Features: Triggers, Views & Full-Text Search`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `database/triggers.sql`
Create `database/triggers.sql` with the following contents:
```sql
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
```

### Step 2: Create File `database/views_and_fts.sql`
Create `database/views_and_fts.sql` with the following contents:
```sql
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
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git add database/triggers.sql
git commit -m "feat(db): add MySQL triggers for stock validation and status notifications (#4)"
git add database/views_and_fts.sql
git commit -m "feat(db): add MySQL analytical views and FULLTEXT search index (Closes #4)"
git push origin hemaksh
```

---

## Order 04 — Aaryesh : Issue #5 : Do :
**Issue Title:** `[Order 04] MySQL Stored Procedures, Conflict Detection & MongoDB Aggregations`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `database/procedures_and_conflict.sql`
Create `database/procedures_and_conflict.sql` with the following contents:
```sql
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
```

### Step 2: Create File `src/lib/db/aggregations.ts`
Create `src/lib/db/aggregations.ts` with the following contents:
```typescript
import clientPromise from "./mongodb";

const DB_NAME = "campus_club_resource_exchange";

export async function getMaintenanceSummaryByIssueType() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return db
    .collection("maintenance_logs")
    .aggregate([
      {
        $group: {
          _id: "$issue_type",
          count: { $sum: 1 },
          total_cost: { $sum: "$cost_incurred" },
          latest_event: { $max: "$created_at" },
        },
      },
      { $sort: { count: -1 } },
    ])
    .toArray();
}

export async function getResourceMaintenanceBreakdown() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return db
    .collection("maintenance_logs")
    .aggregate([
      {
        $lookup: {
          from: "resource_specs",
          localField: "resource_id",
          foreignField: "resource_id",
          as: "spec_info",
        },
      },
      { $unwind: { path: "$spec_info", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$resource_id",
          category_name: { $first: "$spec_info.category_name" },
          maintenance_events: { $sum: 1 },
          total_cost: { $sum: "$cost_incurred" },
          latest_condition: { $last: "$condition_after" },
        },
      },
      { $sort: { maintenance_events: -1 } },
    ])
    .toArray();
}
```

### Step 3: Commands for Aaryesh to Run
```bash
git checkout aaryesh
git add database/procedures_and_conflict.sql
git commit -m "feat(db): add MySQL stored procedures for conflict detection and alternative suggestions (#5)"
git add src/lib/db/aggregations.ts
git commit -m "feat(mongo): add MongoDB aggregation pipelines for maintenance insights (Closes #5)"
git push origin aaryesh
```

---

## Order 05 — Hemaksh : Issue #6 : Do :
**Issue Title:** `[Order 05] Authentication, Password Hashing & Role-Based Access Control (RBAC) API`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `src/lib/auth.ts`
Create `src/lib/auth.ts` with the following contents:
```typescript
import crypto from "crypto";
import pool from "./db/mysql";
import { UserRole } from "@/types";
import { RowDataPacket } from "mysql2";

export function hashPassword(password: string): string {
  const salt = "campus_club_salt_v1";
  const derived = crypto.scryptSync(password, salt, 32).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith("scrypt:demo:")) {
    return storedHash === `scrypt:demo:${password}`;
  }
  const parts = storedHash.split(":");
  if (parts.length !== 3) return false;
  const [, salt, originalHex] = parts;
  const derived = crypto.scryptSync(password, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(originalHex));
}

export async function getUserWithRoles(email: string) {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      u.phone,
      s.roll_no,
      co.club_role,
      a.admin_level,
      GROUP_CONCAT(uc.club_id) AS club_ids_csv
    FROM USER u
    LEFT JOIN STUDENT s ON s.user_id = u.user_id
    LEFT JOIN CLUB_OFFICER co ON co.user_id = u.user_id
    LEFT JOIN ADMIN a ON a.user_id = u.user_id
    LEFT JOIN USER_CLUB uc ON uc.user_id = u.user_id
    WHERE u.email = ?
    GROUP BY u.user_id, s.roll_no, co.club_role, a.admin_level
  `;
  const [rows] = await pool.query<RowDataPacket[]>(query, [email]);
  if (!rows[0]) return null;

  const row = rows[0];
  let role: UserRole = "student";
  if (row.admin_level) role = "admin";
  else if (row.club_role) role = "club_officer";

  const club_ids = row.club_ids_csv ? String(row.club_ids_csv).split(",").map(Number) : [];
  return { ...row, club_ids, role };
}
```

### Step 2: Create File `src/app/api/auth/route.ts`
Create `src/app/api/auth/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { getUserWithRoles, hashPassword, verifyPassword } from "@/lib/auth";
import { ResultSetHeader } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, email, password, phone, roleType, rollNo, clubRole, clubId } = body;

    if (action === "register") {
      if (!name || !email || !password) {
        return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
      }
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const passwordHash = hashPassword(password);
        const [userRes] = await conn.query<ResultSetHeader>(
          `INSERT INTO USER (name, email, password_hash, phone) VALUES (?, ?, ?, ?)`,
          [name, email, passwordHash, phone || null]
        );
        const userId = userRes.insertId;

        if (roleType === "club_officer") {
          await conn.query(`INSERT INTO CLUB_OFFICER (user_id, club_role) VALUES (?, ?)`, [
            userId,
            clubRole || "Coordinator",
          ]);
        } else if (roleType === "admin") {
          await conn.query(`INSERT INTO ADMIN (user_id, admin_level) VALUES (?, ?)`, [userId, "System Admin"]);
        } else {
          await conn.query(`INSERT INTO STUDENT (user_id, roll_no) VALUES (?, ?)`, [
            userId,
            rollNo || `PES-${userId}`,
          ]);
        }

        if (clubId) {
          await conn.query(`INSERT IGNORE INTO USER_CLUB (user_id, club_id) VALUES (?, ?)`, [
            userId,
            Number(clubId),
          ]);
        }

        await conn.commit();
        const createdUser = await getUserWithRoles(email);
        return NextResponse.json({ user: createdUser }, { status: 201 });
      } catch (err: any) {
        await conn.rollback();
        return NextResponse.json({ error: err.message }, { status: 400 });
      } finally {
        conn.release();
      }
    }

    const user = await getUserWithRoles(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { password_hash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git add src/lib/auth.ts
git commit -m "feat(auth): add scrypt password hashing and MySQL ISA role resolution helpers (#6)"
git add src/app/api/auth/route.ts
git commit -m "feat(api): add login and transactional registration API with RBAC (Closes #6)"
git push origin hemaksh
```

---

## Order 06 — Aaryesh : Issue #7 : Do :
**Issue Title:** `[Order 06] Clubs, Categories & Hybrid Resource Catalog API (MySQL + MongoDB)`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `src/app/api/clubs/route.ts`
Create `src/app/api/clubs/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [clubs] = await pool.query<RowDataPacket[]>(`SELECT * FROM CLUB ORDER BY club_name ASC`);
    const [categories] = await pool.query<RowDataPacket[]>(`SELECT * FROM RESOURCE_CATEGORY ORDER BY category_name ASC`);
    return NextResponse.json({ clubs, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { club_name, description, category } = await req.json();
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO CLUB (club_name, description, category) VALUES (?, ?, ?)`,
      [club_name, description, category]
    );
    return NextResponse.json({ club_id: res.insertId, club_name, description, category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### Step 2: Create File `src/app/api/resources/route.ts`
Create `src/app/api/resources/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const DB_NAME = "campus_club_resource_exchange";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const condition = searchParams.get("condition");
    const clubId = searchParams.get("clubId");
    const q = searchParams.get("q");
    const availableOnly = searchParams.get("availableOnly") === "true";

    const conditions: string[] = [];
    const values: any[] = [];

    if (categoryId) {
      conditions.push(`v.category_id = ?`);
      values.push(Number(categoryId));
    }
    if (condition) {
      conditions.push(`v.\`condition\` = ?`);
      values.push(condition);
    }
    if (clubId) {
      conditions.push(`v.owner_club_id = ?`);
      values.push(Number(clubId));
    }
    if (availableOnly) {
      conditions.push(`v.quantity_currently_available > 0`);
    }
    if (q) {
      conditions.push(`(MATCH(r.name, r.description, r.location) AGAINST(? IN NATURAL LANGUAGE MODE) OR v.resource_name LIKE ?)`);
      values.push(q, `%${q}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `
      SELECT v.*
      FROM vw_resource_availability v
      JOIN RESOURCE r ON r.resource_id = v.resource_id
      ${whereClause}
      ORDER BY v.resource_id ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql, values);

    let specsMap = new Map<number, any>();
    try {
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      const specs = await db.collection("resource_specs").find({}).toArray();
      specs.forEach((s: any) => specsMap.set(Number(s.resource_id), s));
    } catch {
      // Fallback if MongoDB is offline in dev
    }

    const resources = rows.map((row) => ({
      ...row,
      mongo_specs: specsMap.get(Number(row.resource_id)) || null,
    }));

    return NextResponse.json({ resources });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      club_id,
      category_id,
      name,
      description,
      quantity_total,
      location,
      condition,
      specifications,
      accessories_included,
      usage_guidelines,
      tags,
    } = body;

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO RESOURCE (club_id, category_id, name, description, quantity_total, location, \`condition\`)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(club_id),
        Number(category_id),
        name,
        description,
        Number(quantity_total),
        location,
        condition || "good",
      ]
    );
    const resourceId = res.insertId;

    if (specifications) {
      const [catRows] = await pool.query<RowDataPacket[]>(
        `SELECT category_name FROM RESOURCE_CATEGORY WHERE category_id = ?`,
        [Number(category_id)]
      );
      const mongoClient = await clientPromise;
      const db = mongoClient.db(DB_NAME);
      await db.collection("resource_specs").updateOne(
        { resource_id: Number(resourceId) },
        {
          $set: {
            resource_id: Number(resourceId),
            category_name: catRows[0]?.category_name || "General",
            specifications,
            accessories_included: accessories_included || [],
            usage_guidelines: usage_guidelines || "",
            tags: tags || [],
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ resource_id: resourceId, name }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### Step 3: Commands for Aaryesh to Run
```bash
git checkout aaryesh
git add src/app/api/clubs/route.ts
git commit -m "feat(api): add MySQL clubs and resource categories endpoint (#7)"
git add src/app/api/resources/route.ts
git commit -m "feat(api): add hybrid MySQL + MongoDB resource catalog and search API (Closes #7)"
git push origin aaryesh
```

---

## Order 07 — Hemaksh : Issue #8 : Do :
**Issue Title:** `[Order 07] Inter-Club Resource Requests, Conflict Detection & Alternative Suggestions API`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `src/app/api/requests/route.ts`
Create `src/app/api/requests/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get("clubId");
    const status = searchParams.get("status");

    const filters: string[] = [];
    const params: any[] = [];

    if (clubId) {
      filters.push(`(req.club_id = ? OR r.club_id = ?)`);
      params.push(Number(clubId), Number(clubId));
    }
    if (status) {
      filters.push(`req.status = ?`);
      params.push(status);
    }

    const whereSql = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        req.*,
        c.club_name AS requesting_club_name,
        r.name AS resource_name,
        r.club_id AS owner_club_id,
        oc.club_name AS owner_club_name,
        a.allocation_id,
        a.status AS allocation_status
       FROM REQUEST req
       JOIN CLUB c ON c.club_id = req.club_id
       JOIN RESOURCE r ON r.resource_id = req.resource_id
       JOIN CLUB oc ON oc.club_id = r.club_id
       LEFT JOIN ALLOCATION a ON a.request_id = req.request_id
       ${whereSql}
       ORDER BY req.request_date DESC`,
      params
    );

    return NextResponse.json({ requests: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { club_id, resource_id, purpose, quantity_requested, start_time, end_time } = await req.json();

    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO REQUEST (club_id, resource_id, purpose, quantity_requested, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Number(club_id), Number(resource_id), purpose, Number(quantity_requested), start_time, end_time]
    );

    return NextResponse.json(
      {
        request: {
          request_id: res.insertId,
          club_id,
          resource_id,
          purpose,
          quantity_requested,
          start_time,
          end_time,
          status: "pending",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### Step 2: Create File `src/app/api/requests/conflicts/route.ts`
Create `src/app/api/requests/conflicts/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = Number(searchParams.get("resourceId"));
    const qty = Number(searchParams.get("quantity") || "1");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!resourceId || !startTime || !endTime) {
      return NextResponse.json({ error: "resourceId, startTime, and endTime are required" }, { status: 400 });
    }

    const [conflictResultSets] = await pool.query<RowDataPacket[][]>(
      `CALL sp_check_scheduling_conflict(?, ?, ?, ?)`,
      [resourceId, qty, startTime, endTime]
    );
    const status = conflictResultSets[0]?.[0] || { has_conflict: 0, quantity_available: 0 };

    let alternatives: any[] = [];
    if (status.has_conflict) {
      const [altResultSets] = await pool.query<RowDataPacket[][]>(
        `CALL sp_suggest_alternative_resources(?, ?, ?, ?)`,
        [resourceId, qty, startTime, endTime]
      );
      alternatives = altResultSets[0] || [];
    }

    return NextResponse.json({
      conflict: {
        ...status,
        has_conflict: Boolean(status.has_conflict),
      },
      alternatives,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git add src/app/api/requests/route.ts
git commit -m "feat(api): add inter-club resource request creation and listing API (#8)"
git add src/app/api/requests/conflicts/route.ts
git commit -m "feat(api): add MySQL stored procedure conflict check and alternative endpoint (Closes #8)"
git push origin hemaksh
```

---

## Order 08 — Aaryesh : Issue #9 : Do :
**Issue Title:** `[Order 08] Transactional Request Approval, Borrowing, Return & Maintenance API`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `src/app/api/allocations/route.ts`
Create `src/app/api/allocations/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  const conn = await pool.getConnection();
  try {
    const { action, request_id, allocation_id, approved_by } = await req.json();
    await conn.beginTransaction();

    if (action === "approve") {
      const [reqRows] = await conn.query<RowDataPacket[]>(
        `SELECT * FROM REQUEST WHERE request_id = ? FOR UPDATE`,
        [Number(request_id)]
      );
      if (!reqRows[0]) {
        throw new Error("Request not found");
      }
      const requestRow = reqRows[0];

      await conn.query(`UPDATE REQUEST SET status = 'approved' WHERE request_id = ?`, [Number(request_id)]);

      const [allocRes] = await conn.query<ResultSetHeader>(
        `INSERT INTO ALLOCATION (request_id, quantity_allocated, status, approved_by)
         VALUES (?, ?, 'allocated', ?)`,
        [Number(request_id), Number(requestRow.quantity_requested), approved_by ? Number(approved_by) : null]
      );

      await conn.commit();
      return NextResponse.json({ allocation_id: allocRes.insertId, status: "allocated" }, { status: 201 });
    }

    if (action === "reject") {
      await conn.query(`UPDATE REQUEST SET status = 'rejected' WHERE request_id = ?`, [Number(request_id)]);
      await conn.commit();
      return NextResponse.json({ status: "rejected" });
    }

    if (action === "return") {
      await conn.query(
        `UPDATE ALLOCATION SET status = 'returned', returned_date = CURRENT_TIMESTAMP WHERE allocation_id = ?`,
        [Number(allocation_id)]
      );
      await conn.commit();
      return NextResponse.json({ allocation_id: Number(allocation_id), status: "returned" });
    }

    throw new Error("Unsupported action");
  } catch (err: any) {
    await conn.rollback();
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    conn.release();
  }
}
```

### Step 2: Create File `src/app/api/maintenance/route.ts`
Create `src/app/api/maintenance/route.ts` with the following contents:
```typescript
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/mysql";
import clientPromise from "@/lib/db/mongodb";
import { RowDataPacket } from "mysql2";

const DB_NAME = "campus_club_resource_exchange";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get("resourceId");
    const userId = searchParams.get("userId");

    if (userId) {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM NOTIFICATION WHERE user_id = ? ORDER BY created_at DESC LIMIT 25`,
        [Number(userId)]
      );
      return NextResponse.json({ notifications: rows });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const filter = resourceId ? { resource_id: Number(resourceId) } : {};
    const logs = await db.collection("maintenance_logs").find(filter).sort({ created_at: -1 }).toArray();

    return NextResponse.json({ maintenance_logs: logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resource_id, reported_by_user_id, issue_type, notes, condition_before, condition_after, cost_incurred } =
      body;

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);

    const logDoc = {
      resource_id: Number(resource_id),
      reported_by_user_id: Number(reported_by_user_id),
      issue_type: issue_type || "routine_check",
      notes: notes || "",
      condition_before: condition_before || "good",
      condition_after: condition_after || "good",
      checklist: { inspected: true },
      cost_incurred: Number(cost_incurred || 0),
      created_at: new Date(),
    };

    await db.collection("maintenance_logs").insertOne(logDoc);

    if (condition_after) {
      await pool.query(`UPDATE RESOURCE SET \`condition\` = ? WHERE resource_id = ?`, [
        condition_after,
        Number(resource_id),
      ]);
    }

    return NextResponse.json({ log: logDoc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### Step 3: Commands for Aaryesh to Run
```bash
git checkout aaryesh
git add src/app/api/allocations/route.ts
git commit -m "feat(api): add MySQL ACID transactional request approval and return API (#9)"
git add src/app/api/maintenance/route.ts
git commit -m "feat(api): add MongoDB maintenance tracking and MySQL notifications endpoint (Closes #9)"
git push origin aaryesh
```

---

## Order 09 — Hemaksh : Issue #10 : Do :
**Issue Title:** `[Order 09] Admin Analytics & Utilization Insights API (Complex MySQL + NoSQL)`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `src/lib/db/analyticsQueries.ts`
Create `src/lib/db/analyticsQueries.ts` with the following contents:
```typescript
import pool from "./mysql";
import { RowDataPacket } from "mysql2";

export async function getFrequentlyRequestedResources() {
  const sql = `
    SELECT
      r.resource_id,
      r.name AS resource_name,
      c.club_name AS owner_club,
      cat.category_name,
      COUNT(req.request_id) AS request_count,
      COALESCE(SUM(req.quantity_requested), 0) AS total_units_requested
    FROM RESOURCE r
    JOIN CLUB c ON c.club_id = r.club_id
    JOIN RESOURCE_CATEGORY cat ON cat.category_id = r.category_id
    JOIN REQUEST req ON req.resource_id = r.resource_id
    GROUP BY r.resource_id, r.name, c.club_name, cat.category_name
    HAVING COUNT(req.request_id) >= 1
    ORDER BY request_count DESC, total_units_requested DESC
  `;
  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows;
}

export async function getInterClubBorrowingPatterns() {
  const sql = `
    SELECT
      borrower.club_name AS borrowing_club,
      lender.club_name AS lending_club,
      COUNT(req.request_id) AS total_exchanges,
      SUM(CASE WHEN req.status = 'approved' THEN 1 ELSE 0 END) AS approved_exchanges
    FROM REQUEST req
    JOIN CLUB borrower ON borrower.club_id = req.club_id
    JOIN RESOURCE r ON r.resource_id = req.resource_id
    JOIN CLUB lender ON lender.club_id = r.club_id
    WHERE req.club_id <> r.club_id
    GROUP BY borrower.club_name, lender.club_name
    ORDER BY total_exchanges DESC
  `;
  const [rows] = await pool.query<RowDataPacket[]>(sql);
  return rows;
}

export async function getUnderutilizedAndClubSummary() {
  const [underutilized] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM vw_underutilized_assets ORDER BY lifetime_request_count ASC`
  );
  const [clubUtilization] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM vw_club_utilization_summary ORDER BY total_requests_made DESC`
  );
  return { underutilized, clubUtilization };
}
```

### Step 2: Create File `src/app/api/analytics/route.ts`
Create `src/app/api/analytics/route.ts` with the following contents:
```typescript
import { NextResponse } from "next/server";
import {
  getFrequentlyRequestedResources,
  getInterClubBorrowingPatterns,
  getUnderutilizedAndClubSummary,
} from "@/lib/db/analyticsQueries";
import { getMaintenanceSummaryByIssueType } from "@/lib/db/aggregations";

export async function GET() {
  try {
    const [frequentlyRequested, borrowingPatterns, summary] = await Promise.all([
      getFrequentlyRequestedResources(),
      getInterClubBorrowingPatterns(),
      getUnderutilizedAndClubSummary(),
    ]);

    let maintenanceSummary: any[] = [];
    try {
      maintenanceSummary = await getMaintenanceSummaryByIssueType();
    } catch {
      // Fallback if MongoDB is unavailable
    }

    return NextResponse.json({
      frequentlyRequested,
      borrowingPatterns,
      underutilized: summary.underutilized,
      clubUtilization: summary.clubUtilization,
      maintenanceSummary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git add src/lib/db/analyticsQueries.ts
git commit -m "feat(db): add complex MySQL analytics queries with JOIN, GROUP BY, HAVING, and views (#10)"
git add src/app/api/analytics/route.ts
git commit -m "feat(api): expose hybrid MySQL and MongoDB admin analytics endpoint (Closes #10)"
git push origin hemaksh
```

---

## Order 10 — Aaryesh : Issue #11 : Do :
**Issue Title:** `[Order 10] Frontend Auth UI, Role-Aware Navigation & Resource Catalog Page`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `src/components/Navbar.tsx`
Create `src/components/Navbar.tsx` with the following contents:
```tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "#111827",
        color: "#ffffff",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
        Campus Club Resource Exchange
      </div>
      <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.95rem" }}>
        <Link href="/" style={{ color: "#e5e7eb", textDecoration: "none" }}>Catalog</Link>
        <Link href="/requests" style={{ color: "#e5e7eb", textDecoration: "none" }}>Requests & Conflicts</Link>
        <Link href="/coordinator" style={{ color: "#e5e7eb", textDecoration: "none" }}>Coordinator Portal</Link>
        <Link href="/admin" style={{ color: "#e5e7eb", textDecoration: "none" }}>Admin Analytics</Link>
      </div>
    </nav>
  );
}
```

### Step 2: Update File `src/app/page.tsx`
Replace `src/app/page.tsx` with the following contents:
```tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CatalogPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState("");

  async function loadResources() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (condition) params.set("condition", condition);
    const res = await fetch(`/api/resources?${params.toString()}`);
    const data = await res.json();
    setResources(data.resources || []);
  }

  useEffect(() => {
    loadResources();
  }, [condition]);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Club Resource Catalog</h1>
        <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
          Search structured MySQL inventory alongside flexible MongoDB technical specifications.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Full-text search resources (e.g., Canon, Projector, XLR)..."
            style={{ flex: 1, padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: 6 }}
          />
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: 6 }}
          >
            <option value="">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needs_maintenance">Needs Maintenance</option>
          </select>
          <button
            onClick={loadResources}
            style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}
          >
            Search
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {resources.map((r) => (
            <div
              key={r.resource_id}
              style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>{r.resource_name}</strong>
                <span style={{ fontSize: "0.8rem", background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: 12 }}>
                  {r.category_name}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.75rem" }}>{r.description}</p>
              <div style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>
                <div><strong>Owner Club:</strong> {r.owner_club_name}</div>
                <div><strong>Location:</strong> {r.location}</div>
                <div><strong>Condition:</strong> {r.condition}</div>
                <div><strong>Available:</strong> {r.quantity_currently_available} / {r.quantity_total}</div>
              </div>
              {r.mongo_specs?.specifications && (
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed #e5e7eb", fontSize: "0.8rem" }}>
                  <strong>MongoDB Technical Specs:</strong>
                  <pre style={{ marginTop: 4, whiteSpace: "pre-wrap", color: "#374151" }}>
                    {JSON.stringify(r.mongo_specs.specifications, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Step 3: Commands for Aaryesh to Run
```bash
git checkout aaryesh
git add src/components/Navbar.tsx
git commit -m "feat(ui): add role-aware navigation bar component (#11)"
git add src/app/page.tsx
git commit -m "feat(ui): build hybrid MySQL + MongoDB resource catalog page (Closes #11)"
git push origin aaryesh
```

---

## Order 11 — Hemaksh : Issue #12 : Do :
**Issue Title:** `[Order 11] Frontend Request Reservation Modal, Conflict Alerts & Coordinator Portal`  
**Assignee:** `Hemaksh-b`  
**Branch:** `hemaksh`

### Step 1: Create File `src/app/requests/page.tsx`
Create `src/app/requests/page.tsx` with the following contents:
```tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function RequestsPage() {
  const [clubId, setClubId] = useState("2");
  const [resourceId, setResourceId] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [startTime, setStartTime] = useState("2026-11-05T10:00");
  const [endTime, setEndTime] = useState("2026-11-05T14:00");
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function checkConflict() {
    const params = new URLSearchParams({
      resourceId,
      quantity,
      startTime,
      endTime,
    });
    const res = await fetch(`/api/requests/conflicts?${params.toString()}`);
    const data = await res.json();
    setConflictInfo(data);
  }

  async function submitRequest(targetResourceId = resourceId) {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        club_id: Number(clubId),
        resource_id: Number(targetResourceId),
        purpose,
        quantity_requested: Number(quantity),
        start_time: startTime,
        end_time: endTime,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Request #${data.request.request_id} created successfully!`);
    } else {
      setMessage(`Error: ${data.error}`);
    }
  }

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 850, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Request Resource & Conflict Detection</h1>
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 8, border: "1px solid #e5e7eb", marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
          <label>
            Requesting Club ID:
            <input value={clubId} onChange={(e) => setClubId(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Resource ID:
            <input value={resourceId} onChange={(e) => setResourceId(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Quantity Requested:
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <label>
            Purpose:
            <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Event or workshop purpose" style={{ width: "100%", padding: "0.5rem" }} />
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label style={{ flex: 1 }}>
              Start Time:
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
            </label>
            <label style={{ flex: 1 }}>
              End Time:
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
            </label>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={checkConflict} style={{ padding: "0.6rem 1rem", background: "#4b5563", color: "#fff", border: "none", borderRadius: 6 }}>
              Check Scheduling Conflict
            </button>
            <button onClick={() => submitRequest()} style={{ padding: "0.6rem 1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}>
              Submit Request
            </button>
          </div>
          {message && <p style={{ fontWeight: 600 }}>{message}</p>}
        </div>

        {conflictInfo && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: 8, background: conflictInfo.conflict?.has_conflict ? "#fef2f2" : "#ecfdf5", border: "1px solid #d1d5db" }}>
            <h3>{conflictInfo.conflict?.has_conflict ? "Scheduling Conflict Detected!" : "No Conflict — Resource Available"}</h3>
            <p>Available Quantity in Window: {conflictInfo.conflict?.quantity_available}</p>
            {conflictInfo.alternatives?.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h4>Suggested Alternative Resources (Same Category):</h4>
                {conflictInfo.alternatives.map((alt: any) => (
                  <div key={alt.resource_id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #e5e7eb" }}>
                    <span>{alt.resource_name} ({alt.owner_club_name}) — Available: {alt.available_qty}</span>
                    <button onClick={() => submitRequest(String(alt.resource_id))} style={{ padding: "0.3rem 0.75rem", background: "#059669", color: "#fff", border: "none", borderRadius: 4 }}>
                      Request This Instead
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
```

### Step 2: Create File `src/app/coordinator/page.tsx`
Create `src/app/coordinator/page.tsx` with the following contents:
```tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function CoordinatorPortal() {
  const [requests, setRequests] = useState<any[]>([]);

  async function loadRequests() {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data.requests || []);
  }

  async function handleAction(action: string, requestId: number, allocationId?: number) {
    await fetch("/api/allocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, request_id: requestId, allocation_id: allocationId, approved_by: 4 }),
    });
    loadRequests();
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Coordinator Approval & Return Portal</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={{ padding: "0.75rem" }}>ID</th>
              <th style={{ padding: "0.75rem" }}>Resource</th>
              <th style={{ padding: "0.75rem" }}>Borrowing Club</th>
              <th style={{ padding: "0.75rem" }}>Qty</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.request_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.75rem" }}>#{r.request_id}</td>
                <td style={{ padding: "0.75rem" }}>{r.resource_name}</td>
                <td style={{ padding: "0.75rem" }}>{r.requesting_club_name}</td>
                <td style={{ padding: "0.75rem" }}>{r.quantity_requested}</td>
                <td style={{ padding: "0.75rem" }}>{r.status} {r.allocation_status ? `(${r.allocation_status})` : ""}</td>
                <td style={{ padding: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => handleAction("approve", r.request_id)} style={{ padding: "0.35rem 0.7rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4 }}>
                        Approve
                      </button>
                      <button onClick={() => handleAction("reject", r.request_id)} style={{ padding: "0.35rem 0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 4 }}>
                        Reject
                      </button>
                    </>
                  )}
                  {r.allocation_status === "allocated" && (
                    <button onClick={() => handleAction("return", r.request_id, r.allocation_id)} style={{ padding: "0.35rem 0.7rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }}>
                      Mark Returned
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
```

### Step 3: Commands for Hemaksh to Run
```bash
git checkout hemaksh
git add src/app/requests/page.tsx
git commit -m "feat(ui): build resource request form with conflict detection and alternatives (#12)"
git add src/app/coordinator/page.tsx
git commit -m "feat(ui): build coordinator approval and resource return portal (Closes #12)"
git push origin hemaksh
```

---

## Order 12 — Aaryesh : Issue #13 : Do :
**Issue Title:** `[Order 12] Frontend Admin Analytics Dashboard & Final Documentation`  
**Assignee:** `aaryesh246`  
**Branch:** `aaryesh`

### Step 1: Create File `src/app/admin/page.tsx`
Create `src/app/admin/page.tsx` with the following contents:
```tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
        <h1>Administrative Utilization & Analytics Dashboard</h1>
        {!data ? (
          <p style={{ marginTop: "1rem" }}>Loading analytics...</p>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Frequently Requested Resources</h2>
              <ul>
                {data.frequentlyRequested?.map((item: any) => (
                  <li key={item.resource_id} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.resource_name}</strong> ({item.owner_club}) — {item.request_count} requests ({item.total_units_requested} units)
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Inter-Club Borrowing Patterns</h2>
              <ul>
                {data.borrowingPatterns?.map((item: any, idx: number) => (
                  <li key={idx} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.borrowing_club}</strong> borrowed from <strong>{item.lending_club}</strong>: {item.total_exchanges} requests ({item.approved_exchanges} approved)
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ background: "#fff", padding: "1.25rem", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <h2>Underutilized Assets</h2>
              <ul>
                {data.underutilized?.map((item: any) => (
                  <li key={item.resource_id} style={{ marginTop: "0.5rem" }}>
                    <strong>{item.resource_name}</strong> ({item.owner_club}) — {item.lifetime_request_count} lifetime requests
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
```

### Step 2: Create File `docs/DATA_DICTIONARY_AND_QUERIES.md`
Create `docs/DATA_DICTIONARY_AND_QUERIES.md` with the following contents:
```markdown
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
```

### Step 3: Commands for Aaryesh to Run
```bash
git checkout aaryesh
git add src/app/admin/page.tsx
git commit -m "feat(ui): build admin analytics dashboard for utilization and borrowing patterns (#13)"
git add docs/DATA_DICTIONARY_AND_QUERIES.md
git commit -m "docs: add data dictionary, database justification, and advanced feature summary (Closes #13)"
git push origin aaryesh
```

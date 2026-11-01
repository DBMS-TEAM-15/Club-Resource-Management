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

-- ============================================================
-- Campus Club Resource Exchange and Intelligent Allocation System
-- ============================================================
 
CREATE DATABASE campus_club_resource_exchange;
 
USE campus_club_resource_exchange;
 
-- ============================================================
-- 1. USER  (supertype entity)
-- ============================================================
CREATE TABLE USER (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- ============================================================
-- 2. CLUB
-- ============================================================
CREATE TABLE CLUB (
    club_id      INT AUTO_INCREMENT PRIMARY KEY,
    club_name    VARCHAR(100) NOT NULL UNIQUE,
    description  TEXT,
    category     VARCHAR(100),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- ============================================================
-- 3. STUDENT (ISA subtype of USER)
-- ============================================================
CREATE TABLE STUDENT (
    user_id   INT PRIMARY KEY,
    roll_no   VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES USER(user_id)
);
 
-- ============================================================
-- 4. CLUB_OFFICER (ISA subtype of USER)
-- ============================================================
CREATE TABLE CLUB_OFFICER (
    user_id    INT PRIMARY KEY,
    club_role  VARCHAR(100),
    CONSTRAINT fk_officer_user FOREIGN KEY (user_id) REFERENCES USER(user_id)
);
 
-- ============================================================
-- 5. ADMIN (ISA subtype of USER)
-- ============================================================
CREATE TABLE ADMIN (
    user_id       INT PRIMARY KEY,
    admin_level   VARCHAR(50),
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES USER(user_id)
);
 
-- ============================================================
-- 6. USER_CLUB (junction table for BELONGS_TO)
-- ============================================================
CREATE TABLE USER_CLUB (
    user_id  INT NOT NULL,
    club_id  INT NOT NULL,
    PRIMARY KEY (user_id, club_id),
    CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES USER(user_id),
    CONSTRAINT fk_uc_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id)
);
 
-- ============================================================
-- 7. RESOURCE_CATEGORY
-- ============================================================
CREATE TABLE RESOURCE_CATEGORY (
    category_id    INT AUTO_INCREMENT PRIMARY KEY,
    category_name  VARCHAR(100) NOT NULL UNIQUE
);
 
-- ============================================================
-- 8. RESOURCE  (owned by CLUB via ADDS, tagged via HAS_CATEGORY)
-- ============================================================
CREATE TABLE RESOURCE (
    resource_id      INT AUTO_INCREMENT PRIMARY KEY,
    club_id          INT NOT NULL,
    category_id      INT NOT NULL,
    name             VARCHAR(150) NOT NULL,
    description      TEXT,
    quantity_total   INT NOT NULL DEFAULT 1,
    location         VARCHAR(150),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id),
    CONSTRAINT fk_resource_category FOREIGN KEY (category_id) REFERENCES RESOURCE_CATEGORY(category_id),
    CONSTRAINT chk_resource_qty CHECK (quantity_total >= 0)
);
 
CREATE INDEX idx_resource_club ON RESOURCE(club_id);
CREATE INDEX idx_resource_category ON RESOURCE(category_id);
CREATE INDEX idx_resource_condition ON RESOURCE(`condition`);
 
-- ============================================================
-- 9. REQUEST  (CREATES from CLUB, FOR a RESOURCE)
-- ============================================================
CREATE TABLE REQUEST (
    request_id           INT AUTO_INCREMENT PRIMARY KEY,
    club_id              INT NOT NULL,
    resource_id          INT NOT NULL,
    purpose              VARCHAR(255),
    quantity_requested   INT NOT NULL,
    request_date         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status               ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
    CONSTRAINT fk_request_club FOREIGN KEY (club_id) REFERENCES CLUB(club_id),
    CONSTRAINT fk_request_resource FOREIGN KEY (resource_id) REFERENCES RESOURCE(resource_id),
    CONSTRAINT chk_request_qty CHECK (quantity_requested > 0)
);
 
CREATE INDEX idx_request_status ON REQUEST(status);
CREATE INDEX idx_request_date ON REQUEST(request_date);
 
-- ============================================================
-- 10. ALLOCATION  (FULFILLED_BY REQUEST, APPROVED_BY USER)
-- ============================================================
CREATE TABLE ALLOCATION (
    allocation_id        INT AUTO_INCREMENT PRIMARY KEY,
    request_id           INT NOT NULL,
    allocated_date        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity_allocated    INT NOT NULL,
    status                 ENUM('allocated','returned','cancelled') DEFAULT 'allocated',
    approved_by            INT NULL,
    CONSTRAINT fk_allocation_request FOREIGN KEY (request_id) REFERENCES REQUEST(request_id),
    CONSTRAINT fk_allocation_approver FOREIGN KEY (approved_by) REFERENCES USER(user_id),
    CONSTRAINT chk_allocation_qty CHECK (quantity_allocated > 0)
);
 
CREATE INDEX idx_allocation_request ON ALLOCATION(request_id);
CREATE INDEX idx_allocation_status ON ALLOCATION(status);
 
-- ============================================================
-- 11. NOTIFICATION  (RECEIVES from USER)
-- ============================================================
CREATE TABLE NOTIFICATION (
    notification_id  INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    message          TEXT NOT NULL,
    type             VARCHAR(50),
    is_read          BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES USER(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 
CREATE INDEX idx_notification_user ON NOTIFICATION(user_id, is_read);


-- ============================================================
-- 12. NOW, TO SHOW THE STRUCTURES OF THE TABLES CREATED
-- ============================================================
DESCRIBE USER;
DESCRIBE CLUB;
DESCRIBE STUDENT;
DESCRIBE CLUB_OFFICER;
DESCRIBE ADMIN;
DESCRIBE USER_CLUB;
DESCRIBE RESOURCE_CATEGORY;
DESCRIBE RESOURCE;
DESCRIBE REQUEST;
DESCRIBE ALLOCATION;
DESCRIBE NOTIFICATION;
 
-- ============================================================
-- 13. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (USER)
-- ============================================================

INSERT INTO USER (name, email, password_hash, phone) VALUES
('Aditi Rao', 'aditi@example.com', 'hash_pw_1', '9876543210'),
('Rohan Mehta', 'rohan@example.com', 'hash_pw_2', '9876500001'),
('Sara Khan', 'sara@example.com', 'hash_pw_3', '9876500002'),
('Vikram Singh', 'vikram@example.com', 'hash_pw_4', '9876500003'),
('Priya Nair', 'priya@example.com', 'hash_pw_5', '9876500004');

SELECT * FROM USER;

-- ============================================================
-- 14. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (CLUB)
-- ============================================================

INSERT INTO CLUB (club_name, description, category) VALUES
('Photography Club', 'Handles campus photo and video coverage', 'Media'),
('Robotics Club', 'Builds and competes with robots', 'Technical'),
('Drama Society', 'Organizes theatre and stage events', 'Cultural');

SELECT * FROM CLUB;

-- ============================================================
-- 15. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (STUDENT)
-- ============================================================

INSERT INTO STUDENT (user_id, roll_no) VALUES
(1, 'CS2023001'),
(3, 'EC2023045');

SELECT * FROM STUDENT;

-- ============================================================
-- 16. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (CLUB_OFFICER)
-- ============================================================

INSERT INTO CLUB_OFFICER (user_id, club_role) VALUES
(2, 'President - Robotics Club'),
(5, 'Secretary - Drama Society');

SELECT * FROM CLUB_OFFICER;

-- ============================================================
-- 17. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (ADMIN)
-- ============================================================

INSERT INTO ADMIN (user_id, admin_level) VALUES
(4, 'Super Admin');

SELECT * FROM ADMIN;

-- ============================================================
-- 18. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (USER_CLUB)
-- ============================================================

INSERT INTO USER_CLUB (user_id, club_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(3, 3),
(5, 3);

SELECT * FROM USER_CLUB;

-- ============================================================
-- 19. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (RESOURCE_CATEGORY)
-- ============================================================

INSERT INTO RESOURCE_CATEGORY (category_name) VALUES
('Camera'),
('Projector'),
('Microphone');

SELECT * FROM RESOURCE_CATEGORY;

-- ============================================================
-- 20. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (RESOURCE)
-- ============================================================

INSERT INTO RESOURCE (club_id, category_id, name, description, quantity_total, location) VALUES
(1, 1, 'Canon EOS 200D', 'DSLR camera with 18-55mm lens', 2, 'Media Room A1'),
(2, 2, 'Epson EX3260 Projector', 'Portable projector for demos', 1, 'Robotics Lab'),
(3, 3, 'Shure SM58 Microphone', 'Wired dynamic mic for stage use', 4, 'Drama Store Room');

SELECT * FROM RESOURCE;

-- ============================================================
-- 20. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (REQUEST)
-- ============================================================

INSERT INTO REQUEST (club_id, resource_id, purpose, quantity_requested, status) VALUES
(2, 1, 'Recording robotics demo for annual showcase', 1, 'approved'),
(3, 2, 'Projector needed for play rehearsal briefing', 1, 'pending'),
(1, 3, 'Mic needed for photography club annual meet', 2, 'rejected');

SELECT * FROM REQUEST;

-- ============================================================
-- 20. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (ALLOCATION)
-- ============================================================

INSERT INTO ALLOCATION (request_id, quantity_allocated, status, approved_by) VALUES
(1, 1, 'allocated', 4),
(1, 1, 'returned', 4),
(2, 1, 'cancelled', NULL);

SELECT * FROM ALLOCATION;

-- ============================================================
-- 21. WE CAN ADD SAMPLE DATA IN EACH TABLE, AND VERIFY (NOTIFICATION)
-- ============================================================

INSERT INTO NOTIFICATION (user_id, message, type, is_read) VALUES
(2, 'Your request for Canon EOS 200D has been approved.', 'request_update', TRUE),
(5, 'Your request for Epson EX3260 Projector is pending review.', 'request_update', FALSE),
(1, 'Your request for Shure SM58 Microphone was rejected due to unavailability.', 'request_update', FALSE);

SELECT * FROM NOTIFICATION;

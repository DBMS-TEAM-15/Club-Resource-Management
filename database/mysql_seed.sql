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

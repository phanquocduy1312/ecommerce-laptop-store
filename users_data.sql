-- Sample data for users (người dùng)
-- Password: 123456 (bcrypt hash)
INSERT INTO users (id, email, mat_khau, ho_ten, vai_tro, khoa) VALUES
(1, 'admin@example.com', '$2b$10$X7Op/LwJ1v5Z1F5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'Admin User', 1, 0),
(2, 'user@example.com', '$2b$10$X7Op/LwJ1v5Z1F5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'Regular User', 0, 0);

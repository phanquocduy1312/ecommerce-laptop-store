-- Database schema for laptop store
-- Compatible with most SQL editors

CREATE TABLE IF NOT EXISTS loai (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_loai VARCHAR(100) NOT NULL,
  hinh_icon VARCHAR(255),
  slug VARCHAR(100),
  thu_tu INT DEFAULT 0,
  an_hien INT DEFAULT 1,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS san_pham (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_sp VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  gia INT DEFAULT 0,
  gia_km INT DEFAULT 0,
  id_loai INT NOT NULL,
  ngay DATE,
  hinh VARCHAR(255),
  hot INT DEFAULT 0,
  luot_xem INT DEFAULT 0,
  an_hien INT DEFAULT 1,
  tinh_chat INT DEFAULT 0,
  mo_ta TEXT,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS don_hang (
  id INT PRIMARY KEY AUTO_INCREMENT,
  thoi_diem_mua TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ho_ten VARCHAR(255),
  email VARCHAR(255),
  dien_thoai VARCHAR(20),
  dia_chi TEXT,
  ghi_chu TEXT,
  tong_tien DECIMAL(10,2) DEFAULT 0,
  trang_thai INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS don_hang_chi_tiet (
  id_ct INT PRIMARY KEY AUTO_INCREMENT,
  id_dh INT NOT NULL,
  id_sp INT NOT NULL,
  so_luong INT DEFAULT 1,
  gia DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  mat_khau VARCHAR(255) NOT NULL,
  ho_ten VARCHAR(255) NOT NULL,
  vai_tro INT DEFAULT 0,
  khoa INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS password_reset_otp (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS thuoc_tinh (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_sp INT NOT NULL,
  cpu VARCHAR(255),
  ram VARCHAR(255),
  gpu VARCHAR(255),
  dia_cung VARCHAR(255),
  man_hinh VARCHAR(255),
  pin VARCHAR(255),
  cong_ket_noi VARCHAR(255),
  mau_sac VARCHAR(255),
  can_nang VARCHAR(255),
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS loai_tin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_loai VARCHAR(100) NOT NULL,
  slug VARCHAR(100),
  thu_tu INT DEFAULT 0,
  an_hien INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tin_tuc (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tieu_de VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  mo_ta VARCHAR(1000),
  hinh VARCHAR(255),
  ngay DATE,
  noi_dung TEXT,
  id_loai INT DEFAULT 0,
  luot_xem INT DEFAULT 0,
  hot INT DEFAULT 0,
  an_hien INT DEFAULT 1,
  tags VARCHAR(2000)
);

-- Sample data for loai (categories)
INSERT INTO loai (id, ten_loai, hinh_icon, slug, thu_tu, an_hien, created_at, updated_at) VALUES
(1, 'Asus', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453550/asus_ng92fh.png', 'asus', 14, 1, NULL, '2026-04-09 06:33:35'),
(2, 'Acer', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453462/acer_zbpczp.png', NULL, 3, 1, NULL, NULL),
(3, 'Lenovo', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453420/Lenevo_cqp7ec.png', NULL, 2, 1, NULL, NULL),
(4, 'MSI', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453424/msi_mtwhbs.png', 'msi', 5, 0, NULL, '2024-06-02 20:10:31'),
(5, 'HP', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453419/hp_ay0eat.png', NULL, 4, 1, NULL, NULL),
(6, 'Dell', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453419/dell_xlui53.png', 'dell', 11, 1, NULL, '2024-06-04 23:11:54'),
(7, 'Apple', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453419/Macbook_ny4e0k.png', NULL, 6, 1, NULL, NULL),
(8, 'Surface', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453424/sur_chmhje.png', NULL, 7, 1, NULL, NULL),
(9, 'Masstel', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453420/masstel_oxfw5l.webp', NULL, 8, 1, NULL, NULL),
(10, 'LG', 'https://res.cloudinary.com/dhpjqsng9/image/upload/v1774453418/lg_yn8rbu.webp', NULL, 9, 1, NULL, NULL);

-- Sample data for loai_tin (news categories)
INSERT INTO loai_tin (id, ten_loai, slug, thu_tu, an_hien) VALUES
(1, 'Sức khỏe', 'suc-khoe', 7, 1),
(2, 'Sống đẹp', 'song-dep', 1, 1),
(3, 'Mẹo vặt', 'meo-vat', 6, 1),
(4, 'Chia sẻ', 'chia-se', 5, 1);

-- Sample data for don_hang (orders)
INSERT INTO don_hang (id, thoi_diem_mua, ho_ten, email, dien_thoai, dia_chi, ghi_chu, tong_tien, trang_thai) VALUES
(1, '2026-03-28 03:58:15', 'phan Quoc Duy', 'phanquocduy1312@gmail.com', '0921808483', '845, Xã Phú Sơn, Huyện Gia Lâm, Hà Nội', 'đwd', 52066572.00, 0),
(2, '2026-03-28 04:01:11', 'phan Quoc Duy', 'phanquocduy1312@gmail.com', '0921808483', '845, Xã Hiệp Lực, Huyện Ninh Giang, Hải Dương', 'ttt', 17355524.00, 0),
(3, '2026-03-28 05:58:34', 'phan Quoc Duy', 'duycc771@gmail.com', '0921808483', '845, Xã Thanh Giang, Huyện Thanh Miện, Hải Dương', 'giao sớm', 29147566.00, 3);

-- Sample data for don_hang_chi_tiet (order details)
INSERT INTO don_hang_chi_tiet (id_ct, id_dh, id_sp, so_luong, gia) VALUES
(1, 1, 4062, 3, 17355524.00),
(2, 2, 4062, 1, 17355524.00),
(3, 3, 1112, 2, 14573783.00);

-- Sample data for san_pham (products) - 200 products
-- See products_200.sql for full list of 200 products
-- Run: type products_200.sql >> database_simple.sql (Windows)

-- Sample data for users (người dùng)
-- Password: 123456 (bcrypt hash)
INSERT INTO users (id, email, mat_khau, ho_ten, vai_tro, khoa) VALUES
(1, 'admin@example.com', '$2b$10$X7Op/LwJ1v5Z1F5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'Admin User', 1, 0),
(2, 'user@example.com', '$2b$10$X7Op/LwJ1v5Z1F5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'Regular User', 0, 0);

-- Sample data for thuoc_tinh (thuộc tính sản phẩm) - 200 products
-- See thuoc_tinh_data.sql for full list
-- Run: type thuoc_tinh_data.sql >> database_simple.sql (Windows)

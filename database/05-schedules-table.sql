-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenbomon NVARCHAR(100) NOT NULL,
  goi_id INT NOT NULL,
  hluyen_id INT NOT NULL,
  thu NVARCHAR(50) NOT NULL,
  gio VARCHAR(20) NOT NULL,
  phongtap NVARCHAR(100) NOT NULL,
  sisotoida INT DEFAULT 20,
  sisohientai INT DEFAULT 0,
  trangthai ENUM('đang mở', 'đã đóng', 'hủy') DEFAULT 'đang mở',
  trang_thai_duyet ENUM('chờ duyệt', 'đã duyệt', 'từ chối') DEFAULT 'chờ duyệt',
  danh_sach_hlv_dang_ky JSON NOT NULL DEFAULT '[]' COMMENT 'Array of trainer registrations',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (goi_id) REFERENCES packages(id) ON DELETE RESTRICT,
  FOREIGN KEY (hluyen_id) REFERENCES trainers(id) ON DELETE RESTRICT,
  INDEX idx_goi_id (goi_id),
  INDEX idx_hluyen_id (hluyen_id),
  INDEX idx_trangthai (trangthai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default schedules
INSERT INTO schedules (tenbomon, goi_id, hluyen_id, thu, gio, phongtap, sisotoida, sisohientai, trangthai, trang_thai_duyet) VALUES
  ('MMA Cơ Bản', 1, 1, 'Thứ 2,4,6', '06:00–07:30', 'Sàn MMA', 20, 15, 'đang mở', 'đã duyệt'),
  ('Muay Thai Nâng Cao', 2, 2, 'Thứ 3,5,7', '17:30–19:00', 'Sàn Muay', 15, 12, 'đang mở', 'đã duyệt'),
  ('Jiu-Jitsu Cơ Bản', 1, 3, 'Thứ 2,4,6', '19:00–20:30', 'Sàn Judo', 12, 10, 'đang mở', 'đã duyệt'),
  ('Boxing Cơ Bản', 1, 1, 'Thứ 3,5', '07:30–09:00', 'Sàn Boxing', 18, 8, 'đang mở', 'đã duyệt');

-- Add session limit field to packages
ALTER TABLE packages ADD COLUMN IF NOT EXISTS buoi INT DEFAULT 8 COMMENT 'Number of sessions included in package' AFTER thang;

-- Create member class enrollment tracking table
CREATE TABLE IF NOT EXISTS hoc_vien_dang_ky_lop (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hv_id INT NOT NULL COMMENT 'Member ID',
  goi_id INT NOT NULL COMMENT 'Package ID',
  lich_hoc_id INT NOT NULL COMMENT 'Schedule/Class ID',
  so_buoi_da_su_dung INT DEFAULT 0 COMMENT 'Sessions already used',
  so_buoi_con_lai INT COMMENT 'Sessions remaining',
  trang_thai ENUM('đang học', 'tạm dừng', 'kết thúc') DEFAULT 'đang học',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (hv_id) REFERENCES hoc_vien(mahv) ON DELETE CASCADE,
  FOREIGN KEY (goi_id) REFERENCES packages(id) ON DELETE CASCADE,
  INDEX idx_hv_id (hv_id),
  INDEX idx_goi_id (goi_id),
  INDEX idx_lich_hoc_id (lich_hoc_id),
  UNIQUE KEY unique_enrollment (hv_id, lich_hoc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Track member enrollments in specific classes with session limits';

-- Create attendance tracking table
CREATE TABLE IF NOT EXISTS diem_danh_lop (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hv_id INT NOT NULL COMMENT 'Member ID',
  lich_hoc_id INT NOT NULL COMMENT 'Schedule/Class ID',
  ngay_hoc DATE NOT NULL,
  trang_thai ENUM('có mặt', 'vắng', 'vắng không phép', 'xin phép') DEFAULT 'có mặt',
  ghi_chu VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (hv_id) REFERENCES hoc_vien(mahv) ON DELETE CASCADE,
  INDEX idx_hv_id (hv_id),
  INDEX idx_lich_hoc_id (lich_hoc_id),
  INDEX idx_ngay_hoc (ngay_hoc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Track attendance for each member in each class';

-- Update packages with session numbers
UPDATE packages SET buoi = 8 WHERE ten = 'Gói Chiến Binh';
UPDATE packages SET buoi = 12 WHERE ten = 'Gói Chiến Thần';
UPDATE packages SET buoi = 999 WHERE ten = 'Gói Vô Địch';

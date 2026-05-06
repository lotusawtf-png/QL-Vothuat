-- Add approval workflow columns to lich_hoc table
ALTER TABLE lich_hoc ADD COLUMN IF NOT EXISTS trang_thai_duyet ENUM('chờ duyệt', 'đã duyệt', 'từ chối') DEFAULT 'chờ duyệt' COMMENT 'Trạng thái duyệt lịch từ manager/admin' AFTER trangthai;

ALTER TABLE lich_hoc ADD COLUMN IF NOT EXISTS danh_sach_hlv_dang_ky JSON DEFAULT '[]' COMMENT 'Array of trainer IDs who registered for this schedule' AFTER trang_thai_duyet;

ALTER TABLE lich_hoc ADD COLUMN IF NOT EXISTS ly_do_tu_choi VARCHAR(500) COMMENT 'Reason for rejection' AFTER danh_sach_hlv_dang_ky;

-- Add index for approval status
ALTER TABLE lich_hoc ADD INDEX idx_trang_thai_duyet (trang_thai_duyet);

-- Create registration table for better tracking
CREATE TABLE IF NOT EXISTS lich_hoc_dang_ky (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lich_hoc_id INT NOT NULL,
  hlv_id INT NOT NULL,
  trang_thai ENUM('chờ duyệt', 'đã duyệt', 'từ chối', 'hủy') DEFAULT 'chờ duyệt' COMMENT 'Trainer registration status',
  ly_do_tu_choi VARCHAR(500) COMMENT 'Reason for rejection',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (lich_hoc_id) REFERENCES lich_hoc(malich) ON DELETE CASCADE,
  INDEX idx_lich_hoc_id (lich_hoc_id),
  INDEX idx_hlv_id (hlv_id),
  INDEX idx_trang_thai (trang_thai),
  UNIQUE KEY unique_registration (lich_hoc_id, hlv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Track trainer schedule registrations';

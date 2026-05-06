-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hlv_id INT NOT NULL,
  hocvien_id INT NOT NULL,
  lichid INT NOT NULL,
  ngay DATE NOT NULL,
  trangthai ENUM('có mặt', 'vắng mặt') NOT NULL,
  ghichu TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hlv_id) REFERENCES trainers(id) ON DELETE RESTRICT,
  FOREIGN KEY (hocvien_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (lichid) REFERENCES schedules(id) ON DELETE CASCADE,
  INDEX idx_hlv_id (hlv_id),
  INDEX idx_hocvien_id (hocvien_id),
  INDEX idx_lichid (lichid),
  INDEX idx_ngay (ngay),
  UNIQUE KEY unique_attendance (hlv_id, hocvien_id, lichid, ngay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default attendance records
INSERT INTO attendance (hlv_id, hocvien_id, lichid, ngay, trangthai, ghichu) VALUES
  (1, 1, 1, '2025-05-01', 'có mặt', ''),
  (2, 2, 2, '2025-05-01', 'có mặt', ''),
  (1, 3, 1, '2025-05-01', 'vắng mặt', 'Bệnh'),
  (1, 1, 1, '2025-04-29', 'có mặt', '');

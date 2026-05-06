-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hoten NVARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  sdt VARCHAR(20) NOT NULL,
  chuyenmon NVARCHAR(255) NOT NULL,
  kinhnghiem INT NOT NULL COMMENT 'Years of experience',
  trangthai ENUM('đang làm', 'nghỉ', 'tạm nghỉ') DEFAULT 'đang làm',
  luong BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_trangthai (trangthai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default trainers
INSERT INTO trainers (hoten, email, sdt, chuyenmon, kinhnghiem, trangthai, luong) VALUES
  ('HLV Minh Tuấn', 'tuan@vnb.vn', '0901111111', 'MMA, Boxing', 8, 'đang làm', 15000000),
  ('HLV Thanh Hà', 'ha@vnb.vn', '0902222222', 'Muay Thai, Kickboxing', 6, 'đang làm', 12000000),
  ('HLV Quốc Khánh', 'khanh@vnb.vn', '0903333333', 'Jiu-Jitsu, Wrestling', 10, 'đang làm', 18000000);

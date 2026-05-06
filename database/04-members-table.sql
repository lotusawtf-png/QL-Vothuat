-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hoten NVARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  sdt VARCHAR(20) NOT NULL,
  magoi JSON NOT NULL DEFAULT '[]' COMMENT 'Array of package IDs',
  tiendo ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  trangthai ENUM('đang tập', 'tạm nghỉ', 'kết thúc') DEFAULT 'đang tập',
  ngaydangky DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_trangthai (trangthai),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default members
INSERT INTO members (hoten, email, sdt, magoi, tiendo, trangthai, ngaydangky) VALUES
  ('Trần Thị Bích', 'bich@gmail.com', '0901234567', '[1]', 'Beginner', 'đang tập', '2025-01-10'),
  ('Nguyễn Hoàng Nam', 'nam@gmail.com', '0912345678', '[2]', 'Intermediate', 'đang tập', '2025-02-01'),
  ('Lê Văn Hùng', 'hung@gmail.com', '0923456789', '[1]', 'Beginner', 'tạm nghỉ', '2025-01-20'),
  ('Phạm Thị Lan', 'lan@gmail.com', '0934567890', '[3]', 'Advanced', 'đang tập', '2024-12-01');

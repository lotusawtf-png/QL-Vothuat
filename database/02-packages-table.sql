-- Create packages table for training packages
CREATE TABLE IF NOT EXISTS packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten NVARCHAR(100) NOT NULL,
  gia BIGINT NOT NULL COMMENT 'Price in VND',
  thang INT NOT NULL COMMENT 'Duration in months',
  mota NVARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default packages
INSERT INTO packages (ten, gia, thang, mota) VALUES
  ('Gói Chiến Binh', 800000, 1, '8 buổi/tháng'),
  ('Gói Chiến Thần', 2100000, 3, '12 buổi/tháng'),
  ('Gói Vô Địch', 3600000, 6, 'Không giới hạn');

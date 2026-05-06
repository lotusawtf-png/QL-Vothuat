-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hocvien_id INT NOT NULL,
  goi_id INT NOT NULL,
  sotien BIGINT NOT NULL COMMENT 'Amount in VND',
  phuongthuc ENUM('Tiền mặt', 'Chuyển khoản', 'QR Code') NOT NULL,
  trangthai ENUM('chờ xác nhận', 'đã thanh toán', 'hủy') DEFAULT 'chờ xác nhận',
  ngay DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hocvien_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (goi_id) REFERENCES packages(id) ON DELETE RESTRICT,
  INDEX idx_hocvien_id (hocvien_id),
  INDEX idx_trangthai (trangthai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default payments
INSERT INTO payments (hocvien_id, goi_id, sotien, phuongthuc, trangthai, ngay) VALUES
  (1, 1, 800000, 'Chuyển khoản', 'đã thanh toán', '2025-01-10'),
  (2, 2, 2100000, 'Tiền mặt', 'đã thanh toán', '2025-02-01'),
  (3, 1, 800000, 'QR Code', 'chờ xác nhận', '2025-03-01'),
  (4, 3, 3600000, 'Tiền mặt', 'đã thanh toán', '2024-12-01');

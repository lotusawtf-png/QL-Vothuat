CREATE DATABASE IF NOT EXISTS payment_service_db;
USE payment_service_db;

CREATE TABLE payments (
    mapaid INT AUTO_INCREMENT PRIMARY KEY,
    hocvien_id INT NOT NULL,
    hocvien_ten VARCHAR(100) NOT NULL,
    goi_id INT NOT NULL,
    goi_ten VARCHAR(100) NOT NULL,
    sotien DECIMAL(12,2) NOT NULL,
    phuongthuc ENUM('Tiền mặt', 'Chuyển khoản', 'QR Code') NOT NULL,
    trangthai ENUM('đã thanh toán', 'chờ xác nhận', 'thất bại') DEFAULT 'chờ xác nhận',
    ngay DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payments (mapaid, hocvien_id, hocvien_ten, goi_id, goi_ten, sotien, phuongthuc, trangthai, ngay) VALUES
(1, 1, 'Trần Thị Bích', 1, 'Gói Chiến Binh', 800000, 'Chuyển khoản', 'đã thanh toán', '2025-01-10'),
(2, 2, 'Nguyễn Hoàng Nam', 2, 'Gói Chiến Thần', 2100000, 'Tiền mặt', 'đã thanh toán', '2025-02-01'),
(3, 3, 'Lê Văn Hùng', 1, 'Gói Chiến Binh', 800000, 'QR Code', 'chờ xác nhận', '2025-03-01'),
(4, 4, 'Phạm Thị Lan', 3, 'Gói Vô Địch', 3600000, 'Tiền mặt', 'đã thanh toán', '2024-12-01');
CREATE DATABASE IF NOT EXISTS attendance_service_db;
USE attendance_service_db;

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hocvien_id INT NOT NULL,
    hocvien_ten VARCHAR(100) NOT NULL,
    lichid INT NOT NULL,
    lich_ten VARCHAR(100) NOT NULL,
    ngay DATE NOT NULL,
    trangthai ENUM('có mặt', 'vắng mặt', 'đến muộn') DEFAULT 'có mặt',
    ghichu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO attendance (id, hocvien_id, hocvien_ten, lichid, lich_ten, ngay, trangthai, ghichu) VALUES
(1, 1, 'Trần Thị Bích', 1, 'MMA Cơ Bản', '2025-05-01', 'có mặt', ''),
(2, 2, 'Nguyễn Hoàng Nam', 2, 'Muay Thai Nâng Cao', '2025-05-01', 'có mặt', ''),
(3, 3, 'Lê Văn Hùng', 1, 'MMA Cơ Bản', '2025-05-01', 'vắng mặt', 'Bệnh'),
(4, 1, 'Trần Thị Bích', 1, 'MMA Cơ Bản', '2025-04-29', 'có mặt', '');
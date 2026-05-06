CREATE DATABASE IF NOT EXISTS trainer_service_db;
USE trainer_service_db;

CREATE TABLE trainers (
    mahlv INT AUTO_INCREMENT PRIMARY KEY,
    hoten VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    sdt VARCHAR(15),
    chuyenmon VARCHAR(255),
    kinhnghiem INT,
    trangthai ENUM('đang làm', 'nghỉ phép', 'đã nghỉ việc') DEFAULT 'đang làm',
    luong DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO trainers (mahlv, hoten, email, sdt, chuyenmon, kinhnghiem, trangthai, luong) VALUES
(1, 'HLV Minh Tuấn', 'tuan@agoge.vn', '0901111111', 'MMA, Boxing', 8, 'đang làm', 15000000),
(2, 'HLV Thanh Hà', 'ha@agoge.vn', '0902222222', 'Muay Thai, Kickboxing', 6, 'đang làm', 12000000),
(3, 'HLV Quốc Khánh', 'khanh@agoge.vn', '0903333333', 'Jiu-Jitsu, Wrestling', 10, 'đang làm', 18000000);
CREATE DATABASE IF NOT EXISTS member_service_db;
USE member_service_db;

CREATE TABLE packages (
    magoi INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    gia DECIMAL(12,2) NOT NULL,
    thoihan INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    mahv INT AUTO_INCREMENT PRIMARY KEY,
    hoten VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    sdt VARCHAR(15),
    magoi INT,
    tiendo VARCHAR(50) DEFAULT 'Beginner',
    trangthai ENUM('đang tập', 'tạm nghỉ', 'đã nghỉ', 'hết hạn') DEFAULT 'đang tập',
    ngaydangky DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (magoi) REFERENCES packages(magoi) ON DELETE SET NULL
);

INSERT INTO packages (magoi, ten, gia, thoihan) VALUES
(1, 'Gói Chiến Binh', 800000, 1),
(2, 'Gói Chiến Thần', 2100000, 3),
(3, 'Gói Vô Địch', 3600000, 6);

INSERT INTO members (mahv, hoten, email, sdt, magoi, tiendo, trangthai, ngaydangky) VALUES
(1, 'Trần Thị Bích', 'bich@gmail.com', '0901234567', 1, 'Beginner', 'đang tập', '2025-01-10'),
(2, 'Nguyễn Hoàng Nam', 'nam@gmail.com', '0912345678', 2, 'Intermediate', 'đang tập', '2025-02-01'),
(3, 'Lê Văn Hùng', 'hung@gmail.com', '0923456789', 1, 'Beginner', 'tạm nghỉ', '2025-01-20'),
(4, 'Phạm Thị Lan', 'lan@gmail.com', '0934567890', 3, 'Advanced', 'đang tập', '2024-12-01'),
(5, 'Võ Minh Khoa', 'khoa@gmail.com', '0945678901', 1, 'Beginner', 'đã nghỉ', '2024-11-15');
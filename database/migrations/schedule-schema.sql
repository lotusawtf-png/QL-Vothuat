CREATE DATABASE IF NOT EXISTS schedule_service_db;
USE schedule_service_db;

CREATE TABLE schedules (
    malich INT AUTO_INCREMENT PRIMARY KEY,
    tenbomon VARCHAR(100) NOT NULL,
    hluyen_id INT NOT NULL,
    hluyen_ten VARCHAR(100) NOT NULL,
    thu VARCHAR(50),
    gio VARCHAR(30),
    phongtap VARCHAR(100),
    sisotoida INT DEFAULT 20,
    sisohientai INT DEFAULT 0,
    trangthai ENUM('đang mở', 'tạm đóng', 'đã kết thúc') DEFAULT 'đang mở',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO schedules (malich, tenbomon, hluyen_id, hluyen_ten, thu, gio, phongtap, sisotoida, sisohientai, trangthai) VALUES
(1, 'MMA Cơ Bản', 1, 'HLV Minh Tuấn', 'Thứ 2,4,6', '06:00–07:30', 'Sàn MMA', 20, 15, 'đang mở'),
(2, 'Muay Thai Nâng Cao', 2, 'HLV Thanh Hà', 'Thứ 3,5,7', '17:30–19:00', 'Sàn Muay', 15, 12, 'đang mở'),
(3, 'Jiu-Jitsu Cơ Bản', 3, 'HLV Quốc Khánh', 'Thứ 2,4,6', '19:00–20:30', 'Sàn Judo', 12, 10, 'đang mở'),
(4, 'Boxing Cơ Bản', 1, 'HLV Minh Tuấn', 'Thứ 3,5', '07:30–09:00', 'Sàn Boxing', 18, 8, 'đang mở');
# QL-Vothuat

Hệ thống quản lý phòng tập võ thuật với kiến trúc microservices backend và frontend React.

## Tổng quan

Dự án gồm:
- `frontend/`: ứng dụng React hiển thị giao diện quản lý và đăng nhập.
- `backend/`: các microservices Spring Boot cho authentication, member, trainer, attendance, payment, discovery và API gateway.
- `database/migrations/`: các tập tin SQL khởi tạo schema cho từng dịch vụ MySQL.
- `docker-compose.yml`: cấu hình Docker cho toàn bộ hệ thống và các MySQL container.

## Kiến trúc

Dự án sử dụng:
- React cho frontend
- Spring Boot / Java cho backend microservices
- Eureka service discovery
- API Gateway kết nối đến các microservice
- MySQL cho từng dịch vụ (auth, member, trainer, attendance, payment, schedule)
- Docker Compose để khởi chạy toàn bộ hệ thống

## Thư mục chính

- `frontend/`: mã nguồn React
- `backend/api-gateway/`: gateway xử lý yêu cầu vào
- `backend/auth-service/`: đăng nhập, quản lý người dùng
- `backend/member-service/`: quản lý học viên và gói tập
- `backend/trainer-service/`: quản lý huấn luyện viên và lịch học
- `backend/attendance-service/`: quản lý điểm danh
- `backend/payment-service/`: quản lý thanh toán
- `backend/discovery-server/`: Eureka service discovery
- `database/migrations/`: file SQL dùng để khởi tạo các database

## Chạy dự án

Toàn bộ hệ thống chạy bằng Docker Compose:

```bash
cd c:/xampp/htdocs/QL-Vothuatt/QL-Vothuat
docker compose up --build
```

Sau khi chạy, truy cập các dịch vụ:
- Frontend: `http://localhost:3000` (nếu frontend chạy riêng hoặc theo cấu hình React)
- API Gateway: `http://localhost:8080`
- Eureka Discovery: `http://localhost:8761`

### Cơ sở dữ liệu

Mỗi dịch vụ MySQL được khởi tạo bằng tập tin schema trong `database/migrations/`:
- `member-schema.sql`
- `trainer-schema.sql`
- `attendance-schema.sql`
- `auth-schema.sql`
- `payment-schema.sql`
- `schedule-schema.sql`

### Chạy frontend riêng

```bash
cd frontend
npm install
npm start
```

### Chạy backend riêng

Mỗi service backend được xây dựng với Maven và có Dockerfile riêng. Có thể chạy trực tiếp trong thư mục service tương ứng hoặc dùng Docker Compose.

## Các dịch vụ và cổng mặc định

- `discovery-server`: `8761`
- `api-gateway`: `8080`
- `member-service`: `8081`
- `trainer-service`: `8082`
- `attendance-service`: `8083`
- `auth-service`: `8084`

MySQL ports:
- `member-db`: `3306`
- `trainer-db`: `3307`
- `attendance-db`: `3308`
- `auth-db`: `3309`
- `payment-db`: `3310`
- `schedule-db`: `3311`

## Lưu ý

- Frontend sử dụng React Router và API gọi tới backend qua gateway.
- Hiện dữ liệu khởi tạo của hệ thống lưu trong các file migration và local storage của frontend.
- Nếu cần thay đổi cấu hình database hoặc cổng, cập nhật trong `docker-compose.yml` và file `application.properties`/`application.yml` của từng microservice.



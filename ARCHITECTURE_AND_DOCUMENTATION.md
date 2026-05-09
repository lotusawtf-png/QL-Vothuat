# QL-Vothuatt - Gym Management System
## Complete Architecture, Technology Stack & Documentation

**Version:** 1.0  
**Date:** May 9, 2026  
**Language:** Vietnamese / English

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [Business Logic](#business-logic)
6. [Frontend Structure](#frontend-structure)
7. [Backend Structure](#backend-structure)
8. [API Endpoints](#api-endpoints)
9. [Data Flow](#data-flow)

---

## 🎯 Project Overview

**QL-Vothuatt** là hệ thống quản lý phòng tập gym toàn diện với các chức năng:
- 👥 Quản lý học viên (members)
- 🏋️ Quản lý huấn luyện viên (trainers)
- 📅 Quản lý lịch học (schedules)
- 💳 Quản lý thanh toán (payments)
- ✅ Quản lý điểm danh (attendance)
- 🔐 Xác thực & phân quyền (authentication & authorization)

**Kiến trúc:** Microservices + React Frontend + MySQL Databases

---

## 🛠️ Technology Stack

### Frontend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| React | 18.2.0 | UI Framework |
| React Router | 6.14.0 | Client-side routing |
| Axios | 1.4.0 | HTTP requests |
| Lucide React | 1.14.0 | UI Icons |
| CSS3 | - | Styling |
| Webpack | (via CRA) | Module bundling |
| Nginx | Alpine | Production server |

### Backend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| Java | 11 (Eclipse Temurin) | Runtime |
| Spring Boot | 2.7.18 | Framework |
| Spring Cloud Eureka | Netflix | Service Discovery |
| Spring Cloud Gateway | - | API Gateway |
| Spring Data JPA | - | ORM |
| Hibernate | 5.6.15 | ORM Provider |
| MySQL Connector | 8.0.33 | Database Driver |
| JWT (jjwt) | - | Token-based auth |

### Infrastructure
| Công Nghệ | Mục Đích |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| MySQL 8.0 | Database |
| Maven 3.x | Build tool |

---

## 🏗️ System Architecture

### Microservices Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│              (localhost:3000 or :80)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                               │
│                  (localhost:8080)                            │
│                  JWT Validation                              │
│                  CORS Enabled                                │
└────┬────────────┬────────────┬────────────┬────────────────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐
│   Auth     │ │  Member    │ │  Trainer   │ │ Attendance   │
│ Service    │ │  Service   │ │  Service   │ │  Service     │
│ (8084)     │ │  (8081)    │ │  (8082)    │ │  (8083)      │
└────┬───────┘ └────┬───────┘ └────┬───────┘ └───┬──────────┘
     │             │             │             │
     ▼             ▼             ▼             ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐
│  Auth DB   │ │ Member DB  │ │ Trainer DB │ │Attendance DB │
│  (3309)    │ │  (3306)    │ │  (3307)    │ │   (3308)     │
└────────────┘ └────────────┘ └────────────┘ └──────────────┘

        ┌──────────────────────────────┐
        │   Service Discovery Eureka   │
        │       (8761)                 │
        └──────────────────────────────┘

        ┌──────────────────────────────┐
        │     Payment Service (8080)   │
        │     Schedule Service (8080)  │
        └──────────────────────────────┘
```

### Service Dependencies

```
Auth Service
  └─ Authenticates users
  └─ Validates JWT tokens
  └─ Generates access tokens

Member Service
  └─ Manages members (CRUD)
  └─ Stores member data: name, email, phone, address
  └─ Associates members with packages (gói tập)

Trainer Service
  ├─ Manages trainers (CRUD)
  ├─ Manages schedules (class schedules - lịch học)
  └─ Handles schedule registration/approval

Payment Service
  └─ Manages payments (CRUD)
  └─ Payment status: pending, confirmed, failed
  └─ Tracks payment history

Attendance Service
  └─ Records attendance (điểm danh)
  └─ Tracks present/absent status
  └─ Queries by member/date range

Discovery Server (Eureka)
  └─ Service registration & discovery
  └─ Health monitoring
  └─ Load balancing

API Gateway
  └─ Single entry point for frontend
  └─ Route requests to services
  └─ JWT validation & CORS
```

---

## 🗄️ Database Design

### Database Instances

Each service has its own database (Polyglot Persistence):

| Service | Database | Port | Credentials |
|---------|----------|------|-------------|
| Member | member_service_db | 3306 | root:root |
| Trainer | trainer_service_db | 3307 | root:root |
| Attendance | attendance_service_db | 3308 | root:root |
| Auth | auth_service_db | 3309 | root:root |
| Payment | payment_service_db | 3310 | root:root |
| Schedule | schedule_service_db | 3311 | root:root |

### Schema Summary

#### member_service_db
```sql
CREATE TABLE hoc_vien (
  mahocvien INT PRIMARY KEY AUTO_INCREMENT,
  hoten VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  sodienthoai VARCHAR(20),
  diachi VARCHAR(255),
  magoi INT, -- FK to packages
  trangthai VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goi_tap (
  magoi INT PRIMARY KEY AUTO_INCREMENT,
  tengoi VARCHAR(255),
  sotien DECIMAL(10,2),
  sophut INT, -- minutes
  trangthai VARCHAR(50)
);
```

#### trainer_service_db
```sql
CREATE TABLE huan_luyen_vien (
  mahlv INT PRIMARY KEY AUTO_INCREMENT,
  hoten VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  sdt VARCHAR(20),
  chuyenmon VARCHAR(255),
  kinhnghiem INT, -- years
  trangthai VARCHAR(50)
);

CREATE TABLE lich_hoc (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenbomon VARCHAR(255),
  mahlv INT,
  thoidiem DATETIME,
  phongtap VARCHAR(100),
  sisotoida INT,
  trangthai VARCHAR(50)
);

CREATE TABLE schedule_approval (
  id INT PRIMARY KEY,
  lichoc_id INT,
  trangthai VARCHAR(50),
  ngayduyet TIMESTAMP
);
```

#### attendance_service_db
```sql
CREATE TABLE diem_danh (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mahocvien INT,
  lichoc_id INT,
  ngaydiemdasnh DATE,
  trangthai VARCHAR(50) -- 'có mặt' or 'vắng mặt'
);
```

#### auth_service_db
```sql
CREATE TABLE account (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50), -- 'admin', 'trainer', 'member'
  trangthai VARCHAR(50)
);
```

#### payment_service_db
```sql
CREATE TABLE thanh_toan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mahocvien INT,
  sotien DECIMAL(10,2),
  trangthai VARCHAR(50), -- 'pending', 'confirmed'
  ngaytao TIMESTAMP,
  ngayxacnhan TIMESTAMP
);
```

---

## 💼 Business Logic

### 1. User Roles & Permissions

```
┌─────────────────────────────────────────┐
│          User Role Hierarchy             │
├─────────────────────────────────────────┤
│ Admin                                    │
│ ├─ Manage members (CRUD)                │
│ ├─ Manage trainers (CRUD)               │
│ ├─ Manage schedules (CRUD)              │
│ ├─ Approve payments                      │
│ ├─ View attendance reports               │
│ └─ Manage accounts                       │
├─────────────────────────────────────────┤
│ Trainer                                  │
│ ├─ View assigned schedules              │
│ ├─ Record attendance                     │
│ ├─ View their members                    │
│ └─ Request schedule changes              │
├─────────────────────────────────────────┤
│ Member                                   │
│ ├─ View personal info                   │
│ ├─ View enrollments                     │
│ ├─ Register for classes                  │
│ ├─ View attendance history              │
│ ├─ View payment history                 │
│ └─ Change password                       │
└─────────────────────────────────────────┘
```

### 2. Authentication Flow

```
Frontend (Login)
  │
  ├─ POST /api/auth/login (username, password)
  │
  ▼
Auth Service
  ├─ Validate credentials
  ├─ Check if account exists
  ├─ Compare passwords (hashed)
  │
  ▼
  ├─ Generate JWT token (expires in 24h)
  ├─ Return: { token, user_id, role, name }
  │
  ▼
Frontend (Store Token)
  ├─ Save token in localStorage
  ├─ Set Authorization header: Bearer {token}
  │
  ▼
API Gateway (Validate)
  ├─ Extract JWT from Authorization header
  ├─ Verify signature & expiration
  ├─ Extract user info from token
  │
  ▼
Route to Service + Pass user context
```

### 3. Member Enrollment Logic

```
Member wants to join class:
  │
  ├─ Check member has active package
  ├─ Check class has available slots
  ├─ Register member in schedule
  ├─ Wait for trainer approval
  │
  ├─ IF approved:
  │   └─ Add to attendance records for class
  ├─ IF rejected:
  │   └─ Notify member
  │
  ▼
Member attends class:
  ├─ Trainer records attendance
  ├─ Update attendance status: "có mặt" or "vắng mặt"
  ├─ Calculate class occupancy for dashboard
```

### 4. Payment Flow

```
Frontend (Payment Page)
  │
  ├─ Display pending payments
  ├─ User submits payment
  │
  ▼
Payment Service
  ├─ Create payment record: status = "pending"
  ├─ Calculate amount based on package + classes
  │
  ▼
Admin Dashboard
  ├─ Review pending payments
  ├─ Confirm or reject
  ├─ Update payment status
  │
  ▼
Member Dashboard
  ├─ Shows payment confirmation
  ├─ Updates remaining balance
```

### 5. Class Capacity & Enrollment

```
Each Schedule has:
  ├─ sisotoida = max capacity (e.g., 20)
  ├─ sisohientai = current enrollment (calculated from attendance)
  │
  ├─ Occupancy % = (current / max) * 100
  ├─ Full class = sisohientai >= sisotoida
  │
  ├─ When class is full:
  │   └─ New registrations go to waitlist
  └─ When slot becomes available:
      └─ Promote from waitlist
```

---

## 📂 Frontend Structure

### File Organization
```
frontend/
├── public/
│   └── index.html                 # Main HTML entry
├── src/
│   ├── index.js                   # React DOM render
│   ├── App.jsx                    # Main app component, routing
│   ├── index.css                  # Global styles
│   │
│   ├── services/
│   │   └── api.js                 # API calls (60+ functions)
│   │                              # Mock data + localStorage
│   │
│   ├── context/
│   │   └── AuthContext.js         # User auth state
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Avatar.jsx             # User profile picture
│   │   ├── FontLoader.jsx         # Font loading
│   │   ├── Login.jsx              # Login form
│   │   ├── MainLayout.jsx         # App wrapper layout
│   │   ├── Modal.jsx              # Generic modal
│   │   ├── PaymentRequestModal.jsx # Payment modal
│   │   ├── PrivateRoute.jsx       # Protected routes
│   │   ├── Register.jsx           # Registration form
│   │   ├── SideBar.jsx            # Navigation sidebar
│   │   └── StatusBadge.jsx        # Status display badge
│   │
│   └── pages/                     # Page components
│       ├── Dashboard.jsx          # Home/overview (all users)
│       ├── AccountsPage.jsx       # Account management
│       ├── ApprovalPage.jsx       # Schedule approvals
│       ├── AttendancePage.jsx     # Attendance recording
│       ├── ChangePasswordPage.jsx # Password change
│       ├── MemberPaymentPage.jsx  # Payment view
│       ├── TrainerListPage.jsx    # Trainer management
│       ├── SchedulesPage.jsx      # Schedule management
│       └── ... (other pages)
│
├── .env                           # Environment variables
├── package.json                   # Dependencies
├── Dockerfile                     # Production Docker image
└── nginx.conf                     # Nginx config for production
```

### Key Frontend Components

#### api.js (1400+ lines)
**Purpose:** Central API layer for all backend communication

**Key Functions:**
- **Auth:** `login()`, `logout()`, `registerMember()`, `changePassword()`
- **Members:** `getMembers()`, `getMember()`, `createMember()`, `updateMember()`, `deleteMember()`
- **Trainers:** `getTrainers()`, `createTrainer()`, `updateTrainer()`, `deleteTrainer()`
- **Schedules:** `getSchedules()`, `createSchedule()`, `updateSchedule()`, `deleteSchedule()`, `registerSchedule()`, `approveScheduleRequest()`, `rejectScheduleRequest()`
- **Payments:** `getPayments()`, `createPayment()`, `confirmPayment()`, `approvePayment()`, `rejectPayment()`
- **Attendance:** `getAttendance()`, `createAttendance()`, `updateAttendance()`, `deleteAttendance()`

**Data Persistence:** localStorage + mock data fallback

#### Dashboard.jsx
**Purpose:** Main overview page showing key metrics

**Displays:**
- Total members, trainers, revenue, active members
- Today's attendance (present/absent count)
- Today's schedules with enrollment status
- Top trainers, pending payments
- Quick stats for admins/trainers/members

**Logic:**
- Fetches data every 15 seconds (auto-refresh)
- Calculates class occupancy from attendance records
- Shows role-specific cards (admin sees different data than member)

#### Other Pages
- **Login.jsx** - Authentication form
- **SchedulesPage.jsx** - View/create/edit class schedules
- **MemberPaymentPage.jsx** - Payment management & approval
- **AttendancePage.jsx** - Record attendance, view history
- **AccountsPage.jsx** - Manage user accounts
- **ApprovalPage.jsx** - Approve pending schedule requests

---

## 🖥️ Backend Structure

### Service Architecture

#### 1. **Auth Service** (Port 8084)
**Path:** `backend/auth-service/`

**Responsibilities:**
- User authentication & JWT token generation
- Account management
- Password validation

**Key Files:**
- `AuthServiceApplication.java` - Main entry point (Spring Boot app)
- `AuthController.java` - REST endpoints
- `Account.java` - Entity model
- `AuthService.java` - Business logic

**Endpoints:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Create account
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/current-user` - Get current user

**Dependencies:**
- MySQL 8.0 (port 3309)
- Eureka for service discovery
- Spring Security for auth

---

#### 2. **Member Service** (Port 8081)
**Path:** `backend/member-service/`

**Responsibilities:**
- CRUD operations on members (học viên)
- Package management (gói tập)
- Member data validation

**Key Files:**
- `MemberServiceApplication.java` - Main entry point
- `HocVienController.java` - Member endpoints
- `HocVien.java` - Member entity
- `GoiTap.java` - Package entity

**Endpoints:**
- `GET /api/members` - List all members
- `GET /api/members/{id}` - Get member details
- `POST /api/members` - Create member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

**Database:** member_service_db (port 3306)

---

#### 3. **Trainer Service** (Port 8082)
**Path:** `backend/trainer-service/`

**Responsibilities:**
- CRUD for trainers (huấn luyện viên)
- Schedule management (lịch học)
- Schedule registration & approval

**Key Files:**
- `TrainerServiceApplication.java` - Main entry point
- `HuanLuyenVienController.java` - Trainer endpoints
- `LichHocController.java` - Schedule endpoints
- `HuanLuyenVien.java` - Trainer entity
- `LichHoc.java` - Schedule entity
- `ScheduleApproval.java` - Approval entity

**Endpoints (Trainer):**
- `GET /api/trainers`
- `POST /api/trainers`
- `PUT /api/trainers/{id}`
- `DELETE /api/trainers/{id}`

**Endpoints (Schedule):**
- `GET /api/schedules` - List schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/{id}` - Update schedule
- `DELETE /api/schedules/{id}` - Delete schedule
- `POST /api/schedules/{id}/register` - Register for class
- `GET /api/schedules/pending` - Get pending registrations
- `PUT /api/schedules/{id}/approve` - Approve registration
- `PUT /api/schedules/{id}/reject` - Reject registration

**Database:** trainer_service_db (port 3307)

---

#### 4. **Attendance Service** (Port 8083)
**Path:** `backend/attendance-service/`

**Responsibilities:**
- Record attendance (điểm danh)
- Query attendance by member/date
- Attendance statistics

**Key Files:**
- `AttendanceServiceApplication.java` - Main entry point
- `DiemDanhDetailController.java` - Attendance endpoints
- `DiemDanhDetail.java` - Attendance entity

**Endpoints:**
- `GET /api/attendance` - List attendance records
- `GET /api/attendance/member/{memberId}` - By member
- `GET /api/attendance/date-range` - By date range
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/{id}` - Update attendance
- `DELETE /api/attendance/{id}` - Delete attendance

**Database:** attendance_service_db (port 3308)

---

#### 5. **Payment Service**
**Path:** `backend/payment-service/`

**Responsibilities:**
- Payment management
- Payment confirmation & rejection
- Payment history

**Database:** payment_service_db (port 3310)

---

#### 6. **API Gateway** (Port 8080)
**Path:** `backend/api-gateway/`

**Responsibilities:**
- Single entry point for frontend
- Route requests to services via Eureka
- JWT validation
- CORS handling
- Centralized error handling

**Key Files:**
- `GatewayApplication.java` - Main entry point
- `JwtAuthenticationFilter.java` - JWT validation logic
- `application.yml` - Route configuration

**Routes:**
```yaml
- /api/auth/** → auth-service:8084
- /api/members/** → member-service:8081
- /api/trainers/** → trainer-service:8082
- /api/schedules/** → trainer-service:8082
- /api/attendance/** → attendance-service:8083
- /api/payments/** → payment-service:8080
```

**CORS:** Enabled for `http://localhost:3000`

**Headers Added:**
- `Authorization: Bearer {JWT_TOKEN}`

---

#### 7. **Discovery Server (Eureka)** (Port 8761)
**Path:** `backend/discovery-server/`

**Responsibilities:**
- Service registration
- Service discovery
- Health monitoring
- Load balancing

**Key Files:**
- `DiscoveryServerApplication.java` - Eureka server config
- `application.yml` - Eureka settings

**Services Registered:**
- auth-service (8084)
- member-service (8081)
- trainer-service (8082)
- attendance-service (8083)
- payment-service (8080)
- api-gateway (8080)

---

### Backend Common Patterns

#### Entity (Model)
```java
@Entity
@Table(name = "hoc_vien")
public class HocVien {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long mahocvien;
  
  @Column(nullable = false)
  private String hoten;
  
  @Column(unique = true)
  private String email;
  
  // ... other fields
}
```

#### Repository
```java
@Repository
public interface HocVienRepository extends JpaRepository<HocVien, Long> {
  List<HocVien> findByTrangthai(String status);
}
```

#### Service
```java
@Service
public class HocVienService {
  @Autowired
  private HocVienRepository repo;
  
  public List<HocVien> getAllMembers() {
    return repo.findAll();
  }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
public class HocVienController {
  @Autowired
  private HocVienService service;
  
  @GetMapping
  public List<HocVien> getAll() {
    return service.getAllMembers();
  }
}
```

---

## 🔗 API Endpoints

### Complete Endpoint Reference

#### Authentication
```
POST   /api/auth/login                    - Login
POST   /api/auth/register                 - Register
POST   /api/auth/change-password          - Change password
GET    /api/auth/current-user             - Get current user
```

#### Members
```
GET    /api/members                       - List all
GET    /api/members/{id}                  - Get one
POST   /api/members                       - Create
PUT    /api/members/{id}                  - Update
DELETE /api/members/{id}                  - Delete
```

#### Trainers
```
GET    /api/trainers                      - List all
GET    /api/trainers/{id}                 - Get one
POST   /api/trainers                      - Create
PUT    /api/trainers/{id}                 - Update
DELETE /api/trainers/{id}                 - Delete
```

#### Schedules
```
GET    /api/schedules                     - List all
GET    /api/schedules/{id}                - Get one
POST   /api/schedules                     - Create
PUT    /api/schedules/{id}                - Update
DELETE /api/schedules/{id}                - Delete
POST   /api/schedules/register            - Register for class
POST   /api/schedules/{id}/approve        - Approve registration
POST   /api/schedules/{id}/reject         - Reject registration
```

#### Payments
```
GET    /api/payments                      - List all
POST   /api/payments                      - Create payment
PUT    /api/payments/{id}/confirm         - Confirm payment
PUT    /api/payments/{id}/approve         - Approve (admin)
PUT    /api/payments/{id}/reject          - Reject (admin)
```

#### Attendance
```
GET    /api/attendance                    - List all
GET    /api/attendance/member/{id}        - By member
POST   /api/attendance                    - Create
PUT    /api/attendance/{id}               - Update
DELETE /api/attendance/{id}               - Delete
```

#### Accounts (Admin)
```
GET    /api/accounts                      - List accounts
POST   /api/accounts                      - Create account
PUT    /api/accounts/{id}                 - Update account
DELETE /api/accounts/{id}                 - Delete account
```

---

## 🔄 Data Flow Diagrams

### Login Flow
```
┌──────────────┐                 ┌──────────────┐               ┌──────────────┐
│   Frontend   │                 │  API Gateway │               │ Auth Service │
│              │                 │              │               │              │
└──────┬───────┘                 └──────┬───────┘               └──────┬───────┘
       │                                │                              │
       │─ POST /auth/login ───────────>│                              │
       │  {username, password}         │─ Route to auth-service ──>  │
       │                                │                    Validate │
       │                                │  Generate JWT <──────────│
       │  JWT Token <─────────────────│                              │
       │  Store in localStorage        │                              │
       │                                │                              │
```

### Member Registration Flow
```
┌──────────────┐        ┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Frontend   │        │  API Gateway │      │Member Service│     │   Database   │
│              │        │              │      │              │     │              │
└──────┬───────┘        └──────┬───────┘      └──────┬───────┘     └──────┬───────┘
       │                       │                     │                    │
       │─ POST /members ────> │                     │                    │
       │ {member data}        │─ Route ──────────> │                    │
       │                      │                    │─ Validate ────────│
       │                      │                    │─ Insert ──────────│
       │                      │                    │ Get ID <─────────│
       │ 200 OK <──────────────<─ Return new member                    │
       │                       │                     │                    │
```

### Schedule Registration & Attendance
```
┌──────────────┐     ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Member     │     │   Trainer    │    │  Gateway     │    │ Trainer Service │
│  (Frontend)  │     │  (Frontend)  │    │              │    │                 │
└──────┬───────┘     └──────┬───────┘    └──────┬───────┘    └────────┬────────┘
       │                    │                   │                     │
       │─ Register for class ────────────────> │                     │
       │  POST /schedules/register             │─ Route ──────────> │
       │                                       │                    │
       │                                       │ status="pending" <─│
       │                                       │                    │
       │                                       │
       │  (Later - Trainer approves)           │
       │                                       │
       │                            PUT /schedules/{id}/approve
       │  <─ Approval notification ─────────────────────────────────│
       │                                       │                    │
       │  (Day of class)                       │                    │
       │                                       │                    │
       │          ┌─ Trainer records attendance               │
       │          │  POST /attendance                         │
       │          │  {member_id, schedule_id, status}        │
       │          └─ Request sent ──────────────────────────>│
       │                                       │                    │
       │  (Dashboard shows attendance)         │  Record saved      │
       │  <─ Updated attendance count ─────────────────────────────│
```

### Payment Approval Flow
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐     ┌──────────────┐
│   Member     │    │   Admin      │    │  API Gateway │     │Payment Service│
│              │    │              │    │              │     │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘     └──────┬───────┘
       │                   │                   │                    │
       │─ Submit payment ──────────────────> │                     │
       │  POST /payments                     │─ Route ──────────> │
       │  {member_id, amount}                │                    │
       │                                      │ status="pending" <─│
       │  "Payment pending confirmation"      │                    │
       │                                      │                    │
       │                   (Admin views dashboard)                 │
       │                                      │                    │
       │                   │─ PUT /payments/{id}/approve          │
       │                   │    {confirmed}                        │
       │                   │                ─ Route ──────────> │
       │                   │                                    │
       │  "Payment confirmed" <──────────────────────────────────│
       │  Update balance                     │                    │
```

---

## 🔐 Security Considerations

### JWT Token Structure
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user_id",
  "username": "member",
  "role": "member",
  "iat": 1620000000,
  "exp": 1620086400  // 24 hours later
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

### JWT Secret
```
Key: "your_jwt_secret_key_which_is_at_least_32_characters_long_more_than_256_bits"
Algorithm: HS256
Expiration: 24 hours
```

### CORS Configuration
```
Allowed Origins: http://localhost:3000, http://localhost:80
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Authorization, Content-Type
Credentials: Allowed
```

### Password Hashing
- Trainer/Member passwords should be hashed using BCrypt
- Never store plain-text passwords
- JWT tokens are used for API authentication, not passwords

---

## 📦 Docker Compose Setup

### Container Network
```
Network: gym-network (bridge)

Services:
  - member-db, trainer-db, attendance-db, auth-db, payment-db, schedule-db
  - discovery-server (Eureka)
  - auth-service, member-service, trainer-service, attendance-service, payment-service
  - api-gateway
  - gym-frontend (Nginx)
```

### Environment Variables

**Auth Service:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://auth-db:3306/auth_service_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://discovery-server:8761/eureka
```

**Frontend:**
```
REACT_APP_API_URL=http://localhost:8080
```

---

## 🚀 Running the Project

### Start All Services
```bash
cd c:\xampp\htdocs\QL-Vothuatt\QL-Vothuat
docker-compose up -d
```

### Access Points
- Frontend (Dev): http://localhost:3000
- Frontend (Production): http://localhost:80
- API Gateway: http://localhost:8080
- Eureka Discovery: http://localhost:8761

### Test Login
```
Username: member
Password: std123

OR

Username: admin
Password: admin123

OR

Username: trainer
Password: hlv123

OR

Username: manager
Password: mgr123
```

---

## 📝 Notes & Best Practices

### Frontend
- Use `api.js` for all backend calls
- Store user info in AuthContext
- Use localStorage for persistence
- Handle errors gracefully with try-catch
- Mock data falls back if backend unavailable

### Backend
- Always validate input on server side
- Use JPA repositories for database operations
- Implement service layer for business logic
- Follow REST API conventions
- Log important events for debugging

### Database
- Each service has its own database (no cross-service queries)
- Use transactions for multi-step operations
- Index frequently queried columns
- Regular backups of volumes

### Deployment
- Use Docker Compose for local development
- Configure proper health checks
- Set restart policies (unless-stopped)
- Monitor service logs regularly
- Keep JWT secret secure (use env vars)

---

**Document Version:** 1.0  
**Last Updated:** May 9, 2026  
**Maintained By:** Development Team  
**Status:** Production Ready

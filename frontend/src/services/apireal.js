// src/services/api.js - MOCK VERSION WITH LOCALSTORAGE PERSISTENCE

const API_URL = 'http://localhost:8080';
export const getMembers = async () => {
  const response = await axios.get(`${API_URL}/api/members`);
  return response.data;
};

// Default mock data - used only if localStorage is empty
// Only keep users with accounts
const DEFAULT_MEMBERS = [
  { id: 1, hoten: "Trần Thị Bích", email: "bich@gmail.com", sdt: "0901234567", magoi: [1], tiendo: "Beginner", trangthai: "đang tập", ngaydangky: "2025-01-10" },
  { id: 2, hoten: "Hoàng Long", email: "hoang.long@gmail.com", sdt: "0902345678", magoi: [1, 2], tiendo: "Intermediate", trangthai: "đang tập", ngaydangky: "2025-02-15" },
  { id: 3, hoten: "Ngọc Thúc", email: "ngoc.thuc@gmail.com", sdt: "0903456789", magoi: [2], tiendo: "Advanced", trangthai: "đang tập", ngaydangky: "2025-01-20" },
  { id: 4, hoten: "Lê Minh Huy", email: "huy.minh@gmail.com", sdt: "0904567890", magoi: [1], tiendo: "Beginner", trangthai: "đang tập", ngaydangky: "2026-03-05" },
  { id: 5, hoten: "Phạm Thị Hương", email: "huong.pham@gmail.com", sdt: "0905678901", magoi: [3], tiendo: "Intermediate", trangthai: "đang tập", ngaydangky: "2026-02-01" },
  { id: 6, hoten: "Vũ Đức Cường", email: "cuong.vu@gmail.com", sdt: "0906789012", magoi: [2], tiendo: "Beginner", trangthai: "tạm nghỉ", ngaydangky: "2025-12-10" },
  { id: 7, hoten: "Đặng Quang Hải", email: "hai.dang@gmail.com", sdt: "0907890123", magoi: [1, 3], tiendo: "Advanced", trangthai: "đang tập", ngaydangky: "2026-01-15" },
  { id: 8, hoten: "Nguyễn Thị Mai", email: "mai.nguyen@gmail.com", sdt: "0908901234", magoi: [2], tiendo: "Intermediate", trangthai: "đang tập", ngaydangky: "2026-04-10" },
  { id: 9, hoten: "Trần Văn Sơn", email: "son.tran@gmail.com", sdt: "0909012345", magoi: [1], tiendo: "Beginner", trangthai: "đã nghỉ", ngaydangky: "2025-11-20" },
  { id: 10, hoten: "Lý Thị Hồng Nhung", email: "nhung.ly@gmail.com", sdt: "0910123456", magoi: [3], tiendo: "Advanced", trangthai: "đang tập", ngaydangky: "2026-03-25" }
];

const DEFAULT_PACKAGES = [
  { id: 1, ten: "Gói Chiến Binh", gia: 800000, thang: 1, mota: "8 buổi/tháng", buoi: 8 },
  { id: 2, ten: "Gói Chiến Thần", gia: 2100000, thang: 3, mota: "12 buổi/tháng", buoi: 12 },
  { id: 3, ten: "Gói Vô Địch", gia: 3600000, thang: 6, mota: "Không giới hạn", buoi: 999 }
];

// Only keep trainers with accounts
const DEFAULT_TRAINERS = [
  { id: 1, hoten: "HLV Minh Tuấn", email: "tuan@vnb.vn", sdt: "0901111111", chuyenmon: "MMA, Boxing", kinhnghiem: 8, trangthai: "đang làm", luong: 15000000 },
  { id: 2, hoten: "Phạm Văn Nam", email: "nam.pham@vnb.vn", sdt: "0902222222", chuyenmon: "BJJ, Judo", kinhnghiem: 10, trangthai: "đang làm", luong: 18000000 },
  { id: 3, hoten: "Lê Anh Tuấn", email: "tuan.le@vnb.vn", sdt: "0903333333", chuyenmon: "Yoga, Fitness", kinhnghiem: 5, trangthai: "đang làm", luong: 12000000 },
  { id: 4, hoten: "Trần Hữu Phúc", email: "phuc.tran@vnb.vn", sdt: "0904444444", chuyenmon: "CrossFit, Weightlifting", kinhnghiem: 7, trangthai: "đang làm", luong: 16000000 }
];

// Only keep schedules from trainers with accounts
const DEFAULT_SCHEDULES = [
  { id: 1, tenbomon: "MMA Cơ Bản", goi_id: 1, hluyen_id: 1, hluyen_ten: "HLV Minh Tuấn", thu: "Thứ 2,4,6", gio: "06:00–07:30", phongtap: "Sàn MMA", sisotoida: 20, sisohientai: 15, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 2, tenbomon: "BJJ", goi_id: 1, hluyen_id: 2, hluyen_ten: "Phạm Văn Nam", thu: "Thứ 3,5", gio: "19:00–20:00", phongtap: "Sàn BJJ", sisotoida: 5, sisohientai: 2, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 3, tenbomon: "Boxing Cơ Bản", goi_id: 1, hluyen_id: 1, hluyen_ten: "HLV Minh Tuấn", thu: "Thứ 3,5", gio: "07:30–09:00", phongtap: "Sàn Boxing", sisotoida: 18, sisohientai: 8, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 4, tenbomon: "Yoga Sáng", goi_id: 2, hluyen_id: 3, hluyen_ten: "Lê Anh Tuấn", thu: "Thứ 2,4,6", gio: "05:30–06:30", phongtap: "Phòng Yoga", sisotoida: 25, sisohientai: 18, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 5, tenbomon: "CrossFit Advanced", goi_id: 3, hluyen_id: 4, hluyen_ten: "Trần Hữu Phúc", thu: "Thứ 2,3,5,6", gio: "18:00–19:30", phongtap: "Sàn CrossFit", sisotoida: 15, sisohientai: 10, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 6, tenbomon: "Fitness Pro", goi_id: 2, hluyen_id: 3, hluyen_ten: "Lê Anh Tuấn", thu: "Thứ 3,5,7", gio: "17:00–18:00", phongtap: "Phòng Fitness", sisotoida: 20, sisohientai: 12, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 7, tenbomon: "Judo cho Trẻ", goi_id: 1, hluyen_id: 2, hluyen_ten: "Phạm Văn Nam", thu: "Thứ 4,6", gio: "10:00–11:00", phongtap: "Sàn Judo", sisotoida: 12, sisohientai: 7, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] }
];

// Only keep payments from members with accounts
const DEFAULT_PAYMENTS = [
  { id: 1, hocvien_id: 1, hocvien_ten: "Trần Thị Bích", goi_id: 1, goi_ten: "Gói Chiến Binh", sotien: 800000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2025-01-10" },
  { id: 2, hocvien_id: 2, hocvien_ten: "Hoàng Long", goi_id: 2, goi_ten: "Gói Chiến Thần", sotien: 2100000, phuongthuc: "Tiền mặt", trangthai: "đã thanh toán", ngay: "2025-02-15" },
  { id: 3, hocvien_id: 3, hocvien_ten: "Ngọc Thúc", goi_id: 2, goi_ten: "Gói Chiến Thần", sotien: 2100000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2025-01-20" },
  { id: 4, hocvien_id: 4, hocvien_ten: "Lê Minh Huy", goi_id: 1, goi_ten: "Gói Chiến Binh", sotien: 800000, phuongthuc: "Chuyển khoản", trangthai: "chờ xác nhận", ngay: "2026-03-05" },
  { id: 5, hocvien_id: 5, hocvien_ten: "Phạm Thị Hương", goi_id: 3, goi_ten: "Gói Vô Địch", sotien: 3600000, phuongthuc: "Tiền mặt", trangthai: "đã thanh toán", ngay: "2026-02-01" },
  { id: 6, hocvien_id: 6, hocvien_ten: "Vũ Đức Cường", goi_id: 2, goi_ten: "Gói Chiến Thần", sotien: 2100000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2025-12-10" },
  { id: 7, hocvien_id: 7, hocvien_ten: "Đặng Quang Hải", goi_id: 3, goi_ten: "Gói Vô Địch", sotien: 3600000, phuongthuc: "Tiền mặt", trangthai: "đã thanh toán", ngay: "2026-01-15" },
  { id: 8, hocvien_id: 8, hocvien_ten: "Nguyễn Thị Mai", goi_id: 2, goi_ten: "Gói Chiến Thần", sotien: 2100000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2026-04-10" },
  { id: 9, hocvien_id: 10, hocvien_ten: "Lý Thị Hồng Nhung", goi_id: 3, goi_ten: "Gói Vô Địch", sotien: 3600000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2026-03-25" }
];

// Only keep attendance records for members and trainers with accounts
const DEFAULT_ATTENDANCE = [
  { id: 1, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2025-05-01", trangthai: "có mặt", ghichu: "" },
  { id: 2, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2025-04-29", trangthai: "có mặt", ghichu: "" },
  { id: 3, hlv_id: 2, hlv_ten: "Phạm Văn Nam", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 2, lich_ten: "BJJ", ngay: "2026-05-06", trangthai: "có mặt", ghichu: "" },
  { id: 4, hlv_id: 2, hlv_ten: "Phạm Văn Nam", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 2, lich_ten: "BJJ", ngay: "2026-04-29", trangthai: "có mặt", ghichu: "" },
  { id: 5, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 2, hocvien_ten: "Hoàng Long", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2026-05-05", trangthai: "có mặt", ghichu: "" },
  { id: 6, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 2, hocvien_ten: "Hoàng Long", lichid: 3, lich_ten: "Boxing Cơ Bản", ngay: "2026-05-03", trangthai: "vắng", ghichu: "Bận công việc" },
  { id: 7, hlv_id: 2, hlv_ten: "Phạm Văn Nam", hocvien_id: 3, hocvien_ten: "Ngọc Thúc", lichid: 2, lich_ten: "BJJ", ngay: "2026-05-04", trangthai: "có mặt", ghichu: "" },
  { id: 8, hlv_id: 3, hlv_ten: "Lê Anh Tuấn", hocvien_id: 5, hocvien_ten: "Phạm Thị Hương", lichid: 4, lich_ten: "Yoga Sáng", ngay: "2026-05-06", trangthai: "có mặt", ghichu: "" },
  { id: 9, hlv_id: 4, hlv_ten: "Trần Hữu Phúc", hocvien_id: 7, hocvien_ten: "Đặng Quang Hải", lichid: 5, lich_ten: "CrossFit Advanced", ngay: "2026-05-05", trangthai: "có mặt", ghichu: "" },
  { id: 10, hlv_id: 3, hlv_ten: "Lê Anh Tuấn", hocvien_id: 8, hocvien_ten: "Nguyễn Thị Mai", lichid: 6, lich_ten: "Fitness Pro", ngay: "2026-05-03", trangthai: "có mặt", ghichu: "" },
  { id: 11, hlv_id: 2, hlv_ten: "Phạm Văn Nam", hocvien_id: 4, hocvien_ten: "Lê Minh Huy", lichid: 2, lich_ten: "BJJ", ngay: "2026-05-01", trangthai: "có mặt", ghichu: "" },
  { id: 12, hlv_id: 4, hlv_ten: "Trần Hữu Phúc", hocvien_id: 10, hocvien_ten: "Lý Thị Hồng Nhung", lichid: 5, lich_ten: "CrossFit Advanced", ngay: "2026-05-02", trangthai: "có mặt", ghichu: "" }
];

// Initialize mock data from localStorage
const getStoredMembers = () => {
  const stored = localStorage.getItem('mockMembers');
  return stored ? JSON.parse(stored) : DEFAULT_MEMBERS;
};

const getStoredTrainers = () => {
  const stored = localStorage.getItem('mockTrainers');
  return stored ? JSON.parse(stored) : DEFAULT_TRAINERS;
};

const getStoredSchedules = () => {
  const stored = localStorage.getItem('mockSchedules');
  return stored ? JSON.parse(stored) : DEFAULT_SCHEDULES;
};

const getStoredPayments = () => {
  const stored = localStorage.getItem('mockPayments');
  return stored ? JSON.parse(stored) : DEFAULT_PAYMENTS;
};

const getStoredPackages = () => {
  const stored = localStorage.getItem('mockPackages');
  return stored ? JSON.parse(stored) : DEFAULT_PACKAGES;
};

const getStoredAttendance = () => {
  const stored = localStorage.getItem('mockAttendance');
  return stored ? JSON.parse(stored) : DEFAULT_ATTENDANCE;
};

// ✅ FIX #1: Initialize data ONLY if localStorage is empty (don't overwrite saved data!)
// Load from localStorage FIRST, fall back to DEFAULT only if not found
let mockMembers = getStoredMembers();
let mockTrainers = getStoredTrainers();
let mockSchedules = getStoredSchedules();
let mockPayments = getStoredPayments();
let mockAttendance = getStoredAttendance();
let mockPackages = getStoredPackages();

// Only initialize localStorage if completely empty (first load)
const isFirstLoad = !localStorage.getItem('mockMembers');
if (isFirstLoad) {
  console.log('🔄 First load: Initializing localStorage with DEFAULT data');
  localStorage.setItem('mockMembers', JSON.stringify(mockMembers));
  localStorage.setItem('mockTrainers', JSON.stringify(mockTrainers));
  localStorage.setItem('mockSchedules', JSON.stringify(mockSchedules));
  localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
  localStorage.setItem('mockAttendance', JSON.stringify(mockAttendance));
  localStorage.setItem('mockPackages', JSON.stringify(mockPackages));
  localStorage.setItem('dataVersion', '1.1'); // Version flag
} else {
  console.log('✅ Module reload: Using data from localStorage (preserving saved data)');
  // Reset schedules and attendance to latest DEFAULT if version changed
  const storedVersion = localStorage.getItem('dataVersion');
  if (storedVersion !== '1.1') {
    console.log('🔄 Data version changed: Resetting schedules and attendance');
    localStorage.setItem('mockSchedules', JSON.stringify(DEFAULT_SCHEDULES));
    localStorage.setItem('mockAttendance', JSON.stringify(DEFAULT_ATTENDANCE));
    localStorage.setItem('dataVersion', '1.1');
    mockSchedules = DEFAULT_SCHEDULES;
    mockAttendance = DEFAULT_ATTENDANCE;
  }
}

// Helper functions to save data to localStorage
const saveMembersToStorage = () => {
  localStorage.setItem('mockMembers', JSON.stringify(mockMembers));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('membersUpdated'));
};

const saveTrainersToStorage = () => {
  localStorage.setItem('mockTrainers', JSON.stringify(mockTrainers));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('trainersUpdated'));
};

const saveSchedulesToStorage = () => {
  localStorage.setItem('mockSchedules', JSON.stringify(mockSchedules));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('schedulesUpdated'));
};

const savePaymentsToStorage = () => {
  localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('paymentsUpdated'));
};

const saveAttendanceToStorage = () => {
  localStorage.setItem('mockAttendance', JSON.stringify(mockAttendance));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('attendanceUpdated'));
};

// Auth
export const login = async (username, password) => {
  await delay();
  console.log("Login attempt:", username);
  
  // Load passwords and accounts from localStorage to ensure consistency
  mockPasswords = getStoredPasswords();
  mockAccounts = getStoredAccounts();
  
  // Check if password matches
  if (!mockPasswords[username] || mockPasswords[username] !== password) {
    throw new Error('Sai tài khoản hoặc mật khẩu');
  }
  
  // Find the account
  const account = mockAccounts.find(a => a.username === username);
  
  if (!account) {
    throw new Error('Sai tài khoản hoặc mật khẩu');
  }
  
  // Create user object with account data
  const user = {
    id: account.id,
    username: account.username,
    role: account.role,
    name: account.name,
    avatar: account.avatar,
    trainerId: account.trainerId || null,
    memberId: account.memberId || null
  };
  
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

// Password storage (mock - in real app this would be on server)
const DEFAULT_PASSWORDS = {
  admin: 'admin123',
  manager: 'mgr123',
  trainer: 'hlv123',
  member: 'std123'
};

const getStoredPasswords = () => {
  const stored = localStorage.getItem('mockPasswords');
  return stored ? JSON.parse(stored) : DEFAULT_PASSWORDS;
};

let mockPasswords = getStoredPasswords();

// Accounts management
const DEFAULT_ACCOUNTS = [
  { id: 1, username: 'admin', role: 'admin', name: 'Quản Trị Viên', avatar: 'AD', status: 'active' },
  { id: 2, username: 'manager', role: 'manager', name: 'Nguyễn Quản Lý', avatar: 'QL', status: 'active' },
  { id: 3, username: 'trainer', role: 'trainer', name: 'HLV Minh Tuấn', avatar: 'MT', status: 'active', trainerId: 1 },
  { id: 4, username: 'member', role: 'member', name: 'Trần Thị Bích', avatar: 'TB', status: 'active', memberId: 1 }
];

const getStoredAccounts = () => {
  const stored = localStorage.getItem('mockAccounts');
  return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS;
};

const saveAccountsToStorage = (accounts) => {
  localStorage.setItem('mockAccounts', JSON.stringify(accounts));
};

let mockAccounts = getStoredAccounts();

// Account Management API
export const getAccounts = async () => {
  await delay();
  // Reload from localStorage to ensure latest data
  mockAccounts = getStoredAccounts();
  mockPasswords = getStoredPasswords();
  
  return mockAccounts.map(acc => ({
    ...acc,
    password: mockPasswords[acc.username] || ''
  }));
};

export const createAccount = async (data) => {
  await delay();
  
  // Load latest data from storage
  mockPasswords = getStoredPasswords();
  mockAccounts = getStoredAccounts();
  mockMembers = getStoredMembers();
  mockTrainers = getStoredTrainers();
  
  // Check if username exists
  if (mockAccounts.find(a => a.username === data.username)) {
    throw new Error('Tài khoản đã tồn tại');
  }
  
  let memberId = data.memberId || null;
  let trainerId = data.trainerId || null;
  
  // If creating new member
  if (data.role === 'member' && data.memberData) {
    const memberData = data.memberData;
    
    // Validate member data
    if (!memberData.hoten || !memberData.email) {
      throw new Error('Vui lòng nhập tên và email cho học viên');
    }
    
    // Check if email already exists
    if (mockMembers.find(m => m.email === memberData.email)) {
      throw new Error('Email đã tồn tại trong hệ thống');
    }
    
    // Create new member
    const newMemberId = Math.max(...mockMembers.map(m => m.id), 0) + 1;
    const newMember = {
      id: newMemberId,
      hoten: memberData.hoten,
      email: memberData.email,
      sdt: memberData.sdt || '',
      magoi: [],
      tiendo: 'Beginner',
      trangthai: 'đang tập',
      ngaydangky: new Date().toISOString().split('T')[0]
    };
    
    mockMembers.push(newMember);
    saveMembersToStorage();
    memberId = newMemberId;
  }
  
  // If creating new trainer
  if (data.role === 'trainer' && data.trainerData) {
    const trainerData = data.trainerData;
    
    // Validate trainer data
    if (!trainerData.hoten || !trainerData.email) {
      throw new Error('Vui lòng nhập tên và email cho huấn luyện viên');
    }
    
    // Check if email already exists
    if (mockTrainers.find(t => t.email === trainerData.email)) {
      throw new Error('Email đã tồn tại trong hệ thống');
    }
    
    // Create new trainer
    const newTrainerId = Math.max(...mockTrainers.map(t => t.id), 0) + 1;
    const newTrainer = {
      id: newTrainerId,
      hoten: trainerData.hoten,
      email: trainerData.email,
      sdt: trainerData.sdt || '',
      chuyenmon: trainerData.chuyenmon || 'Chưa cập nhật',
      kinhnghiem: trainerData.kinhnghiem || 0,
      trangthai: 'đang làm',
      luong: trainerData.luong || 0
    };
    
    mockTrainers.push(newTrainer);
    saveTrainersToStorage();
    trainerId = newTrainerId;
  }
  
  const newId = Math.max(...mockAccounts.map(a => a.id), 0) + 1;
  const newAccount = {
    id: newId,
    username: data.username,
    role: data.role,
    name: data.name,
    avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    status: 'active',
    trainerId: trainerId,
    memberId: memberId
  };
  
  mockAccounts.push(newAccount);
  mockPasswords[data.username] = data.password;
  
  saveAccountsToStorage(mockAccounts);
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
  
  return newAccount;
};

export const updateAccount = async (id, data) => {
  await delay();
  
  // Load latest data from storage
  mockPasswords = getStoredPasswords();
  mockAccounts = getStoredAccounts();
  mockMembers = getStoredMembers();
  mockTrainers = getStoredTrainers();
  
  const index = mockAccounts.findIndex(a => a.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Tài khoản không tồn tại');
  }
  
  const oldUsername = mockAccounts[index].username;
  const oldAccount = mockAccounts[index];
  
  // Extract member/trainer data if provided
  const { memberData, trainerData, ...accountData } = data;
  
  const updatedAccount = {
    ...mockAccounts[index],
    ...accountData,
    id: parseInt(id)
  };
  
  // If username changed, update password mapping
  if (data.username && data.username !== oldUsername) {
    mockPasswords[data.username] = mockPasswords[oldUsername];
    delete mockPasswords[oldUsername];
  }
  
  // Update member data if provided
  if (memberData && oldAccount.memberId) {
    const memberIndex = mockMembers.findIndex(m => m.id === oldAccount.memberId);
    if (memberIndex !== -1) {
      mockMembers[memberIndex] = {
        ...mockMembers[memberIndex],
        ...memberData
      };
      saveMembersToStorage();
    }
  }
  
  // Update trainer data if provided
  if (trainerData && oldAccount.trainerId) {
    const trainerIndex = mockTrainers.findIndex(t => t.id === oldAccount.trainerId);
    if (trainerIndex !== -1) {
      mockTrainers[trainerIndex] = {
        ...mockTrainers[trainerIndex],
        ...trainerData
      };
      saveTrainersToStorage();
      
      // Update trainer name in all schedules
      mockSchedules = getStoredSchedules();
      const updatedSchedules = mockSchedules.map(s => {
        if (s.hluyen_id === oldAccount.trainerId && trainerData.hoten) {
          return { ...s, hluyen_ten: trainerData.hoten };
        }
        return s;
      });
      mockSchedules = updatedSchedules;
      saveSchedulesToStorage();
    }
  }
  
  mockAccounts[index] = updatedAccount;
  saveAccountsToStorage(mockAccounts);
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
  
  return updatedAccount;
};

export const updateAccountPassword = async (username, newPassword) => {
  await delay();
  
  // Load latest passwords from localStorage to ensure consistency
  mockPasswords = getStoredPasswords();
  
  if (!mockPasswords.hasOwnProperty(username)) {
    throw new Error('Tài khoản không tồn tại');
  }
  
  mockPasswords[username] = newPassword;
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
  
  return { success: true, message: 'Cập nhật mật khẩu thành công' };
};

export const deleteAccount = async (id) => {
  await delay();
  
  // Load latest data from storage
  mockPasswords = getStoredPasswords();
  mockAccounts = getStoredAccounts();
  
  const account = mockAccounts.find(a => a.id === parseInt(id));
  
  if (!account) {
    throw new Error('Tài khoản không tồn tại');
  }
  
  if (account.username === 'admin') {
    throw new Error('Không thể xóa tài khoản admin');
  }
  
  delete mockPasswords[account.username];
  mockAccounts = mockAccounts.filter(a => a.id !== parseInt(id));
  
  saveAccountsToStorage(mockAccounts);
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
};

export const changePassword = async (username, currentPassword, newPassword) => {
  await delay();
  
  // Load latest passwords from localStorage
  mockPasswords = getStoredPasswords();
  
  // Verify current password
  if (!mockPasswords[username]) {
    throw new Error('Tài khoản không tồn tại');
  }
  
  if (mockPasswords[username] !== currentPassword) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }
  
  // Update password
  mockPasswords[username] = newPassword;
  
  // Save to localStorage (mock persistence)
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
  
  return { success: true, message: 'Đổi mật khẩu thành công' };
};

// Registration for members
export const registerMember = async (data) => {
  await delay();
  
  // Load latest data from storage
  mockPasswords = getStoredPasswords();
  mockAccounts = getStoredAccounts();
  mockMembers = getStoredMembers();
  mockPayments = getStoredPayments();
  const pkgs = getStoredPackages();
  
  // Check if username exists
  if (mockAccounts.find(a => a.username === data.username)) {
    throw new Error('Tài khoản đã tồn tại');
  }
  
  // Check if email exists in members
  if (mockMembers.find(m => m.email === data.email)) {
    throw new Error('Email đã được đăng ký');
  }
  
  // Validate password
  if (data.password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }
  
  // Get selected package info
  const selectedPackageId = parseInt(data.selectedPackage) || 1;
  const selectedPackage = pkgs.find(p => p.id === selectedPackageId);
  
  // Create new member with selected package
  const newMemberId = Math.max(...mockMembers.map(m => m.id), 0) + 1;
  const newMember = {
    id: newMemberId,
    hoten: data.name,
    email: data.email,
    sdt: data.phone || '',
    magoi: [selectedPackageId],
    tiendo: 'Beginner',
    trangthai: 'đang tập',
    ngaydangky: new Date().toISOString().split('T')[0]
  };
  
  mockMembers.push(newMember);
  saveMembersToStorage();
  
  // Create new account with member role
  const newAccountId = Math.max(...mockAccounts.map(a => a.id), 0) + 1;
  const newAccount = {
    id: newAccountId,
    username: data.username,
    role: 'member',
    name: data.name,
    avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    status: 'active',
    memberId: newMemberId,
    trainerId: null
  };
  
  mockAccounts.push(newAccount);
  mockPasswords[data.username] = data.password;
  
  saveAccountsToStorage(mockAccounts);
  localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));
  
  // 🎉 AUTO-CREATE PAYMENT REQUEST when member registers
  
  if (selectedPackage) {
    const newPaymentId = Math.max(...mockPayments.map(p => p.id), 0) + 1;
    const newPayment = {
      id: newPaymentId,
      hocvien_id: newMemberId,
      hocvien_ten: data.name,
      goi_id: selectedPackageId,
      goi_ten: selectedPackage.ten,
      sotien: selectedPackage.gia,
      phuongthuc: 'Chuyển khoản',
      trangthai: 'chờ xác nhận',
      ngay: new Date().toISOString().split('T')[0],
      ngay_duyet: null,
      ghichu: 'Yêu cầu thanh toán tự động từ hệ thống khi đăng ký'
    };
    
    mockPayments.push(newPayment);
    savePaymentsToStorage();
  } else {
    console.error('❌ Selected package not found!');
  }
  
  return { success: true, message: 'Đăng ký thành công! Yêu cầu thanh toán đã được gửi để xét duyệt.', account: newAccount };
};

export const updateMemberPackages = async (memberId, packageIds) => {
  await delay();
  
  console.log('🔄 updateMemberPackages called with:', { memberId, packageIds });
  
  // Load latest data from storage
  mockMembers = getStoredMembers();
  mockPayments = getStoredPayments();
  const pkgs = getStoredPackages();
  
  // Try multiple ways to find member
  let member = mockMembers.find(m => m.id === parseInt(memberId));
  if (!member) member = mockMembers.find(m => m.id === memberId);
  if (!member) member = mockMembers.find(m => String(m.id) === String(memberId));
  
  if (!member) {
    throw new Error(`Học viên không tồn tại. Đang tìm ID: ${memberId}`);
  }
  
  // Convert to array
  const newPackageIds = Array.isArray(packageIds) ? packageIds : [packageIds];
  const oldPackageIds = Array.isArray(member.magoi) ? member.magoi : [];
  
  // Find newly selected packages (packages that weren't previously selected)
  const newlySelected = newPackageIds.filter(id => !oldPackageIds.includes(id));
  
  // Update member's package list
  member.magoi = newPackageIds;
  saveMembersToStorage();
  
  // Auto-create payment requests for newly selected packages with status 'chờ xác nhận'
  for (const packageId of newlySelected) {
    // Check if payment already exists for this member and package
    const existingPayment = mockPayments.find(
      p => p.hocvien_id === parseInt(memberId) && p.goi_id === parseInt(packageId)
    );
    
    if (!existingPayment) {
      const pkg = pkgs.find(p => p.id === parseInt(packageId));
      if (pkg) {
        const newPaymentId = Math.max(...mockPayments.map(p => p.id), 0) + 1;
        const newPayment = {
          id: newPaymentId,
          hocvien_id: parseInt(memberId),
          hocvien_ten: member.hoten,
          goi_id: parseInt(packageId),
          goi_ten: pkg.ten,
          sotien: pkg.gia,
          phuongthuc: 'Chuyển khoản',
          trangthai: 'chờ xác nhận', // Pending approval status
          ngay: new Date().toISOString().split('T')[0],
          ghichu: 'Yêu cầu thanh toán tự động từ hệ thống',
        };
        mockPayments.push(newPayment);
      }
    }
  }
  
  savePaymentsToStorage();
  
  return { success: true, message: 'Cập nhật gói tập luyện thành công. Yêu cầu thanh toán đã được gửi để xét duyệt', member };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Members
export const getMembers = async () => { 
  await delay(); 
  mockMembers = getStoredMembers();
  return [...mockMembers]; 
};

export const getMember = async (id) => { 
  await delay(); 
  mockMembers = getStoredMembers();
  
  // Try multiple match methods
  let member = mockMembers.find(m => m.id === parseInt(id));
  if (!member) member = mockMembers.find(m => m.id === id);
  if (!member) member = mockMembers.find(m => String(m.id) === String(id));
  
  if (!member) {
    throw new Error(`Học viên với ID ${id} không tồn tại`);
  }
  
  return member;
};

// Packages
export const getPackages = async () => { await delay(); return [...getStoredPackages()]; };

export const createMember = async (data) => { 
  await delay(); 
  const newId = Math.max(...mockMembers.map(m => m.id), 0) + 1; 
  const newMember = { ...data, id: newId }; 
  mockMembers.push(newMember); 
  saveMembersToStorage(); 
  return newMember; 
};
export const updateMember = async (id, data) => { 
  await delay(); 
  const index = mockMembers.findIndex(m => m.id === parseInt(id)); 
  if (index !== -1) { 
    mockMembers[index] = { ...mockMembers[index], ...data }; 
    saveMembersToStorage(); 
    return mockMembers[index]; 
  } 
  throw new Error('Not found'); 
};
export const deleteMember = async (id) => { 
  await delay(); 
  const index = mockMembers.findIndex(m => m.id === parseInt(id)); 
  if (index !== -1) {
    mockMembers.splice(index, 1);
    saveMembersToStorage();
  }
};

// Trainers
export const getTrainers = async () => { await delay(); return [...mockTrainers]; };
export const createTrainer = async (data) => { 
  await delay(); 
  const newId = Math.max(...mockTrainers.map(t => t.id), 0) + 1; 
  const newTrainer = { ...data, id: newId }; 
  mockTrainers.push(newTrainer); 
  saveTrainersToStorage(); 
  return newTrainer; 
};
export const updateTrainer = async (id, data) => { 
  await delay(); 
  const index = mockTrainers.findIndex(t => t.id === parseInt(id)); 
  if (index !== -1) { 
    mockTrainers[index] = { ...mockTrainers[index], ...data }; 
    saveTrainersToStorage(); 
    return mockTrainers[index]; 
  } 
  throw new Error('Not found'); 
};
export const deleteTrainer = async (id) => { 
  await delay(); 
  const index = mockTrainers.findIndex(t => t.id === parseInt(id)); 
  if (index !== -1) {
    mockTrainers.splice(index, 1);
    saveTrainersToStorage();
  }
};

// Schedules
export const getSchedules = async () => { await delay(); return [...mockSchedules]; };
export const createSchedule = async (data) => { 
  await delay(); 
  const newId = Math.max(...mockSchedules.map(s => s.id), 0) + 1; 
  const newSchedule = { ...data, id: newId }; 
  mockSchedules.push(newSchedule); 
  saveSchedulesToStorage(); 
  return newSchedule; 
};
export const updateSchedule = async (id, data) => { 
  await delay(); 
  const index = mockSchedules.findIndex(s => s.id === parseInt(id)); 
  if (index !== -1) { 
    mockSchedules[index] = { ...mockSchedules[index], ...data }; 
    saveSchedulesToStorage(); 
    return mockSchedules[index]; 
  } 
  throw new Error('Not found'); 
};
export const deleteSchedule = async (id) => { 
  await delay(); 
  const index = mockSchedules.findIndex(s => s.id === parseInt(id)); 
  if (index !== -1) {
    mockSchedules.splice(index, 1);
    saveSchedulesToStorage();
  }
};

// Payments
export const getPayments = async () => { await delay(); return [...mockPayments]; };
export const createPayment = async (data) => { 
  await delay();
  
  // Load latest data
  mockMembers = getStoredMembers();
  
  const newId = Math.max(...mockPayments.map(p => p.id), 0) + 1; 
  const newPayment = { ...data, id: newId }; 
  mockPayments.push(newPayment); 
  savePaymentsToStorage();
  
  // If payment status is 'đã thanh toán', update member's magoi
  if (data.trangthai === 'đã thanh toán') {
    const member = mockMembers.find(m => m.id === parseInt(data.hocvien_id));
    if (member) {
      const memberPackages = Array.isArray(member.magoi) ? member.magoi : [];
      // Add package ID if not already in the list
      if (!memberPackages.includes(parseInt(data.goi_id))) {
        member.magoi = [...memberPackages, parseInt(data.goi_id)];
        saveMembersToStorage();
        window.dispatchEvent(new Event('membersUpdated'));
      }
    }
  }
  
  return newPayment; 
};
export const confirmPayment = async (id) => { 
  await delay(); 
  
  // Load latest data
  mockPayments = getStoredPayments();
  mockMembers = getStoredMembers();
  
  const payment = mockPayments.find(p => p.id === parseInt(id)); 
  if (payment) { 
    payment.trangthai = 'đã thanh toán'; 
    savePaymentsToStorage();
    
    // Update member's magoi to include the paid package
    const member = mockMembers.find(m => m.id === payment.hocvien_id);
    if (member) {
      const memberPackages = Array.isArray(member.magoi) ? member.magoi : [];
      // Add package ID if not already in the list
      if (!memberPackages.includes(payment.goi_id)) {
        member.magoi = [...memberPackages, payment.goi_id];
        saveMembersToStorage();
        window.dispatchEvent(new Event('membersUpdated'));
      }
    }
    
    return payment; 
  } 
  throw new Error('Not found'); 
};

// Get pending payments for approval (status: 'chờ xác nhận')
export const getPendingPayments = async () => {
  await delay();
  const storedData = localStorage.getItem('mockPayments');
  console.log('🔍 getPendingPayments called');
  console.log('   Raw localStorage mockPayments:', storedData);
  
  mockPayments = getStoredPayments();
  console.log('   getStoredPayments returned:', mockPayments);
  
  const pending = mockPayments.filter(p => p.trangthai === 'chờ xác nhận');
  console.log('   Filtered pending (status=chờ xác nhận):', pending);
  console.log('   Payment statuses:', mockPayments.map(p => ({ id: p.id, ten: p.hocvien_ten, status: p.trangthai })));
  
  return pending;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  await delay();
  mockPayments = getStoredPayments();
  return mockPayments.find(p => p.id === parseInt(id));
};

// Approve payment request (manager/admin action)
export const approvePayment = async (paymentId, notes = '') => {
  await delay();
  mockPayments = getStoredPayments();
  const payment = mockPayments.find(p => p.id === parseInt(paymentId));
  if (!payment) {
    throw new Error('Yêu cầu thanh toán không tìm thấy');
  }
  payment.trangthai = 'đã thanh toán';
  payment.ngay_duyet = new Date().toISOString().split('T')[0];
  if (notes) payment.ghichu = notes;
  savePaymentsToStorage();
  return payment;
};

// Reject payment request (manager/admin action)
export const rejectPayment = async (paymentId, reason = '') => {
  await delay();
  mockPayments = getStoredPayments();
  const payment = mockPayments.find(p => p.id === parseInt(paymentId));
  if (!payment) {
    throw new Error('Yêu cầu thanh toán không tìm thấy');
  }
  payment.trangthai = 'chưa thanh toán';
  payment.ngay_duyet = new Date().toISOString().split('T')[0];
  if (reason) payment.ghichu = reason;
  savePaymentsToStorage();
  return payment;
};

// Attendance
export const getAttendance = async () => { await delay(); return [...mockAttendance]; };
export const createAttendance = async (data) => { 
  await delay(); 
  const newId = Math.max(...mockAttendance.map(a => a.id), 0) + 1; 
  const newAttendance = { ...data, id: newId }; 
  mockAttendance.push(newAttendance); 
  saveAttendanceToStorage(); 
  return newAttendance; 
};

export const getTrainerAttendance = async (trainerId) => {
  await delay();
  return mockAttendance.filter(a => a.hlv_id === parseInt(trainerId));
};

export const createQuickAttendance = async (trainerId, scheduleId, attendanceData) => {
  await delay();
  const trainer = mockTrainers.find(t => t.id === parseInt(trainerId));
  const schedule = mockSchedules.find(s => s.id === parseInt(scheduleId));
  
  if (!trainer) throw new Error('HLV không tìm thấy');
  if (!schedule) throw new Error('Lịch không tìm thấy');
  
  const newId = Math.max(...mockAttendance.map(a => a.id), 0) + 1;
  const newAttendance = {
    id: newId,
    hlv_id: parseInt(trainerId),
    hlv_ten: trainer.hoten,
    hocvien_id: attendanceData.hocvien_id,
    hocvien_ten: attendanceData.hocvien_ten,
    lichid: parseInt(scheduleId),
    lich_ten: schedule.tenbomon,
    ngay: attendanceData.ngay || new Date().toISOString().split('T')[0],
    trangthai: attendanceData.trangthai || 'có mặt',
    ghichu: attendanceData.ghichu || ''
  };
  
  mockAttendance.push(newAttendance);
  saveAttendanceToStorage();
  return newAttendance;
};

export const getAttendanceByDateRange = async (trainerId, startDate, endDate) => {
  await delay();
  const filtered = mockAttendance.filter(a => 
    a.hlv_id === parseInt(trainerId) && 
    a.ngay >= startDate && 
    a.ngay <= endDate
  );
  return filtered;
};

export const updateAttendance = async (id, data) => {
  await delay();
  const index = mockAttendance.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    mockAttendance[index] = { ...mockAttendance[index], ...data };
    saveAttendanceToStorage();
    return mockAttendance[index];
  }
  throw new Error('Not found');
};

export const deleteAttendance = async (id) => {
  await delay();
  const index = mockAttendance.findIndex(a => a.id === parseInt(id));
  if (index !== -1) {
    mockAttendance.splice(index, 1);
    saveAttendanceToStorage();
  }
};

// Utility functions for resetting data
export const resetAllData = () => {
  mockMembers = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
  mockTrainers = JSON.parse(JSON.stringify(DEFAULT_TRAINERS));
  mockSchedules = JSON.parse(JSON.stringify(DEFAULT_SCHEDULES));
  mockPayments = JSON.parse(JSON.stringify(DEFAULT_PAYMENTS));
  mockAttendance = JSON.parse(JSON.stringify(DEFAULT_ATTENDANCE));
  
  saveMembersToStorage();
  saveTrainersToStorage();
  saveSchedulesToStorage();
  savePaymentsToStorage();
  saveAttendanceToStorage();
};

export const clearStorage = () => {
  localStorage.removeItem('mockMembers');
  localStorage.removeItem('mockTrainers');
  localStorage.removeItem('mockSchedules');
  localStorage.removeItem('mockPayments');
  localStorage.removeItem('mockAttendance');
};

// Schedule Approval System
export const registerSchedule = async (scheduleId, trainerId) => {
  await delay();
  const schedule = mockSchedules.find(s => s.id === parseInt(scheduleId));
  if (!schedule) throw new Error('Lịch không tìm thấy');
  
  const trainer = mockTrainers.find(t => t.id === parseInt(trainerId));
  if (!trainer) throw new Error('HLV không tìm thấy');
  
  // Check if trainer already registered
  if (schedule.danh_sach_hlv_dang_ky && schedule.danh_sach_hlv_dang_ky.some(h => h.hlv_id === trainerId)) {
    throw new Error('HLV này đã đăng ký lịch này rồi');
  }
  
  if (!schedule.danh_sach_hlv_dang_ky) {
    schedule.danh_sach_hlv_dang_ky = [];
  }
  
  schedule.danh_sach_hlv_dang_ky.push({
    hlv_id: trainerId,
    hlv_ten: trainer.hoten,
    trang_thai: 'chờ duyệt',
    ngay_dang_ky: new Date().toISOString().split('T')[0]
  });
  
  saveSchedulesToStorage();
  return schedule;
};

export const getPendingSchedules = async () => {
  await delay();
  return mockSchedules.filter(s => 
    s.danh_sach_hlv_dang_ky && s.danh_sach_hlv_dang_ky.some(h => h.trang_thai === 'chờ duyệt')
  );
};

export const approveScheduleRequest = async (scheduleId, trainerId) => {
  await delay();
  const schedule = mockSchedules.find(s => s.id === parseInt(scheduleId));
  if (!schedule) throw new Error('Lịch không tìm thấy');
  
  const hlv = schedule.danh_sach_hlv_dang_ky.find(h => h.hlv_id === parseInt(trainerId));
  if (!hlv) throw new Error('Đơn đăng ký không tìm thấy');
  
  hlv.trang_thai = 'đã duyệt';
  saveSchedulesToStorage();
  return schedule;
};

export const rejectScheduleRequest = async (scheduleId, trainerId, lyDo = '') => {
  await delay();
  const schedule = mockSchedules.find(s => s.id === parseInt(scheduleId));
  if (!schedule) throw new Error('Lịch không tìm thấy');
  
  const hIndex = schedule.danh_sach_hlv_dang_ky.findIndex(h => h.hlv_id === parseInt(trainerId));
  if (hIndex === -1) throw new Error('Đơn đăng ký không tìm thấy');
  
  schedule.danh_sach_hlv_dang_ky[hIndex].trang_thai = 'từ chối';
  schedule.danh_sach_hlv_dang_ky[hIndex].ly_do = lyDo;
  saveSchedulesToStorage();
  return schedule;
};

export const getTrainerScheduleRequests = async (trainerId) => {
  await delay();
  return mockSchedules.filter(s => 
    s.danh_sach_hlv_dang_ky && s.danh_sach_hlv_dang_ky.some(h => h.hlv_id === parseInt(trainerId))
  );
};

// ✅ MEMBER CLASS ENROLLMENT SYSTEM
// Storage for member enrollments
const DEFAULT_ENROLLMENTS = [];
const DEFAULT_ATTENDANCE_CLASSES = [];

let mockEnrollments = (() => {
  const stored = localStorage.getItem('mockEnrollments');
  return stored ? JSON.parse(stored) : DEFAULT_ENROLLMENTS;
})();

let mockAttendanceClasses = (() => {
  const stored = localStorage.getItem('mockAttendanceClasses');
  return stored ? JSON.parse(stored) : DEFAULT_ATTENDANCE_CLASSES;
})();

const saveEnrollmentsToStorage = () => {
  localStorage.setItem('mockEnrollments', JSON.stringify(mockEnrollments));
};

const saveAttendanceClassesToStorage = () => {
  localStorage.setItem('mockAttendanceClasses', JSON.stringify(mockAttendanceClasses));
};

// Get sessions remaining for member in a package
export const getSessionsRemaining = async (memberId, packageId) => {
  await delay();
  
  // Get member
  mockMembers = getStoredMembers();
  const member = mockMembers.find(m => m.id === parseInt(memberId));
  if (!member) throw new Error('Học viên không tìm thấy');
  
  // Get package
  const pkgs = getStoredPackages();
  const pkg = pkgs.find(p => p.id === parseInt(packageId));
  if (!pkg) throw new Error('Gói tập không tìm thấy');
  
  // Count attended sessions
  mockAttendanceClasses = (() => {
    const stored = localStorage.getItem('mockAttendanceClasses');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const attendedCount = mockAttendanceClasses.filter(
    a => a.hv_id === parseInt(memberId) && a.trang_thai === 'có mặt'
  ).length;
  
  // Get package sessions (default to 8 if not set)
  const totalSessions = pkg.buoi || 8;
  const remaining = Math.max(0, totalSessions - attendedCount);
  
  return {
    memberId: parseInt(memberId),
    packageId: parseInt(packageId),
    totalSessions: totalSessions,
    sessionsUsed: attendedCount,
    sessionsRemaining: remaining,
    canEnroll: remaining > 0
  };
};

// Enroll member in class
export const enrollMemberInClass = async (memberId, packageId, scheduleId) => {
  await delay();
  
  // Validate member
  mockMembers = getStoredMembers();
  const member = mockMembers.find(m => m.id === parseInt(memberId));
  if (!member) throw new Error('Học viên không tìm thấy');
  
  // Validate package
  const pkgs = getStoredPackages();
  const pkg = pkgs.find(p => p.id === parseInt(packageId));
  if (!pkg) throw new Error('Gói tập không tìm thấy');
  
  // Check if member has this package
  if (!Array.isArray(member.magoi) || !member.magoi.includes(parseInt(packageId))) {
    throw new Error('Học viên không có gói tập này');
  }
  
  // Validate schedule
  mockSchedules = getStoredSchedules();
  const schedule = mockSchedules.find(s => s.id === parseInt(scheduleId));
  if (!schedule) throw new Error('Lịch học không tìm thấy');
  
  // Check already enrolled
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const existing = mockEnrollments.find(
    e => e.hv_id === parseInt(memberId) && e.lich_hoc_id === parseInt(scheduleId)
  );
  if (existing) throw new Error('Học viên đã đăng ký lớp này rồi');
  
  // Check sessions remaining
  mockAttendanceClasses = (() => {
    const stored = localStorage.getItem('mockAttendanceClasses');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const attendedCount = mockAttendanceClasses.filter(
    a => a.hv_id === parseInt(memberId) && a.trang_thai === 'có mặt'
  ).length;
  
  const totalSessions = pkg.buoi || 8;
  const remaining = totalSessions - attendedCount;
  
  if (remaining <= 0) {
    throw new Error('Hết số buổi cho phép trong gói tập này');
  }
  
  // Create enrollment
  const newEnrollmentId = Math.max(...mockEnrollments.map(e => e.id || 0), 0) + 1;
  const newEnrollment = {
    id: newEnrollmentId,
    hv_id: parseInt(memberId),
    goi_id: parseInt(packageId),
    lich_hoc_id: parseInt(scheduleId),
    so_buoi_da_su_dung: attendedCount,
    so_buoi_con_lai: remaining,
    trang_thai: 'đang học',
    created_at: new Date().toISOString().split('T')[0]
  };
  
  mockEnrollments.push(newEnrollment);
  saveEnrollmentsToStorage();
  
  return {
    enrollmentId: newEnrollmentId,
    memberId: parseInt(memberId),
    classId: parseInt(scheduleId),
    packageName: pkg.ten,
    totalSessions: totalSessions,
    sessionsUsed: attendedCount,
    sessionsRemaining: remaining,
    status: 'đang học',
    message: 'Đăng ký lớp thành công!'
  };
};

// Get member enrollments
export const getMemberEnrollments = async (memberId) => {
  await delay();
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  return mockEnrollments.filter(e => e.hv_id === parseInt(memberId));
};

// Check if member is enrolled in class
export const isMemberEnrolledInClass = async (memberId, scheduleId) => {
  await delay();
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const enrollment = mockEnrollments.find(
    e => e.hv_id === parseInt(memberId) && e.lich_hoc_id === parseInt(scheduleId)
  );
  return !!enrollment;
};

// Get class enrollments
export const getClassEnrollments = async (scheduleId) => {
  await delay();
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  return mockEnrollments.filter(e => e.lich_hoc_id === parseInt(scheduleId));
};

// Unenroll member from class
export const unenrollMemberFromClass = async (enrollmentId) => {
  await delay();
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const index = mockEnrollments.findIndex(e => e.id === parseInt(enrollmentId));
  if (index === -1) throw new Error('Đăng ký không tìm thấy');
  
  mockEnrollments[index].trang_thai = 'kết thúc';
  saveEnrollmentsToStorage();
  return mockEnrollments[index];
};

// Mark attendance for member in class
export const markClassAttendance = async (memberId, scheduleId, ngayHoc, trangThai = 'có mặt') => {
  await delay();
  
  // Validate enrollment exists
  mockEnrollments = (() => {
    const stored = localStorage.getItem('mockEnrollments');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const enrollment = mockEnrollments.find(
    e => e.hv_id === parseInt(memberId) && e.lich_hoc_id === parseInt(scheduleId)
  );
  if (!enrollment) throw new Error('Học viên không được đăng ký lớp này');
  
  // Create attendance record
  mockAttendanceClasses = (() => {
    const stored = localStorage.getItem('mockAttendanceClasses');
    return stored ? JSON.parse(stored) : [];
  })();
  
  const newAttendanceId = Math.max(...mockAttendanceClasses.map(a => a.id || 0), 0) + 1;
  const newAttendance = {
    id: newAttendanceId,
    hv_id: parseInt(memberId),
    lich_hoc_id: parseInt(scheduleId),
    ngay_hoc: ngayHoc,
    trang_thai: trangThai,
    created_at: new Date().toISOString()
  };
  
  mockAttendanceClasses.push(newAttendance);
  
  // Update enrollment sessions count if attended
  if (trangThai === 'có mặt') {
    const attendedCount = mockAttendanceClasses.filter(
      a => a.hv_id === parseInt(memberId) && a.trang_thai === 'có mặt'
    ).length;
    
    enrollment.so_buoi_da_su_dung = attendedCount;
    enrollment.so_buoi_con_lai = Math.max(0, enrollment.so_buoi_con_lai - 1);
    saveEnrollmentsToStorage();
  }
  
  saveAttendanceClassesToStorage();
  
  return newAttendance;
};

// Get class attendance for member
export const getClassAttendance = async (memberId, scheduleId) => {
  await delay();
  mockAttendanceClasses = (() => {
    const stored = localStorage.getItem('mockAttendanceClasses');
    return stored ? JSON.parse(stored) : [];
  })();
  
  return mockAttendanceClasses.filter(
    a => a.hv_id === parseInt(memberId) && a.lich_hoc_id === parseInt(scheduleId)
  );
};
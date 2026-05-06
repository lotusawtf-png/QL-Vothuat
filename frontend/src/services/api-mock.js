// src/services/api.js - MOCK VERSION WITH LOCALSTORAGE PERSISTENCE

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Default mock data - used only if localStorage is empty
const DEFAULT_MEMBERS = [
  { id: 1, hoten: "Trần Thị Bích", email: "bich@gmail.com", sdt: "0901234567", magoi: [], tiendo: "Beginner", trangthai: "đang tập", ngaydangky: "2025-01-10" },
  { id: 2, hoten: "Nguyễn Hoàng Nam", email: "nam@gmail.com", sdt: "0912345678", magoi: [2], tiendo: "Intermediate", trangthai: "đang tập", ngaydangky: "2025-02-01" },
  { id: 3, hoten: "Lê Văn Hùng", email: "hung@gmail.com", sdt: "0923456789", magoi: [1], tiendo: "Beginner", trangthai: "tạm nghỉ", ngaydangky: "2025-01-20" },
  { id: 4, hoten: "Phạm Thị Lan", email: "lan@gmail.com", sdt: "0934567890", magoi: [3], tiendo: "Advanced", trangthai: "đang tập", ngaydangky: "2024-12-01" }
];

const DEFAULT_PACKAGES = [
  { id: 1, ten: "Gói Chiến Binh", gia: 800000, thang: 1, mota: "8 buổi/tháng" },
  { id: 2, ten: "Gói Chiến Thần", gia: 2100000, thang: 3, mota: "12 buổi/tháng" },
  { id: 3, ten: "Gói Vô Địch", gia: 3600000, thang: 6, mota: "Không giới hạn" }
];

const DEFAULT_TRAINERS = [
  { id: 1, hoten: "HLV Minh Tuấn", email: "tuan@vnb.vn", sdt: "0901111111", chuyenmon: "MMA, Boxing", kinhnghiem: 8, trangthai: "đang làm", luong: 15000000 },
  { id: 2, hoten: "HLV Thanh Hà", email: "ha@vnb.vn", sdt: "0902222222", chuyenmon: "Muay Thai, Kickboxing", kinhnghiem: 6, trangthai: "đang làm", luong: 12000000 },
  { id: 3, hoten: "HLV Quốc Khánh", email: "khanh@vnb.vn", sdt: "0903333333", chuyenmon: "Jiu-Jitsu, Wrestling", kinhnghiem: 10, trangthai: "đang làm", luong: 18000000 }
];

const DEFAULT_SCHEDULES = [
  { id: 1, tenbomon: "MMA Cơ Bản", goi_id: 1, hluyen_id: 1, hluyen_ten: "HLV Minh Tuấn", thu: "Thứ 2,4,6", gio: "06:00–07:30", phongtap: "Sàn MMA", sisotoida: 20, sisohientai: 15, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 2, tenbomon: "Muay Thai Nâng Cao", goi_id: 2, hluyen_id: 2, hluyen_ten: "HLV Thanh Hà", thu: "Thứ 3,5,7", gio: "17:30–19:00", phongtap: "Sàn Muay", sisotoida: 15, sisohientai: 12, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 3, tenbomon: "Jiu-Jitsu Cơ Bản", goi_id: 1, hluyen_id: 3, hluyen_ten: "HLV Quốc Khánh", thu: "Thứ 2,4,6", gio: "19:00–20:30", phongtap: "Sàn Judo", sisotoida: 12, sisohientai: 10, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] },
  { id: 4, tenbomon: "Boxing Cơ Bản", goi_id: 1, hluyen_id: 1, hluyen_ten: "HLV Minh Tuấn", thu: "Thứ 3,5", gio: "07:30–09:00", phongtap: "Sàn Boxing", sisotoida: 18, sisohientai: 8, trangthai: "đang mở", trang_thai_duyet: "đã duyệt", danh_sach_hlv_dang_ky: [] }
];

const DEFAULT_PAYMENTS = [
  { id: 1, hocvien_id: 1, hocvien_ten: "Trần Thị Bích", goi_id: 1, goi_ten: "Gói Chiến Binh", sotien: 800000, phuongthuc: "Chuyển khoản", trangthai: "đã thanh toán", ngay: "2025-01-10" },
  { id: 2, hocvien_id: 2, hocvien_ten: "Nguyễn Hoàng Nam", goi_id: 2, goi_ten: "Gói Chiến Thần", sotien: 2100000, phuongthuc: "Tiền mặt", trangthai: "đã thanh toán", ngay: "2025-02-01" },
  { id: 3, hocvien_id: 3, hocvien_ten: "Lê Văn Hùng", goi_id: 1, goi_ten: "Gói Chiến Binh", sotien: 800000, phuongthuc: "QR Code", trangthai: "chờ xác nhận", ngay: "2025-03-01" },
  { id: 4, hocvien_id: 4, hocvien_ten: "Phạm Thị Lan", goi_id: 3, goi_ten: "Gói Vô Địch", sotien: 3600000, phuongthuc: "Tiền mặt", trangthai: "đã thanh toán", ngay: "2024-12-01" }
];

const DEFAULT_ATTENDANCE = [
  { id: 1, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2025-05-01", trangthai: "có mặt", ghichu: "" },
  { id: 2, hlv_id: 2, hlv_ten: "HLV Thanh Hà", hocvien_id: 2, hocvien_ten: "Nguyễn Hoàng Nam", lichid: 2, lich_ten: "Muay Thai Nâng Cao", ngay: "2025-05-01", trangthai: "có mặt", ghichu: "" },
  { id: 3, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 3, hocvien_ten: "Lê Văn Hùng", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2025-05-01", trangthai: "vắng mặt", ghichu: "Bệnh" },
  { id: 4, hlv_id: 1, hlv_ten: "HLV Minh Tuấn", hocvien_id: 1, hocvien_ten: "Trần Thị Bích", lichid: 1, lich_ten: "MMA Cơ Bản", ngay: "2025-04-29", trangthai: "có mặt", ghichu: "" }
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

// Initialize data on first load
let mockMembers = getStoredMembers();
let mockTrainers = getStoredTrainers();
let mockSchedules = getStoredSchedules();
let mockPayments = getStoredPayments();
let mockAttendance = getStoredAttendance();

// Helper functions to save data to localStorage
const saveMembersToStorage = () => {
  localStorage.setItem('mockMembers', JSON.stringify(mockMembers));
};

const saveTrainersToStorage = () => {
  localStorage.setItem('mockTrainers', JSON.stringify(mockTrainers));
};

const saveSchedulesToStorage = () => {
  localStorage.setItem('mockSchedules', JSON.stringify(mockSchedules));
};

const savePaymentsToStorage = () => {
  localStorage.setItem('mockPayments', JSON.stringify(mockPayments));
};

const saveAttendanceToStorage = () => {
  localStorage.setItem('mockAttendance', JSON.stringify(mockAttendance));
};

// Auth
export const login = async (username, password) => {
  await delay();
  console.log("Login attempt:", username, password);
  
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
  
  // Check if username exists
  if (mockAccounts.find(a => a.username === data.username)) {
    throw new Error('Tài khoản đã tồn tại');
  }
  
  const newId = Math.max(...mockAccounts.map(a => a.id), 0) + 1;
  const newAccount = {
    id: newId,
    username: data.username,
    role: data.role,
    name: data.name,
    avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    status: 'active',
    trainerId: data.trainerId || null,
    memberId: data.memberId || null
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
  
  const index = mockAccounts.findIndex(a => a.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Tài khoản không tồn tại');
  }
  
  const oldUsername = mockAccounts[index].username;
  const updatedAccount = {
    ...mockAccounts[index],
    ...data,
    id: parseInt(id)
  };
  
  // If username changed, update password mapping
  if (data.username && data.username !== oldUsername) {
    mockPasswords[data.username] = mockPasswords[oldUsername];
    delete mockPasswords[oldUsername];
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
  
  // Create new member with empty packages array (will be filled when member selects packages)
  const newMemberId = Math.max(...mockMembers.map(m => m.id), 0) + 1;
  const newMember = {
    id: newMemberId,
    hoten: data.name,
    email: data.email,
    sdt: data.phone || '',
    magoi: [],
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
  
  return { success: true, message: 'Đăng ký thành công', account: newAccount };
};

export const updateMemberPackages = async (memberId, packageIds) => {
  await delay();
  
  console.log('🔄 updateMemberPackages called with:', { memberId, packageIds });
  
  // Load latest data from storage
  mockMembers = getStoredMembers();
  console.log('📋 Current mockMembers:', mockMembers);
  console.log('🔍 Looking for member with ID:', memberId, 'Type:', typeof memberId);
  
  // Try multiple ways to find member
  let member = mockMembers.find(m => m.id === parseInt(memberId));
  console.log('✓ Method 1 (parseInt):', member);
  
  if (!member) {
    member = mockMembers.find(m => m.id === memberId);
    console.log('✓ Method 2 (direct):', member);
  }
  
  if (!member) {
    member = mockMembers.find(m => String(m.id) === String(memberId));
    console.log('✓ Method 3 (string):', member);
  }
  
  if (!member) {
    member = mockMembers[0];
    console.log('✓ Method 4 (fallback to first):', member);
  }
  
  if (!member) {
    throw new Error(`Học viên không tồn tại. Đang tìm ID: ${memberId}`);
  }
  
  console.log('✅ Member found:', member);
  
  // Update member's package list
  member.magoi = Array.isArray(packageIds) ? packageIds : [packageIds];
  saveMembersToStorage();
  
  console.log('✅ Updated member packages:', member.magoi);
  
  return { success: true, message: 'Cập nhật gói tập luyện thành công', member };
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
  
  console.log('🔍 getMember called with ID:', id, 'Type:', typeof id);
  console.log('📋 mockMembers:', mockMembers);
  
  // Try method 1: parseInt
  let member = mockMembers.find(m => m.id === parseInt(id));
  if (member) {
    console.log('✓ Found by parseInt:', member);
    return member;
  }
  
  // Try method 2: direct comparison
  member = mockMembers.find(m => m.id === id);
  if (member) {
    console.log('✓ Found by direct:', member);
    return member;
  }
  
  // Try method 3: string comparison
  member = mockMembers.find(m => String(m.id) === String(id));
  if (member) {
    console.log('✓ Found by string:', member);
    return member;
  }
  
  // Fallback to first member
  console.warn('⚠️ No exact match found, returning first member as fallback');
  return mockMembers[0] || null;
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
  const newId = Math.max(...mockPayments.map(p => p.id), 0) + 1; 
  const newPayment = { ...data, id: newId }; 
  mockPayments.push(newPayment); 
  savePaymentsToStorage(); 
  return newPayment; 
};
export const confirmPayment = async (id) => { 
  await delay(); 
  const payment = mockPayments.find(p => p.id === parseInt(id)); 
  if (payment) { 
    payment.trangthai = 'đã thanh toán'; 
    savePaymentsToStorage(); 
    return payment; 
  } 
  throw new Error('Not found'); 
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
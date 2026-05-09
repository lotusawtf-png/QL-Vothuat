import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Lock, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { getAccounts, createAccount, updateAccount, updateAccountPassword, deleteAccount, getMembers, getTrainers } from '../services/api';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Quản Trị Viên' },
  { value: 'manager', label: 'Quản Lý' },
  { value: 'trainer', label: 'Huấn Luyện Viên' },
  { value: 'member', label: 'Học Viên' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Vô hiệu hóa' }
];

export default function AccountsPage({ user }) {
  const { user: currentUser, updateUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [form, setForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadData();
    
    // Auto-refresh accounts every 10 seconds
    const refreshInterval = setInterval(loadData, 10000);
    
    // Listen for member/trainer updates
    const handleDataUpdated = () => {
      loadData();
    };
    window.addEventListener('membersUpdated', handleDataUpdated);
    
    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('membersUpdated', handleDataUpdated);
    };
  }, []);

  const loadData = async () => {
    try {
      const [accountsData, membersData, trainersData] = await Promise.all([
        getAccounts(),
        getMembers(),
        getTrainers()
      ]);
      setAccounts(accountsData);
      setMembers(membersData);
      setTrainers(trainersData);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedAccount(null);
    setForm({
      username: '',
      name: '',
      role: 'member',
      password: '',
      status: 'active',
      memberId: null,
      trainerId: null,
      newMemberMode: true,
      newTrainerMode: true,
      memberData: {
        hoten: '',
        email: '',
        sdt: ''
      },
      trainerData: {
        hoten: '',
        email: '',
        sdt: '',
        chuyenmon: '',
        kinhnghiem: 0
      }
    });
    setModal(true);
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    
    // Initialize form with proper structure based on role
    const baseForm = {
      username: account.username,
      name: account.name,
      role: account.role,
      status: account.status,
      memberId: account.memberId || null,
      trainerId: account.trainerId || null,
      newMemberMode: false,
      newTrainerMode: false,
      memberData: {
        hoten: '',
        email: '',
        sdt: ''
      },
      trainerData: {
        hoten: '',
        email: '',
        sdt: '',
        chuyenmon: '',
        kinhnghiem: 0
      }
    };

    // For member accounts, load current member data if available
    if (account.role === 'member' && account.memberId && members && members.length > 0) {
      const member = members.find(m => m.id === account.memberId);
      if (member) {
        baseForm.memberData = {
          hoten: member.hoten || '',
          email: member.email || '',
          sdt: member.sdt || ''
        };
      }
    }

    // For trainer accounts, load current trainer data if available
    if (account.role === 'trainer' && account.trainerId && trainers && trainers.length > 0) {
      const trainer = trainers.find(t => t.id === account.trainerId);
      if (trainer) {
        baseForm.trainerData = {
          hoten: trainer.hoten || '',
          email: trainer.email || '',
          sdt: trainer.sdt || '',
          chuyenmon: trainer.chuyenmon || '',
          kinhnghiem: trainer.kinhnghiem || 0
        };
      }
    }

    setForm(baseForm);
    setModal(true);
  };

  const openPasswordModal = (account) => {
    setSelectedAccount(account);
    setPasswordForm({
      username: account.username,
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordModal(true);
  };

  const handleSave = async () => {
    setMessage('');

    if (!form.username.trim() || !form.name.trim()) {
      setMessage('Vui lòng nhập tên tài khoản và tên');
      setMessageType('error');
      return;
    }

    if (!selectedAccount && !form.password) {
      setMessage('Vui lòng nhập mật khẩu');
      setMessageType('error');
      return;
    }

    // Validate role-specific requirements
    if (form.role === 'member') {
      if (form.newMemberMode) {
        // Creating new member
        if (!form.memberData.hoten.trim()) {
          setMessage('Vui lòng nhập tên học viên');
          setMessageType('error');
          return;
        }
        if (!form.memberData.email.trim()) {
          setMessage('Vui lòng nhập email học viên');
          setMessageType('error');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.memberData.email)) {
          setMessage('Email không hợp lệ');
          setMessageType('error');
          return;
        }
      } else {
        // Selecting existing member
        if (!form.memberId) {
          setMessage('Vui lòng chọn học viên cho tài khoản này');
          setMessageType('error');
          return;
        }
      }
    }

    if (form.role === 'trainer') {
      if (form.newTrainerMode) {
        // Creating new trainer
        if (!form.trainerData.hoten.trim()) {
          setMessage('Vui lòng nhập tên huấn luyện viên');
          setMessageType('error');
          return;
        }
        if (!form.trainerData.email.trim()) {
          setMessage('Vui lòng nhập email huấn luyện viên');
          setMessageType('error');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.trainerData.email)) {
          setMessage('Email không hợp lệ');
          setMessageType('error');
          return;
        }
      } else {
        // Selecting existing trainer
        if (!form.trainerId) {
          setMessage('Vui lòng chọn huấn luyện viên cho tài khoản này');
          setMessageType('error');
          return;
        }
      }
    }

    try {
      if (selectedAccount) {
        // When updating, prepare the data to send
        const dataToUpdate = {
          username: form.username,
          name: form.name,
          role: form.role,
          status: form.status,
          memberId: form.memberId || null,
          trainerId: form.trainerId || null
        };
        
        // Include member/trainer data if applicable
        if (form.role === 'member' && form.memberId) {
          dataToUpdate.memberData = form.memberData;
        }
        if (form.role === 'trainer' && form.trainerId) {
          dataToUpdate.trainerData = form.trainerData;
        }
        
        console.log('Updating account with data:', dataToUpdate);
        const updatedAccount = await updateAccount(selectedAccount.id, dataToUpdate);
        
        // If updating current user's account, update AuthContext
        // Compare by ID to ensure accuracy
        if ((currentUser && currentUser.id === selectedAccount.id) || (user && user.id === selectedAccount.id)) {
          console.log('Updating current user info in AuthContext');
          updateUser({
            name: form.name,
            role: form.role,
            status: form.status,
            avatar: selectedAccount.avatar
          });
        }
        
        setMessage('✓ Cập nhật tài khoản thành công');
      } else {
        const dataToCreate = {
          username: form.username,
          name: form.name,
          role: form.role,
          password: form.password,
          status: form.status,
          memberId: form.memberId || null,
          trainerId: form.trainerId || null,
          ...(form.role === 'member' && form.newMemberMode && { memberData: form.memberData }),
          ...(form.role === 'trainer' && form.newTrainerMode && { trainerData: form.trainerData })
        };
        console.log('Creating account with data:', dataToCreate);
        await createAccount(dataToCreate);
        setMessage('✓ Thêm tài khoản thành công');
      }
      setMessageType('success');
      setModal(false);
      loadData();
    } catch (error) {
      console.error('Error in handleSave:', error);
      setMessage(error?.message || 'Có lỗi xảy ra');
      setMessageType('error');
    }
  };

  const handlePasswordChange = async () => {
    setMessage('');

    if (!passwordForm.newPassword.trim()) {
      setMessage('Vui lòng nhập mật khẩu mới');
      setMessageType('error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      setMessageType('error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      setMessageType('error');
      return;
    }

    try {
      await updateAccountPassword(passwordForm.username, passwordForm.newPassword);
      setMessage('✓ Đổi mật khẩu thành công');
      setMessageType('success');
      setPasswordModal(false);
      loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  const handleDelete = async (accountId, username) => {
    if (username === 'admin') {
      setMessage('Không thể xóa tài khoản admin');
      setMessageType('error');
      return;
    }

    if (!window.confirm(`Bạn chắc chắn muốn xóa tài khoản này?`)) return;

    try {
      await deleteAccount(accountId);
      setMessage('✓ Xóa tài khoản thành công');
      setMessageType('success');
      loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
            Quản Lý Tài Khoản
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            Tổng: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>{accounts.length}</span> tài khoản
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={15} /> Thêm Tài Khoản
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(76, 175, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Tài Khoản</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{accounts.length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Hoạt động: <span style={{ color: '#4caf50', fontWeight: 700 }}>+{accounts.filter(a => a.status === 'active').length}</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(79, 195, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(79, 195, 247, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Admin</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{accounts.filter(a => a.role === 'admin').length}</p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 152, 0, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(255, 152, 0, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Quản Lý</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{accounts.filter(a => a.role === 'manager').length}</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          marginBottom: 24,
          padding: '14px 16px',
          borderRadius: '12px',
          background: messageType === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
          border: `1px solid ${messageType === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          {messageType === 'success' ? (
            <CheckCircle2 size={20} color="#4caf50" />
          ) : (
            <AlertCircle size={20} color="#ef5350" />
          )}
          <span style={{ color: messageType === 'success' ? '#4caf50' : '#ef5350', fontSize: 13, fontWeight: 500 }}>
            {message}
          </span>
        </div>
      )}

      {/* Accounts Table */}
      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={16} color="#4caf50" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Danh sách tài khoản</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.5px' }}>Tài Khoản</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.5px' }}>Tên</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.5px' }}>Vai Trò</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.5px' }}>Trạng Thái</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.5px' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={account.avatar} size={32} />
                      <span>{account.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#fff' }}>{account.name}</td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af' }}>
                    <span style={{
                      background: account.role === 'admin' ? 'rgba(196, 30, 58, 0.2)' :
                                  account.role === 'manager' ? 'rgba(255, 152, 0, 0.2)' :
                                  account.role === 'trainer' ? 'rgba(79, 195, 247, 0.2)' : 'rgba(129, 199, 132, 0.2)',
                      color: account.role === 'admin' ? '#c41e3a' :
                             account.role === 'manager' ? '#ff9800' :
                             account.role === 'trainer' ? '#4fc3f7' : '#81c784',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      {ROLE_OPTIONS.find(r => r.value === account.role)?.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af' }}>
                    <span style={{
                      background: account.status === 'active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)',
                      color: account.status === 'active' ? '#4caf50' : '#9e9e9e',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      {STATUS_OPTIONS.find(s => s.value === account.status)?.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        onClick={() => openPasswordModal(account)}
                        title="Đổi mật khẩu"
                        style={{
                          background: 'rgba(79, 195, 247, 0.2)',
                          border: 'none',
                          color: '#4fc3f7',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        <Lock size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(account)}
                        title="Chỉnh sửa"
                        style={{
                          background: 'rgba(76, 175, 80, 0.2)',
                          border: 'none',
                          color: '#4caf50',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      {account.username !== 'admin' && (
                        <button
                          onClick={() => handleDelete(account.id, account.username)}
                          title="Xóa"
                          style={{
                            background: 'rgba(239, 83, 80, 0.2)',
                            border: 'none',
                            color: '#ef5350',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 600
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(76, 175, 80, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 24px 0' }}>
              {selectedAccount ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản'}
            </h2>

            {message && (
              <div style={{
                marginBottom: 16,
                padding: '12px',
                borderRadius: '8px',
                background: messageType === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                border: `1px solid ${messageType === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
                color: messageType === 'success' ? '#4caf50' : '#ef5350',
                fontSize: 12
              }}>
                {message}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tên Tài Khoản</label>
              <input
                className="input-field"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Ví dụ: user123"
                disabled={!!selectedAccount}
                style={{ opacity: selectedAccount ? 0.5 : 1 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tên Hiển Thị</label>
              <input
                className="input-field"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Vai Trò</label>
              <select
                className="input-field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value, memberId: null, trainerId: null })}
              >
                {ROLE_OPTIONS.map(r => (
                  <option key={r.value} value={r.value} style={{ background: '#0f1429', color: '#000000' }}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Trạng Thái</label>
              <select
                className="input-field"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value} style={{ background: '#0f1429', color: '#000000' }}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {form.role === 'member' && (
              <div>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                  <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' }}>
                    <input
                      type="radio"
                      checked={form.newMemberMode}
                      onChange={() => setForm({ ...form, newMemberMode: true, memberId: null })}
                      style={{ cursor: 'pointer' }}
                    />
                    Tạo Mới
                  </label>
                  <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' }}>
                    <input
                      type="radio"
                      checked={!form.newMemberMode}
                      onChange={() => setForm({ ...form, newMemberMode: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    Chọn Từ Danh Sách
                  </label>
                </div>

                {form.newMemberMode ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tên Học Viên *</label>
                      <input
                        className="input-field"
                        type="text"
                        value={form.memberData.hoten}
                        onChange={(e) => setForm({ ...form, memberData: { ...form.memberData, hoten: e.target.value } })}
                        placeholder="Ví dụ: Trần Thị Bích"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Email Học Viên *</label>
                      <input
                        className="input-field"
                        type="email"
                        value={form.memberData.email}
                        onChange={(e) => setForm({ ...form, memberData: { ...form.memberData, email: e.target.value } })}
                        placeholder="Ví dụ: bich@gmail.com"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Số Điện Thoại</label>
                      <input
                        className="input-field"
                        type="tel"
                        value={form.memberData.sdt}
                        onChange={(e) => setForm({ ...form, memberData: { ...form.memberData, sdt: e.target.value } })}
                        placeholder="Ví dụ: 0901234567"
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Chọn Học Viên *</label>
                    <select
                      className="input-field"
                      value={form.memberId || ''}
                      onChange={(e) => setForm({ ...form, memberId: e.target.value ? parseInt(e.target.value) : null })}
                    >
                      <option value="">-- Chọn học viên --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id} style={{ background: '#0f1429', color: '#000000' }}>
                          {m.hoten} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {form.role === 'trainer' && (
              <div>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                  <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' }}>
                    <input
                      type="radio"
                      checked={form.newTrainerMode}
                      onChange={() => setForm({ ...form, newTrainerMode: true, trainerId: null })}
                      style={{ cursor: 'pointer' }}
                    />
                    Tạo Mới
                  </label>
                  <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' }}>
                    <input
                      type="radio"
                      checked={!form.newTrainerMode}
                      onChange={() => setForm({ ...form, newTrainerMode: false })}
                      style={{ cursor: 'pointer' }}
                    />
                    Chọn Từ Danh Sách
                  </label>
                </div>

                {form.newTrainerMode ? (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Tên Huấn Luyện Viên *</label>
                      <input
                        className="input-field"
                        type="text"
                        value={form.trainerData.hoten}
                        onChange={(e) => setForm({ ...form, trainerData: { ...form.trainerData, hoten: e.target.value } })}
                        placeholder="Ví dụ: HLV Minh Tuấn"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Email Huấn Luyện Viên *</label>
                      <input
                        className="input-field"
                        type="email"
                        value={form.trainerData.email}
                        onChange={(e) => setForm({ ...form, trainerData: { ...form.trainerData, email: e.target.value } })}
                        placeholder="Ví dụ: trainer@gmail.com"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Số Điện Thoại</label>
                      <input
                        className="input-field"
                        type="tel"
                        value={form.trainerData.sdt}
                        onChange={(e) => setForm({ ...form, trainerData: { ...form.trainerData, sdt: e.target.value } })}
                        placeholder="Ví dụ: 0901234567"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Chuyên Môn</label>
                      <input
                        className="input-field"
                        type="text"
                        value={form.trainerData.chuyenmon}
                        onChange={(e) => setForm({ ...form, trainerData: { ...form.trainerData, chuyenmon: e.target.value } })}
                        placeholder="Ví dụ: MMA, Boxing"
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Kinh Nghiệm (năm)</label>
                      <input
                        className="input-field"
                        type="number"
                        value={form.trainerData.kinhnghiem}
                        onChange={(e) => setForm({ ...form, trainerData: { ...form.trainerData, kinhnghiem: parseInt(e.target.value) || 0 } })}
                        placeholder="Ví dụ: 5"
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Chọn Huấn Luyện Viên *</label>
                    <select
                      className="input-field"
                      value={form.trainerId || ''}
                      onChange={(e) => setForm({ ...form, trainerId: e.target.value ? parseInt(e.target.value) : null })}
                    >
                      <option value="">-- Chọn huấn luyện viên --</option>
                      {trainers.map(t => (
                        <option key={t.id} value={t.id} style={{ background: '#0f1429', color: '#000000' }}>
                          {t.hoten} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {!selectedAccount && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Mật Khẩu</label>
                <input
                  className="input-field"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  style={{ color: '#ffffff' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {selectedAccount ? 'Cập Nhật' : 'Thêm Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setPasswordModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(79, 195, 247, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 24px 0' }}>
              Đổi Mật Khẩu - {selectedAccount?.username}
            </h2>

            {message && (
              <div style={{
                marginBottom: 16,
                padding: '12px',
                borderRadius: '8px',
                background: messageType === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                border: `1px solid ${messageType === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
                color: messageType === 'success' ? '#4caf50' : '#ef5350',
                fontSize: 12
              }}>
                {message}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Mật Khẩu Mới</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                  style={{ color: '#ffffff', paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Xác Nhận Mật Khẩu</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="input-field"
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Nhập lại mật khẩu mới"
                  style={{ color: '#ffffff', paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setPasswordModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handlePasswordChange}>Đổi Mật Khẩu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

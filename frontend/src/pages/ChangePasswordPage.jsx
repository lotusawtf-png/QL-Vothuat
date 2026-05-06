import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { changePassword } from '../services/api';

export default function ChangePasswordPage({ user }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const getStrengthLabel = (strength) => {
    const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
    const colors = ['#ef5350', '#ff9800', '#fbc02d', '#7cb342', '#4caf50'];
    return { label: labels[strength - 1] || '', color: colors[strength - 1] || '#9ca3af' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!currentPassword.trim()) {
      setMessage('Vui lòng nhập mật khẩu hiện tại');
      setMessageType('error');
      return;
    }

    if (!newPassword.trim()) {
      setMessage('Vui lòng nhập mật khẩu mới');
      setMessageType('error');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      setMessageType('error');
      return;
    }

    if (currentPassword === newPassword) {
      setMessage('Mật khẩu mới không được giống mật khẩu cũ');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      await changePassword(user.username, currentPassword, newPassword);
      setMessage('✓ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setMessageType('success');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
          Bảo Mật Tài Khoản
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
          Cập nhật mật khẩu của bạn để bảo vệ tài khoản
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tài Khoản</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{user.name}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Vai trò: <span style={{ color: '#4fc3f7', fontWeight: 600 }}>
              {user.role === 'admin' ? 'Quản Trị Viên' : 
               user.role === 'manager' ? 'Quản Lý' :
               user.role === 'trainer' ? 'Huấn Luyện Viên' : 'Học Viên'}
            </span></p>
          </div>
        </div>

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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Trạng Thái Bảo Mật</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldCheck size={20} color="#4caf50" />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#4caf50' }}>Bình Thường</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Mật khẩu: <span style={{ color: '#4caf50', fontWeight: 600 }}>✓ Được bảo vệ</span></p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 193, 7, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(255, 193, 7, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Mẹo An Toàn</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fbc02d', marginBottom: 6 }}>3 Quy Tắc Vàng</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Tạo mật khẩu mạnh và thay đổi thường xuyên</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(79, 195, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={16} color="#4fc3f7" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Đổi Mật Khẩu</h2>
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            marginBottom: 24,
            padding: '14px 16px',
            borderRadius: '12px',
            background: messageType === 'success' 
              ? 'rgba(76, 175, 80, 0.1)' 
              : 'rgba(239, 83, 80, 0.1)',
            border: `1px solid ${messageType === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(239, 83, 80, 0.3)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'slideIn 0.3s ease-out'
          }}>
            {messageType === 'success' ? (
              <CheckCircle size={20} color="#4caf50" style={{ flexShrink: 0, marginTop: 2 }} />
            ) : (
              <AlertCircle size={20} color="#ef5350" style={{ flexShrink: 0, marginTop: 2 }} />
            )}
            <span style={{ 
              color: messageType === 'success' ? '#4caf50' : '#ef5350', 
              fontSize: 13, 
              fontWeight: 500,
              lineHeight: 1.5
            }}>
              {message}
            </span>
          </div>
        )}

        {/* Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Left Column - Password Inputs */}
          <div>
            {/* Current Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 13, 
                display: 'block', 
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Mật khẩu hiện tại
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  placeholder="Nhập mật khẩu hiện tại"
                  style={{
                    color: '#ffffff',
                    paddingRight: 40,
                    width: '100%'
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 13, 
                display: 'block', 
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Mật khẩu mới
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="Nhập mật khẩu mới"
                  style={{
                    color: '#ffffff',
                    paddingRight: 40,
                    width: '100%'
                  }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: i < passwordStrength ? strengthInfo.color : 'rgba(255,255,255,0.1)',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: strengthInfo.color, fontWeight: 600 }}>
                    Độ mạnh: {strengthInfo.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ 
                color: '#ffffff', 
                fontWeight: 700, 
                fontSize: 13, 
                display: 'block', 
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Xác nhận mật khẩu
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Nhập lại mật khẩu mới"
                  style={{
                    color: '#ffffff',
                    paddingRight: 40,
                    width: '100%'
                  }}
                  disabled={loading}
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
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && newPassword === confirmPassword && (
                <p style={{ fontSize: 12, color: '#4caf50', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14} /> Mật khẩu khớp
                </p>
              )}
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{ fontSize: 12, color: '#ef5350', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={14} /> Mật khẩu không khớp
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Tips */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0.02) 100%)',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              height: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255, 193, 7, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="#fbc02d" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Mẹo Tạo Mật Khẩu Mạnh</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '✓', text: 'Ít nhất 8 ký tự', color: '#4caf50' },
                  { icon: '✓', text: 'Chứa chữ hoa (A-Z)', color: '#4caf50' },
                  { icon: '✓', text: 'Chứa chữ thường (a-z)', color: '#4caf50' },
                  { icon: '✓', text: 'Chứa số (0-9)', color: '#fbc02d' },
                  { icon: '✓', text: 'Chứa ký tự đặc biệt (!@#$%)', color: '#fbc02d' },
                  { icon: '✗', text: 'Tránh thông tin cá nhân', color: '#ef5350' },
                  { icon: '✗', text: 'Không dùng lặp lại từ cũ', color: '#ef5350' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: 12 }}>{item.icon}</span>
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: 12, color: '#fbc02d', fontWeight: 600, marginBottom: 8 }}>💡 Khuyến nghị:</p>
                <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>
                  Đổi mật khẩu định kỳ (3 tháng/lần) để bảo vệ tài khoản tốt nhất
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            type="button"
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setMessage('');
            }}
            className="btn btn-ghost"
            disabled={loading}
          >
            Xóa
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: 200
            }}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

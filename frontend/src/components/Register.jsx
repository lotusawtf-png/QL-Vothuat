import { useState } from 'react';
import { Zap, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { registerMember } from '../services/api';

const PACKAGES = [
  { id: 1, ten: 'Gói Chiến Binh', gia: 800000 },
  { id: 2, ten: 'Gói Chiến Thần', gia: 2100000 },
  { id: 3, ten: 'Gói Vô Địch', gia: 3600000 },
];

export default function Register({ onBack }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    selectedPackage: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return false;
    }
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^0\d{9}$/.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ (phải bắt đầu từ 0 và có 10 chữ số)');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await registerMember(formData);
      setSuccess(result.message);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #6366f118 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #6366f110 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, #ffffff04 40px, #ffffff04 41px)', pointerEvents: 'none' }} />

      <div style={{ width: 480, position: 'relative', zIndex: 1 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#6366f1',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16
          }}
        >
          <ArrowLeft size={14} /> Quay Lại
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}>
              <Zap size={24} color="#fff" fill="#fff" />
            </div>
            <span className="gym-heading" style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '.04em' }}>VNB</span>
          </div>
          <p style={{ color: '#888', fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>Đăng Ký Tài Khoản Học Viên</p>
        </div>

        <div style={{ background: '#0f1429', border: '1px solid #1a1f3a', borderRadius: 14, padding: '32px', backdropFilter: 'blur(8px)' }}>
          <h2 className="gym-heading" style={{ color: '#f0f0f0', fontSize: 20, fontWeight: 700, marginBottom: 24, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tạo Tài Khoản Mới</h2>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1f3a', border: '1px solid #ef535033', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
              <AlertCircle size={14} color="#ef5350" />
              <span style={{ fontSize: 13, color: '#ef5350' }}>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1f3a', border: '1px solid #4caf5033', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
              <CheckCircle2 size={14} color="#4caf50" />
              <span style={{ fontSize: 13, color: '#4caf50' }}>{success}</span>
            </div>
          )}

          {/* Tên đăng nhập */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Tên Đăng Nhập</label>
            <input
              className="input-field"
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập (tối thiểu 3 ký tự)"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Họ Tên */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Họ Tên</label>
            <input
              className="input-field"
              type="text"
              name="name"
              placeholder="Nhập họ tên của bạn"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Email</label>
            <input
              className="input-field"
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Số Điện Thoại */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Số Điện Thoại</label>
            <input
              className="input-field"
              type="tel"
              name="phone"
              placeholder="Ví dụ: 0912345678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Chọn Gói Tập */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Chọn Gói Tập Luyện</label>
            <select
              className="input-field"
              name="selectedPackage"
              value={formData.selectedPackage}
              onChange={handleChange}
            >
              {PACKAGES.map(pkg => (
                <option key={pkg.id} value={pkg.id} style={{ color: '#000000', background: '#0f1429' }}>
                  {pkg.ten} - {new Intl.NumberFormat('vi-VN').format(pkg.gia)}₫
                </option>
              ))}
            </select>
          </div>

          {/* Mật Khẩu */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Mật Khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Xác Nhận Mật Khẩu */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Xác Nhận Mật Khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input-field"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ paddingRight: 40 }}
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 8, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600, borderRadius: 8 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
          Bạn đã có tài khoản?{' '}
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#6366f1',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}

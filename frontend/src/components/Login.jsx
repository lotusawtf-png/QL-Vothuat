import { useState } from 'react';
import { Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login } from '../services/api';

export default function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  setError('');
  setLoading(true);
  try {
    const user = await login(username, password);
    onLogin(user); // Sẽ set user trong App và render lại
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #6366f118 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #6366f110 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, #ffffff04 40px, #ffffff04 41px)', pointerEvents: 'none' }} />

      <div style={{ width: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}>
              <Zap size={24} color="#fff" fill="#fff" />
            </div>
            <span className="gym-heading" style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '.04em' }}>VNB</span>
          </div>
          <p style={{ color: '#888', fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>Quản Lý Phòng Tập Võ Thuật</p>
        </div>

        <div style={{ background: '#0f1429', border: '1px solid #1a1f3a', borderRadius: 14, padding: '32px 32px 28px', backdropFilter: 'blur(8px)' }}>
          <h2 className="gym-heading" style={{ color: '#f0f0f0', fontSize: 22, fontWeight: 700, marginBottom: 24, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Đăng Nhập Hệ Thống</h2>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1a1f3a', border: '1px solid #6366f133', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
              <AlertCircle size={14} color="#ef5350" />
              <span style={{ fontSize: 13, color: '#ef5350' }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Tên đăng nhập</label>
            <input className="input-field" placeholder="Nhập tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ paddingRight: 40 }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 8, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 600, borderRadius: 8 }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#888' }}>
            Bạn chưa có tài khoản?{' '}
            <button
              onClick={onRegister}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Đăng ký tại đây
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
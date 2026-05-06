// src/components/MainLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Dumbbell, Calendar, CreditCard, 
  ClipboardCheck, LogOut, Menu, ChevronLeft, ChevronRight,
  Settings, HelpCircle, CheckCircle, Lock, Shield
} from 'lucide-react';
import Avatar from './Avatar';

const ROLE_LABELS = { 
  admin: 'Quản Trị Viên', 
  manager: 'Quản Lý', 
  trainer: 'Huấn Luyện Viên', 
  member: 'Học Viên' 
};

const ROLE_COLORS = { 
  admin: '#c41e3a',   // đỏ đặc trưng
  manager: '#ff6b35', 
  trainer: '#4fc3f7', 
  member: '#81c784' 
};

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard, roles: ['admin','manager','trainer','member'] },
  { key: 'members', label: 'Học Viên', icon: Users, roles: ['admin','manager'] },
  { key: 'trainers', label: 'HLV', icon: Dumbbell, roles: ['admin','manager'] },
  { key: 'schedules', label: 'Lịch Học', icon: Calendar, roles: ['admin','manager','trainer','member'] },
  { key: 'approval', label: 'Duyệt Lịch Dạy', icon: CheckCircle, roles: ['admin'] },
  { key: 'accounts', label: 'Quản Lý Tài Khoản', icon: Shield, roles: ['admin','manager'] },
  { key: 'select-package', label: 'Chọn Gói', icon: CreditCard, roles: ['member'] },
  { key: 'payments', label: 'Thanh Toán', icon: CreditCard, roles: ['admin','manager','member'] },
  { key: 'payment-approval', label: 'Duyệt Thanh Toán', icon: CheckCircle, roles: ['admin','manager'] },
  { key: 'attendance', label: 'Điểm Danh', icon: ClipboardCheck, roles: ['admin','manager','trainer'] },
];

export default function MainLayout({ user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentKey = location.pathname.slice(1) || 'dashboard';

  const navItems = NAV_ITEMS.filter(item => 
    Array.isArray(item.roles) && item.roles.includes(user.role)
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d0d0d', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 80 : 260,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(15,20,41,0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(196,30,58,0.1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          overflowX: 'hidden',
          zIndex: 10,
          boxShadow: collapsed ? 'none' : '0 8px 32px rgba(0,0,0,0.5)'
        }}
      >
        {/* Logo + Toggle */}
        <div
          style={{
            padding: collapsed ? '20px 0' : '20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            minHeight: 72
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>V</span>
              </div>
              <span
                className="gym-heading"
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                VNB
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#aaa',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '24px 12px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 24, paddingLeft: collapsed ? 0 : 8 }}>
            {!collapsed && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#f1f1f1', textTransform: 'uppercase', letterSpacing: 1 }}>
                MENU
              </span>
            )}
          </div>
          {navItems.map((item) => {
            const isActive = currentKey === item.key || (user.role === 'member' && item.key === 'payments' && currentKey === 'member-payments');
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (user.role === 'member' && item.key === 'payments') {
                    navigate('/member-payments');
                  } else {
                    navigate(`/${item.key}`);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  width: '100%',
                  padding: collapsed ? '12px 0' : '12px 16px',
                  marginBottom: 8,
                  borderRadius: 12,
                  background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                  cursor: 'pointer',
                  color: isActive ? '#6366f1' : '#9ca3af',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  fontWeight: isActive ? 600 : 500
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                    e.currentTarget.style.color = '#e5e5e5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#b1b7c0';
                  }
                }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {!collapsed && (
                  <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div
                    style={{
                      marginLeft: 'auto',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#6366f1'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div
          style={{
            padding: collapsed ? '16px 0' : '20px 20px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: 'auto'
          }}
        >
          {collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Avatar initials={user.avatar} size={36} color={ROLE_COLORS[user.role]} />
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  padding: 8,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Avatar initials={user.avatar} size={44} color={ROLE_COLORS[user.role]} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#e0e0e0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {user.name}
                  </p>
                  <p style={{ fontSize: 12, color: ROLE_COLORS[user.role], fontWeight: 500 }}>
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '10px',
                  borderRadius: 12,
                  color: '#6366f1',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                  e.currentTarget.style.borderColor = '#6366f1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                }}
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0d0d0d' }}>
        <header
          style={{
            height: 72,
            background: 'linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(15,20,41,0.5) 100%)',
            borderBottom: '1px solid rgba(196,30,58,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            justifyContent: 'space-between'
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              <HelpCircle size={18} />
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                <Settings size={18} />
              </button>
              {showSettingsMenu && (
                <div style={{
                  position: 'absolute',
                  top: 40,
                  right: 0,
                  background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  minWidth: 200,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  zIndex: 1000
                }}>
                  <button
                    onClick={() => {
                      navigate('/change-password');
                      setShowSettingsMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 13,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                      e.currentTarget.style.color = '#6366f1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#fff';
                    }}
                  >
                    <Lock size={16} />
                    <span>Đổi Mật Khẩu</span>
                  </button>
                </div>
              )}
            </div>
            <div style={{ width: 1, height: 24, background: '#2a2a2a' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ROLE_COLORS[user.role] }} />
              <span style={{ fontSize: 13, color: '#ffffff', fontWeight: 500 }}>{ROLE_LABELS[user.role]}</span>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#0d0d0d' }}>{children}</main>
      </div>
    </div>
  );
}
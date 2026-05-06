// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, Dumbbell, Calendar, TrendingUp, Award, CheckCircle, AlertCircle, Zap, ClipboardCheck, ArrowRight, MoreHorizontal, CreditCard, Heart } from 'lucide-react';
import { getMembers, getTrainers, getSchedules, getPayments, getAttendance, getMember } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function Dashboard({ user }) {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [memberData, setMemberData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, trainersRes, schedulesRes, paymentsRes, attendanceRes] = await Promise.all([
          getMembers().catch(() => []),
          getTrainers().catch(() => []),
          getSchedules().catch(() => []),
          getPayments().catch(() => []),
          getAttendance().catch(() => []),
        ]);
        setMembers(membersRes);
        setTrainers(trainersRes);
        setSchedules(schedulesRes);
        setPayments(paymentsRes);
        setAttendance(attendanceRes);

        // Load member data and packages if member
        if (user.role === 'member' && user.memberId) {
          const memberInfo = await getMember(user.memberId);
          setMemberData(memberInfo);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.memberId, user.role]);

  const totalRevenue = payments.filter(p => p.trangthai === 'đã thanh toán').reduce((s, p) => s + p.sotien, 0);
  const activeMembers = members.filter(m => m.trangthai === 'đang tập').length;

  // Member-specific stats
  const memberPayments = payments.filter(p => p.hocvien_id === user.memberId);
  const memberUnpaidCount = memberPayments.filter(p => p.trangthai === 'chưa thanh toán').length;
  const memberPendingCount = memberPayments.filter(p => p.trangthai === 'chờ xác nhận').length;
  const memberAttendanceCount = attendance.filter(a => a.hocvien_id === user.memberId && a.trangthai === 'có mặt').length;
  const memberPackagesCount = memberData?.magoi?.length || 0;

  // Bảng màu hiện đại
  const colorPalette = {
    primary: '#c41e3a',    // đỏ đặc trưng
    secondary: '#ff6b35',  // cam
    accent: '#4fc3f7',     // xanh dương nhạt
    success: '#81c784',    // xanh lá
    warning: '#ffa726',    // vàng cam
    purple: '#a855f7',     // tím
    indigo: '#6366f1',     // indigo
    gray: '#6b7280',
  };

  const statsByRole = {
    admin: [
      { label: 'Học Viên Đang Tập', value: activeMembers, icon: Users, color: colorPalette.primary, bg: 'rgba(196,30,58,0.1)' },
      { label: 'Huấn Luyện Viên', value: trainers.length, icon: Dumbbell, color: colorPalette.secondary, bg: 'rgba(255,107,53,0.1)' },
      { label: 'Lịch Học Hoạt Động', value: schedules.filter(s => s.trangthai === 'đang mở').length, icon: Calendar, color: colorPalette.accent, bg: 'rgba(79,195,247,0.1)' },
      { label: 'Doanh Thu Tháng', value: fmt(totalRevenue), icon: TrendingUp, color: colorPalette.success, bg: 'rgba(129,199,132,0.1)' },
    ],
    manager: [
      { label: 'Học Viên Đang Tập', value: activeMembers, icon: Users, color: colorPalette.primary, bg: 'rgba(196,30,58,0.1)' },
      { label: 'Huấn Luyện Viên', value: trainers.length, icon: Dumbbell, color: colorPalette.secondary, bg: 'rgba(255,107,53,0.1)' },
      { label: 'Doanh Thu Tháng', value: fmt(totalRevenue), icon: TrendingUp, color: colorPalette.success, bg: 'rgba(129,199,132,0.1)' },
      { label: 'Lịch Đang Mở', value: schedules.length, icon: Calendar, color: colorPalette.accent, bg: 'rgba(79,195,247,0.1)' },
    ],
    trainer: [
      { label: 'Lớp Đang Dạy', value: schedules.filter(s => s.hluyen_id === user.trainerId).length, icon: Calendar, color: colorPalette.primary, bg: 'rgba(196,30,58,0.1)' },
      { label: 'Học Viên Hôm Nay', value: attendance.filter(a => a.trangthai === 'có mặt').length, icon: Users, color: colorPalette.accent, bg: 'rgba(79,195,247,0.1)' },
      { label: 'Vắng Mặt Hôm Nay', value: attendance.filter(a => a.trangthai === 'vắng mặt').length, icon: AlertCircle, color: colorPalette.warning, bg: 'rgba(255,167,38,0.1)' },
      { label: 'Tổng Buổi Điểm Danh', value: attendance.length, icon: ClipboardCheck, color: colorPalette.success, bg: 'rgba(129,199,132,0.1)' },
    ],
    member: [
      { label: 'Gói Tập Đã Chọn', value: memberPackagesCount, icon: Award, color: colorPalette.primary, bg: 'rgba(196,30,58,0.1)' },
      { label: 'Buổi Đã Tham Gia', value: memberAttendanceCount, icon: CheckCircle, color: colorPalette.success, bg: 'rgba(129,199,132,0.1)' },
      { label: 'Cần Thanh Toán', value: memberUnpaidCount, icon: CreditCard, color: memberUnpaidCount > 0 ? colorPalette.warning : colorPalette.success, bg: memberUnpaidCount > 0 ? 'rgba(255,167,38,0.1)' : 'rgba(129,199,132,0.1)' },
      { label: 'Chờ Xác Nhận', value: memberPendingCount, icon: Heart, color: colorPalette.secondary, bg: 'rgba(255,107,53,0.1)' },
    ],
  };

  const stats = statsByRole[user.role] || statsByRole.member;
  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
            Xin chào, {String(user.name || '').split(' ').slice(-1)[0] || 'User'} 👋
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            Hệ thống quản lý phòng tập võ thuật VNB · Vietnam Martial Arts Center
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-outline-modern" style={{ background: 'transparent', border: '1px solid #2a2a2a', padding: '8px 16px', borderRadius: '40px', color: '#e0e0e0', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Calendar size={14} style={{ marginRight: 6 }} /> Hôm nay
          </button>

        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32, animation: 'fadeIn 0.6s ease 0.1s both' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(196,30,58,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            animation: `slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s both`,
            position: 'relative',
            overflow: 'hidden',
          }} className="stat-card" onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 60px rgba(196,30,58,0.3)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 0% 0%, ${s.bg}, transparent 80%)`, opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{s.label}</p>
                <p className="gym-heading" style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 12 }}>{s.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>So với tuần trước</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>↑ 8%</span>
                </div>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: '18px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${s.bg}80` }}>
                <s.icon size={28} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Two columns */}
      {(user.role === 'admin' || user.role === 'manager') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
          {/* Recent Members */}
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '24px', border: '1px solid rgba(196,30,58,0.2)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(196,30,58,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colorPalette.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color={colorPalette.primary} />
                </div>
                <span className="gym-heading" style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Học viên mới</span>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div style={{ padding: '4px 0' }}>
              {members.slice(0, 5).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid rgba(196,30,58,0.08)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(196,30,58,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Avatar initials={String(m.hoten || '').split(' ').slice(-1)[0]?.[0] + (String(m.hoten || '').split(' ')[0]?.[0] || '')} size={40} color={colorPalette.primary} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#e5e5e5', marginBottom: 4 }}>{m.hoten}</p>
                    <p style={{ fontSize: 12, color: '#ffffff' }}>
                      {Array.isArray(m.magoi) && m.magoi.length > 0 
                        ? `${m.magoi.length} gói tập` 
                        : 'Chưa chọn gói'}
                    </p>
                  </div>
                  <StatusBadge status={m.trangthai} />
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(196,30,58,0.1)', textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <button style={{ background: 'none', border: 'none', color: colorPalette.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Xem tất cả học viên →</button>
            </div>
          </div>

          {/* Today's Schedules */}
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '24px', border: '1px solid rgba(196,30,58,0.2)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(196,30,58,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colorPalette.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} color={colorPalette.accent} />
                </div>
                <span className="gym-heading" style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Lịch học hôm nay</span>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div>
              {schedules.slice(0, 4).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid rgba(196,30,58,0.08)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79,195,247,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${colorPalette.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={22} color={colorPalette.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#e5e5e5', marginBottom: 4 }}>{s.tenbomon}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{s.gio} · {s.hluyen_ten}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>{s.sisohientai}/{s.sisotoida}</span>
                    <div style={{ width: 50, height: 4, background: 'rgba(196,30,58,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${(s.sisohientai / s.sisotoida) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${colorPalette.accent}, ${colorPalette.primary})`, borderRadius: 2, transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(196,30,58,0.1)', textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <button style={{ background: 'none', border: 'none', color: colorPalette.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Quản lý lịch học →</button>
            </div>
          </div>
        </div>
      )}

      {/* Member specific */}
      {user.role === 'member' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
          {/* Lịch Học Của Member */}
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '24px', border: '1px solid rgba(79,195,247,0.2)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(79,195,247,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colorPalette.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} color={colorPalette.accent} />
                </div>
                <span className="gym-heading" style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Lịch Học Của Bạn</span>
              </div>
            </div>
            <div>
              {schedules.filter(s => memberData?.magoi?.includes(s.goi_id)).slice(0, 5).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid rgba(79,195,247,0.08)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79,195,247,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${colorPalette.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={22} color={colorPalette.accent} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#e5e5e5', marginBottom: 4 }}>{s.tenbomon}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{s.gio} · {s.hluyen_ten}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>{s.sisohientai}/{s.sisotoida}</span>
                    <div style={{ width: 50, height: 4, background: 'rgba(79,195,247,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                      <div style={{ width: `${(s.sisohientai / s.sisotoida) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${colorPalette.accent}, #4fc3f7)`, borderRadius: 2, transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                </div>
              ))}
              {schedules.filter(s => memberData?.magoi?.includes(s.goi_id)).length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                  <p style={{ margin: 0, fontSize: 14 }}>Chưa có lịch học nào</p>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(79,195,247,0.1)', textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <button style={{ background: 'none', border: 'none', color: colorPalette.accent, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Xem toàn bộ lịch →</button>
            </div>
          </div>

          {/* Lịch Điểm Danh */}
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '24px', border: '1px solid rgba(76,175,80,0.2)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(76,175,80,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colorPalette.success}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardCheck size={20} color={colorPalette.success} />
                </div>
                <span className="gym-heading" style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Điểm Danh Gần Đây</span>
              </div>
            </div>
            <div>
              {attendance.filter(a => a.hocvien_id === user.memberId).slice(0, 5).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid rgba(76,175,80,0.08)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(76,175,80,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <Avatar initials={a.hocvien_ten[0]} size={40} color={a.trangthai === 'có mặt' ? colorPalette.success : colorPalette.warning} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#e5e5e5', marginBottom: 4 }}>{a.lich_ten}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{a.ngay}</p>
                  </div>
                  <StatusBadge status={a.trangthai} />
                </div>
              ))}
              {attendance.filter(a => a.hocvien_id === user.memberId).length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>
                  <p style={{ margin: 0, fontSize: 14 }}>Chưa có lịch điểm danh nào</p>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(76,175,80,0.1)', textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
              <button style={{ background: 'none', border: 'none', color: colorPalette.success, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Xem chi tiết →</button>
            </div>
          </div>
        </div>
      )}

      {/* Trainer specific */}
      {user.role === 'trainer' && (
        <div style={{ background: '#141414', borderRadius: '24px', border: '1px solid #2a2a2a', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e1e' }}>
            <span className="gym-heading" style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Điểm danh gần đây</span>
          </div>
          <div>
            {attendance.slice(0, 6).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderBottom: '1px solid #0a0a0a' }}>
                <Avatar initials={a.hocvien_ten[0]} size={40} color={a.trangthai === 'có mặt' ? colorPalette.success : colorPalette.warning} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#e0e0e0' }}>{a.hocvien_ten}</p>
                  <p style={{ fontSize: 12, color: '#fcfbfb' }}>{a.lich_ten} · {a.ngay}</p>
                </div>
                <StatusBadge status={a.trangthai} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Avatar component
function Avatar({ initials, size = 40, color = '#c41e3a' }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: `${color}20`,
      border: `2px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backdropFilter: 'blur(2px)'
    }}>
      <span style={{ fontSize: size * 0.35, fontWeight: 700, color, fontFamily: "'Inter', sans-serif" }}>{initials.toUpperCase()}</span>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, Users as UsersIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getTrainers, registerSchedule, getMember, getPackages, getPayments, getSessionsRemaining, enrollMemberInClass, isMemberEnrolledInClass, getClassEnrollments } from '../services/api';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

export default function SchedulesPage({ user }) {
  const editable = user.role === 'admin' || user.role === 'manager';
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [memberPackage, setMemberPackage] = useState(null);
  const [paidPackageIds, setPaidPackageIds] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [memberSessions, setMemberSessions] = useState({}); // Track sessions per package
  const [enrolledClasses, setEnrolledClasses] = useState(new Set()); // Track enrolled schedule IDs
  const [enrolling, setEnrolling] = useState(false); // Loading state for enrollment button
  const [classEnrollmentCounts, setClassEnrollmentCounts] = useState({}); // Track real enrollment count per class

  useEffect(() => {
    const fetch = async () => {
      const [sched, t, pkgs] = await Promise.all([getSchedules(), getTrainers(), getPackages()]);
      setSchedules(sched);
      setTrainers(t);
      setPackages(pkgs);
      
      // Load enrollment counts for all schedules
      const enrollmentCounts = {};
      for (const s of sched) {
        try {
          const enrollments = await getClassEnrollments(s.id);
          enrollmentCounts[s.id] = enrollments.length;
        } catch (error) {
          console.error(`Error loading enrollments for schedule ${s.id}:`, error);
          enrollmentCounts[s.id] = 0;
        }
      }
      setClassEnrollmentCounts(enrollmentCounts);
      
      // If user is member, load their package
      if (user.role === 'member' && user.memberId) {
        const member = await getMember(user.memberId);
        if (member) {
          // Ensure memberPackage is always an array, never null/undefined/non-array
          const packages = Array.isArray(member.magoi) ? member.magoi : [];
          setMemberPackage(packages);

          // Load payment status for this member
          try {
            const payments = await getPayments();
            const paidIds = payments
              .filter(p => parseInt(p.hocvien_id) === parseInt(user.memberId) && p.trangthai === 'đã thanh toán')
              .map(p => parseInt(p.goi_id));
            setPaidPackageIds(Array.from(new Set(paidIds)));
          } catch (error) {
            console.error('Error loading payment status for member:', error);
            setPaidPackageIds([]);
          }
          
          // Load sessions remaining for each paid package
          const sessionsData = {};
          for (const pkgId of packages) {
            try {
              const sessions = await getSessionsRemaining(user.memberId, pkgId);
              sessionsData[pkgId] = sessions;
            } catch (error) {
              console.error(`Error loading sessions for package ${pkgId}:`, error);
              sessionsData[pkgId] = { sessionsRemaining: 0, canEnroll: false };
            }
          }
          setMemberSessions(sessionsData);
          
          // Check which classes member is enrolled in
          const enrolled = new Set();
          for (const s of sched) {
            try {
              const isEnrolled = await isMemberEnrolledInClass(user.memberId, s.id);
              if (isEnrolled) enrolled.add(s.id);
            } catch (error) {
              console.error(`Error checking enrollment for schedule ${s.id}:`, error);
            }
          }
          setEnrolledClasses(enrolled);
        } else {
          setMemberPackage([]);
          setPaidPackageIds([]);
        }
      } else {
        setMemberPackage([]);
        setPaidPackageIds([]);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  // Filter schedules: members see only schedules belonging to packages they have paid for
  let mySchedules = schedules;
  const validMemberPackage = Array.isArray(memberPackage) ? memberPackage : [];
  const validPaidPackageIds = Array.isArray(paidPackageIds) ? paidPackageIds : [];
  if (user.role === 'member') {
    mySchedules = schedules.filter(s => validPaidPackageIds.includes(parseInt(s.goi_id)));
  }
  
  const filtered = mySchedules.filter(s => String(s.tenbomon || '').toLowerCase().includes(String(search || '').toLowerCase()));

  const handleRegister = async (scheduleId) => {
    try {
      await registerSchedule(scheduleId, user.trainerId);
      alert('Đăng ký lịch dạy thành công! Chờ admin duyệt.');
      const updated = await getSchedules();
      setSchedules(updated);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEnrollClass = async (scheduleId) => {
    if (!user.memberId) {
      alert('Không tìm thấy ID học viên');
      return;
    }

    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      alert('Lịch học không tìm thấy');
      return;
    }

    // Find which package this schedule belongs to
    const packageId = parseInt(schedule.goi_id);
    if (!validPaidPackageIds.includes(packageId)) {
      alert('Bạn chưa thanh toán gói này hoặc gói đang chờ xác nhận');
      return;
    }

    const sessions = memberSessions[packageId];
    if (!sessions || sessions.sessionsRemaining <= 0) {
      alert('Bạn đã hết số buổi trong gói này');
      return;
    }

    setEnrolling(true);
    try {
      const result = await enrollMemberInClass(user.memberId, packageId, scheduleId);
      alert(result.message);
      
      // Update enrolled classes
      setEnrolledClasses(prev => new Set([...prev, scheduleId]));
      
      // Refresh sessions remaining
      const updatedSessions = await getSessionsRemaining(user.memberId, packageId);
      setMemberSessions(prev => ({
        ...prev,
        [packageId]: updatedSessions
      }));
      
      // Refresh class enrollment counts
      try {
        const enrollments = await getClassEnrollments(scheduleId);
        setClassEnrollmentCounts(prev => ({
          ...prev,
          [scheduleId]: enrollments.length
        }));
      } catch (error) {
        console.error('Error updating class enrollment count:', error);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setEnrolling(false);
    }
  };

  const isTrainerRegistered = (schedule) => {
    if (user.role !== 'trainer') return false;
    return schedule.danh_sach_hlv_dang_ky?.some(h => h.hlv_id === user.trainerId);
  };

  const getTrainerRegistrationStatus = (schedule) => {
    if (user.role !== 'trainer') return null;
    const registration = schedule.danh_sach_hlv_dang_ky?.find(h => h.hlv_id === user.trainerId);
    return registration?.trang_thai || null;
  };

  const openAdd = () => {
    setForm({
      tenbomon: '',
      goi_id: packages[0]?.id || 1,
      hluyen_id: trainers[0]?.id || '',
      hluyen_ten: trainers[0]?.hoten || '',
      thu: '',
      gio: '',
      phongtap: '',
      sisotoida: 20,
      sisohientai: 0,
      trangthai: 'đang mở',
    });
    setModal('add');
  };

  const openEdit = (s) => {
    setForm({ ...s });
    setModal('edit');
  };

  const save = async () => {
    try {
      const trainer = trainers.find(t => t.id === parseInt(form.hluyen_id));
      const payload = {
        ...form,
        goi_id: parseInt(form.goi_id),
        hluyen_id: parseInt(form.hluyen_id),
        hluyen_ten: trainer?.hoten || form.hluyen_ten,
        sisotoida: parseInt(form.sisotoida),
        sisohientai: parseInt(form.sisohientai),
      };
      if (modal === 'add') {
        const newSched = await createSchedule(payload);
        setSchedules([...schedules, newSched]);
      } else {
        const updated = await updateSchedule(form.id, payload);
        setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
      }
      setModal(null);
    } catch (error) { alert('Lỗi: ' + error.message); }
  };

  const del = async (id) => {
    if (!window.confirm('Xóa lịch học này?')) return;
    await deleteSchedule(id);
    setSchedules(schedules.filter(s => s.id !== id));
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Lịch Học</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            {user.role === 'member' ? (
              <>
                Gói đã thanh toán: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>
                  {packages
                    .filter(p => validPaidPackageIds.includes(p.id))
                    .map(p => p.ten)
                    .join(', ') || 'Chưa có gói thanh toán'}
                </span> • {mySchedules.length} lịch học khả dụng
              </>
            ) : (
              `${mySchedules.length} lịch học đang mở`
            )}
          </p>
        </div>
        {editable && user.role !== 'trainer' && (
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} /> Thêm Lịch
          </button>
        )}
      </div>
      {user.role === 'member' && validMemberPackage.length > 0 && validPaidPackageIds.length === 0 && (
        <div style={{ marginBottom: 24, padding: 18, borderRadius: 16, background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.2)', color: '#f9a825' }}>
          <strong>Lưu ý:</strong> Lịch học của gói mới sẽ chỉ hiển thị sau khi thanh toán được xác nhận. Hiện tại bạn có gói đang chờ duyệt hoặc chưa thanh toán.
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(79, 195, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(79, 195, 247, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Lịch Học Hoạt Động</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{mySchedules.filter(s => s.trangthai === 'đang mở').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Tổng cộng: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>{mySchedules.length}</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(129, 199, 132, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(129, 199, 132, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Sĩ Số Trung Bình</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{mySchedules.length > 0 ? Math.round(mySchedules.reduce((sum, s) => sum + (classEnrollmentCounts[s.id] || 0), 0) / mySchedules.length) : 0}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#81c784', fontWeight: 700 }}>↑ 12%</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 107, 53, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(255, 107, 53, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Đã Kết Thúc</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{mySchedules.filter(s => s.trangthai === 'đã kết thúc').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#ff6b35', fontWeight: 700 }}>↓ 3%</span></p>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="page-card" style={{ marginBottom: 24, padding: 0 }}>
        <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Search size={18} color="#9ca3af" />
          <input
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              flex: 1,
              fontSize: 14,
              fontFamily: 'inherit'
            }}
            placeholder="Tìm kiếm lịch học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Schedules Section - List Style */}
      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(79, 195, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="#4fc3f7" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Lịch học hôm nay</h2>
          </div>
          <button style={{ color: '#9ca3af', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>···</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length > 0 ? (
            filtered.map(s => (
              <div key={s.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}>
                <Avatar initials={String(s.hluyen_ten || '').split(' ').slice(-1)[0]?.[0] || 'N'} size={36} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{s.tenbomon}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{s.hluyen_ten} • {s.thu} • {s.gio}</p>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8, fontSize: 12 }}>
                  <p style={{ color: '#9ca3af', margin: 0 }}>Sĩ số: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>{classEnrollmentCounts[s.id] || 0}/{s.sisotoida}</span></p>
                  {user.role === 'member' && memberSessions[s.goi_id] && (
                    <p style={{ color: '#9ca3af', margin: '4px 0 0 0', fontSize: 11 }}>📊 Buổi còn lại: <span style={{ color: '#81c784', fontWeight: 700 }}>{memberSessions[s.goi_id].sessionsRemaining}</span></p>
                  )}
                </div>
                <StatusBadge status={s.trangthai} />
                {user.role === 'trainer' && (
                  <button
                    onClick={() => handleRegister(s.id)}
                    disabled={isTrainerRegistered(s)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: isTrainerRegistered(s) ? 'rgba(129, 199, 132, 0.2)' : 'rgba(79, 195, 247, 0.2)',
                      border: isTrainerRegistered(s) ? '1px solid rgba(129, 199, 132, 0.4)' : '1px solid rgba(79, 195, 247, 0.4)',
                      color: isTrainerRegistered(s) ? '#81c784' : '#4fc3f7',
                      cursor: isTrainerRegistered(s) ? 'default' : 'pointer',
                      fontWeight: 600,
                      opacity: isTrainerRegistered(s) ? 0.7 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isTrainerRegistered(s)) {
                        e.currentTarget.style.background = 'rgba(79, 195, 247, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTrainerRegistered(s)) {
                        e.currentTarget.style.background = 'rgba(79, 195, 247, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.4)';
                      }
                    }}
                  >
                    <CheckCircle size={14} />
                    {isTrainerRegistered(s) ? 'Đã đăng ký' : 'Đăng ký'}
                  </button>
                )}
                {user.role === 'member' && (
                  <button
                    onClick={() => handleEnrollClass(s.id)}
                    disabled={enrolledClasses.has(s.id) || enrolling || !memberSessions[s.goi_id]?.canEnroll}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: enrolledClasses.has(s.id) 
                        ? 'rgba(129, 199, 132, 0.2)' 
                        : memberSessions[s.goi_id]?.canEnroll 
                          ? 'rgba(79, 195, 247, 0.2)' 
                          : 'rgba(255, 107, 53, 0.2)',
                      border: enrolledClasses.has(s.id) 
                        ? '1px solid rgba(129, 199, 132, 0.4)' 
                        : memberSessions[s.goi_id]?.canEnroll 
                          ? '1px solid rgba(79, 195, 247, 0.4)' 
                          : '1px solid rgba(255, 107, 53, 0.4)',
                      color: enrolledClasses.has(s.id) 
                        ? '#81c784' 
                        : memberSessions[s.goi_id]?.canEnroll 
                          ? '#4fc3f7' 
                          : '#ff6b35',
                      cursor: enrolledClasses.has(s.id) || !memberSessions[s.goi_id]?.canEnroll ? 'default' : 'pointer',
                      fontWeight: 600,
                      opacity: (enrolledClasses.has(s.id) || !memberSessions[s.goi_id]?.canEnroll) ? 0.7 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!enrolledClasses.has(s.id) && memberSessions[s.goi_id]?.canEnroll) {
                        e.currentTarget.style.background = 'rgba(79, 195, 247, 0.3)';
                        e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!enrolledClasses.has(s.id) && memberSessions[s.goi_id]?.canEnroll) {
                        e.currentTarget.style.background = 'rgba(79, 195, 247, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(79, 195, 247, 0.4)';
                      }
                    }}
                  >
                    {enrolledClasses.has(s.id) ? (
                      <>
                        <CheckCircle size={14} /> ✅ Đã đăng ký
                      </>
                    ) : memberSessions[s.goi_id]?.canEnroll ? (
                      <>
                        <CheckCircle size={14} /> Chọn Lớp
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> ❌ Hết buổi
                      </>
                    )}
                  </button>
                )}
                {editable && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(s)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 4 }}><Edit size={14} /></button>
                    {user.role === 'admin' && (
                      <button className="btn btn-danger" onClick={() => del(s.id)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={14} /></button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Không có lịch học nào</p>
            </div>
          )}
        </div>
      </div>

{modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(null)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '550px', border: '1px solid rgba(79, 195, 247, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>{modal === 'add' ? 'Thêm Lịch Học' : 'Sửa Lịch Học'}</h2>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Tên bộ môn</label><input className="input-field" value={form.tenbomon} onChange={e => setForm({ ...form, tenbomon: e.target.value })} /></div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Gói Tập Luyện</label>
              <select className="input-field" value={form.goi_id || 1} onChange={e => setForm({ ...form, goi_id: e.target.value })}>
                {packages.map(p => <option key={p.id} value={p.id} style={{ color: '#000000', background: '#0f1429' }}>{p.ten}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Huấn luyện viên</label>
              <select className="input-field" value={form.hluyen_id} onChange={e => setForm({ ...form, hluyen_id: e.target.value })}>
                {trainers.map(t => <option key={t.id} value={t.id} style={{ color: '#000000', background: '#0f1429' }}>{t.hoten}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Thứ</label><input className="input-field" value={form.thu} onChange={e => setForm({ ...form, thu: e.target.value })} placeholder="Thứ 2,4,6" /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Giờ học</label><input className="input-field" value={form.gio} onChange={e => setForm({ ...form, gio: e.target.value })} placeholder="06:00–07:30" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Phòng</label><input className="input-field" value={form.phongtap} onChange={e => setForm({ ...form, phongtap: e.target.value })} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Sĩ số tối đa</label><input className="input-field" type="number" value={form.sisotoida} onChange={e => setForm({ ...form, sisotoida: e.target.value })} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Sĩ số hiện tại</label><input className="input-field" type="number" value={form.sisohientai} onChange={e => setForm({ ...form, sisohientai: e.target.value })} /></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
              <select className="input-field" value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })}>
                {['đang mở','tạm đóng','đã kết thúc'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
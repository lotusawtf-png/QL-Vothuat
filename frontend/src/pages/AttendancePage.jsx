import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Calendar, Filter, Trash2 } from 'lucide-react';
import { getAttendance, createAttendance, getMembers, getSchedules, getTrainerAttendance, createQuickAttendance, deleteAttendance, getTrainers } from '../services/api';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

export default function AttendancePage({ user }) {
  const isTrainer = user.role === 'trainer';
  const isAdmin = user.role === 'admin' || user.role === 'manager';
  
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterTrainer, setFilterTrainer] = useState('');
  const [quickAttendanceModal, setQuickAttendanceModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        let att = await getAttendance();
        if (isTrainer) {
          att = await getTrainerAttendance(user.trainerId);
        }
        const [mem, sched, tr] = await Promise.all([getMembers(), getSchedules(), getTrainers()]);
        setAttendance(att);
        setMembers(mem);
        setSchedules(sched);
        setTrainers(tr);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user.trainerId, isTrainer]);

  const mySchedules = isTrainer ? schedules.filter(s => s.hluyen_id === user.trainerId) : [];
  const filteredAttendance = isAdmin && filterTrainer 
    ? attendance.filter(a => a.hlv_id === parseInt(filterTrainer))
    : attendance;

  const openAdd = () => {
    setForm({
      hocvien_id: members[0]?.id || '',
      lichid: schedules[0]?.id || '',
      ngay: new Date().toISOString().split('T')[0],
      trangthai: 'có mặt',
      ghichu: '',
    });
    setModal(true);
  };

  const openQuickAttendance = (schedule) => {
    setSelectedSchedule(schedule);
    setQuickAttendanceModal(true);
  };

  const handleQuickAttendance = async (member, status) => {
    try {
      await createQuickAttendance(user.trainerId, selectedSchedule.id, {
        hocvien_id: member.id,
        hocvien_ten: member.hoten,
        trangthai: status,
        ngay: new Date().toISOString().split('T')[0]
      });
      const updated = await getTrainerAttendance(user.trainerId);
      setAttendance(updated);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const save = async () => {
    try {
      const member = members.find(m => m.id === parseInt(form.hocvien_id));
      const schedule = schedules.find(s => s.id === parseInt(form.lichid));
      
      const dataToSave = {
        hlv_id: user.trainerId || '',
        hlv_ten: user.name || '',
        hocvien_id: parseInt(form.hocvien_id),
        hocvien_ten: member?.hoten || '',
        lichid: parseInt(form.lichid),
        lich_ten: schedule?.tenbomon || '',
        ngay: form.ngay,
        trangthai: form.trangthai,
        ghichu: form.ghichu,
      };
      
      const created = await createAttendance(dataToSave);
      setAttendance([...attendance, created]);
      setModal(false);
    } catch (error) { 
      alert('Lỗi: ' + error.message); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bản ghi này?')) return;
    try {
      await deleteAttendance(id);
      setAttendance(attendance.filter(a => a.id !== id));
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  // ===== TRAINER VIEW =====
  if (isTrainer) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
            Điểm Danh Lớp Học
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            Điểm danh học viên trong các lớp của bạn
          </p>
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
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Có Mặt</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.filter(a => a.trangthai === 'có mặt').length}</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Hôm nay: <span style={{ color: '#4caf50', fontWeight: 700 }}>+{attendance.filter(a => a.trangthai === 'có mặt' && a.ngay === new Date().toISOString().split('T')[0]).length}</span></p>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid rgba(239, 83, 80, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(239, 83, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Vắng Mặt</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.filter(a => a.trangthai === 'vắng mặt').length}</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Cần theo dõi: <span style={{ color: '#ef5350', fontWeight: 700 }}>!</span></p>
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
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Buổi</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.length}</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Tháng này: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>+{attendance.length}</span></p>
            </div>
          </div>
        </div>

        {/* Lịch của HLV */}
        <div className="page-card">
          <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(79, 195, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} color="#4fc3f7" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Lịch dạy của bạn</h2>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
            {mySchedules.length > 0 ? (
              mySchedules.map(schedule => (
                <div key={schedule.id} style={{
                  background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.1) 0%, rgba(79, 195, 247, 0.05) 100%)',
                  border: '1px solid rgba(79, 195, 247, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>
                    {schedule.tenbomon}
                  </h3>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px 0' }}>
                    {schedule.thu} • {schedule.gio} • {schedule.phongtap}
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '8px 0' }}>
                    Sĩ số: <span style={{ color: '#4fc3f7', fontWeight: 600 }}>{schedule.sisohientai}/{schedule.sisotoida}</span>
                  </p>
                  <button
                    onClick={() => openQuickAttendance(schedule)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      marginTop: 12,
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.4)',
                      color: '#4caf50',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 12,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.4)';
                    }}
                  >
                    📝 Điểm Danh
                  </button>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                Không có lịch dạy nào
              </div>
            )}
          </div>
        </div>

        {/* Lịch điểm danh */}
        <div className="page-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} color="#4caf50" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Lịch điểm danh</h2>
            </div>
            <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={15} /> Thêm
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {attendance.length > 0 ? (
              attendance.map(a => (
                <div key={a.id} style={{
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
                  e.currentTarget.style.borderColor = a.trangthai === 'có mặt' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 83, 80, 0.2)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}>
                  <Avatar initials={a.hocvien_ten[0]} size={36} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{a.hocvien_ten}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{a.lich_ten}</p>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 8 }}>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Ngày: <span style={{ color: '#ffffff', fontWeight: 600 }}>{a.ngay}</span></p>
                    {a.ghichu && <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>Ghi chú: {a.ghichu}</p>}
                  </div>
                  <StatusBadge status={a.trangthai} />
                  <button 
                    onClick={() => handleDelete(a.id)}
                    style={{
                      background: 'rgba(239, 83, 80, 0.2)',
                      border: '1px solid rgba(239, 83, 80, 0.4)',
                      color: '#ef5350',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                Chưa có bản ghi điểm danh nào
              </div>
            )}
          </div>
        </div>

        {/* Quick Attendance Modal */}
        {quickAttendanceModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setQuickAttendanceModal(false)}>
            <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '600px', border: '1px solid rgba(76, 175, 80, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>
                Điểm Danh - {selectedSchedule?.tenbomon}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, maxHeight: '400px', overflowY: 'auto' }}>
                {members.map(member => (
                  <div key={member.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <Avatar initials={String(member.hoten || '')[0] || 'M'} size={32} />
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: '8px 0 12px 0' }}>
                      {String(member.hoten || '').split(' ').slice(-1)[0] || 'Member'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button
                        onClick={() => {
                          handleQuickAttendance(member, 'có mặt');
                          setQuickAttendanceModal(false);
                        }}
                        style={{
                          padding: '6px 8px',
                          background: 'rgba(76, 175, 80, 0.2)',
                          border: '1px solid rgba(76, 175, 80, 0.4)',
                          color: '#4caf50',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          handleQuickAttendance(member, 'vắng mặt');
                          setQuickAttendanceModal(false);
                        }}
                        style={{
                          padding: '6px 8px',
                          background: 'rgba(239, 83, 80, 0.2)',
                          border: '1px solid rgba(239, 83, 80, 0.4)',
                          color: '#ef5350',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button 
                  onClick={() => setQuickAttendanceModal(false)}
                  className="btn btn-ghost"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {modal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(false)}>
            <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(76, 175, 80, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>Thêm Điểm Danh</h2>
              <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Học viên</label>
                <select className="input-field" value={form.hocvien_id} onChange={e => setForm({ ...form, hocvien_id: e.target.value })}>
                  {members.map(m => <option key={m.id} value={m.id} style={{ color: '#000000', background: '#0f1429' }}>{m.hoten}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Lịch học</label>
                <select className="input-field" value={form.lichid} onChange={e => setForm({ ...form, lichid: e.target.value })}>
                  {mySchedules.map(s => <option key={s.id} value={s.id} style={{ color: '#000000', background: '#0f1429' }}>{s.tenbomon}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ngày</label><input className="input-field" type="date" value={form.ngay} onChange={e => setForm({ ...form, ngay: e.target.value })} /></div>
                <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
                  <select className="input-field" value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })}>
                    {['có mặt','đến muộn','vắng mặt'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ghi chú</label><input className="input-field" value={form.ghichu} onChange={e => setForm({ ...form, ghichu: e.target.value })} placeholder="Không bắt buộc" /></div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button className="btn btn-ghost" onClick={() => setModal(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={save}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== ADMIN/MANAGER VIEW =====
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Điểm Danh</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>{filteredAttendance.length} bản ghi</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={15} /> Thêm Điểm Danh
        </button>
      </div>

      {/* Stats Cards */}
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Có Mặt</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{filteredAttendance.filter(a => a.trangthai === 'có mặt').length}</p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(239, 83, 80, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(239, 83, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Vắng Mặt</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{filteredAttendance.filter(a => a.trangthai === 'vắng mặt').length}</p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Buổi</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{filteredAttendance.length}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="page-card" style={{ marginBottom: 24, padding: 0 }}>
        <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Filter size={18} color="#9ca3af" />
          <select 
            value={filterTrainer} 
            onChange={(e) => setFilterTrainer(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              outline: 'none',
              color: '#ffffff',
              flex: 1,
              fontSize: 14,
              padding: '8px 12px',
              borderRadius: '8px',
              fontFamily: 'inherit'
            }}
          >
            <option value="">Tất cả HLV</option>
            {trainers.map(t => (
              <option key={t.id} value={t.id} style={{ color: '#000000', background: '#0f1429' }}>
                {t.hoten}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance List */}
      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#4caf50" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Danh sách điểm danh</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map(a => (
              <div key={a.id} style={{
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
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}>
                <Avatar initials={a.hocvien_ten[0]} size={36} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{a.hocvien_ten}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>HLV: {a.hlv_ten} • {a.lich_ten}</p>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Ngày: <span style={{ color: '#ffffff', fontWeight: 600 }}>{a.ngay}</span></p>
                </div>
                <StatusBadge status={a.trangthai} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Không có bản ghi điểm danh nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(76, 175, 80, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>Thêm Điểm Danh</h2>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Học viên</label>
              <select className="input-field" value={form.hocvien_id} onChange={e => setForm({ ...form, hocvien_id: e.target.value })} style={{ color: '#ffffff' }}>
                {members.map(m => <option key={m.id} value={m.id} style={{ color: '#ffffff', background: '#0f1429' }}>{m.hoten}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Lịch học</label>
              <select className="input-field" value={form.lichid} onChange={e => setForm({ ...form, lichid: e.target.value })} style={{ color: '#ffffff' }}>
                {schedules.map(s => <option key={s.id} value={s.id} style={{ color: '#ffffff', background: '#0f1429' }}>{s.tenbomon}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ngày</label><input className="input-field" type="date" value={form.ngay} onChange={e => setForm({ ...form, ngay: e.target.value })} style={{ color: '#ffffff' }} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
                <select className="input-field" value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })}>
                  {['có mặt','đến muộn','vắng mặt'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ghi chú</label><input className="input-field" value={form.ghichu} onChange={e => setForm({ ...form, ghichu: e.target.value })} placeholder="Không bắt buộc" style={{ color: '#ffffff' }} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Điểm Danh</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>{attendance.length} bản ghi điểm danh</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} /> Thêm Điểm Danh
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(76, 175, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Có Mặt</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.filter(a => a.trangthai === 'có mặt').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Tổng buổi: <span style={{ color: '#4caf50', fontWeight: 700 }}>↑ {attendance.filter(a => a.trangthai === 'có mặt').length}</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(239, 83, 80, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(239, 83, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Vắng Mặt</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.filter(a => a.trangthai === 'vắng mặt').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Cần theo dõi: <span style={{ color: '#ef5350', fontWeight: 700 }}>!</span></p>
          </div>
        </div>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Buổi</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{attendance.length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Tháng này: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>+5</span></p>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(76, 175, 80, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#4caf50" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Danh sách điểm danh</h2>
          </div>
          <button style={{ color: '#9ca3af', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>···</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {attendance.length > 0 ? (
            attendance.map(a => (
              <div key={a.id} style={{
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
                e.currentTarget.style.borderColor = a.trangthai === 'có mặt' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(239, 83, 80, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}>
                <Avatar initials={a.hocvien_ten[0]} size={36} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{a.hocvien_ten}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{a.lich_ten}</p>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Ngày: <span style={{ color: '#ffffff', fontWeight: 600 }}>{a.ngay}</span></p>
                  {a.ghichu && <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>Ghi chú: {a.ghichu}</p>}
                </div>
                <StatusBadge status={a.trangthai} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Không có bản ghi điểm danh nào</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(76, 175, 80, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>Thêm Điểm Danh</h2>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Học viên</label>
              <select className="input-field" value={form.hocvien_id} onChange={e => setForm({ ...form, hocvien_id: e.target.value })} style={{ color: '#ffffff' }}>
                {members.map(m => <option key={m.id} value={m.id} style={{ color: '#ffffff', background: '#0f1429' }}>{m.hoten}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Lịch học</label>
              <select className="input-field" value={form.lichid} onChange={e => setForm({ ...form, lichid: e.target.value })} style={{ color: '#ffffff' }}>
                {schedules.map(s => <option key={s.id} value={s.id} style={{ color: '#ffffff', background: '#0f1429' }}>{s.tenbomon}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ngày</label><input className="input-field" type="date" value={form.ngay} onChange={e => setForm({ ...form, ngay: e.target.value })} style={{ color: '#ffffff' }} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
                <select className="input-field" value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })} style={{ color: '#ffffff' }}>
                  {['có mặt','vắng mặt','đến muộn'].map(t => <option key={t} style={{ color: '#ffffff', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ghi chú</label><input className="input-field" value={form.ghichu} onChange={e => setForm({ ...form, ghichu: e.target.value })} placeholder="Không bắt buộc" style={{ color: '#ffffff' }} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

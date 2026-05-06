import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Users, TrendingUp, Award } from 'lucide-react';
import { getMembers, createMember, updateMember, deleteMember } from '../services/api';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

const PACKAGES = [
  { id: 1, ten: 'Gói Chiến Binh', gia: 800000 },
  { id: 2, ten: 'Gói Chiến Thần', gia: 2100000 },
  { id: 3, ten: 'Gói Vô Địch', gia: 3600000 },
];

export default function MembersPage({ user }) {
  const editable = user.role === 'admin' || user.role === 'manager';
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const filtered = members.filter(m =>
    String(m.hoten || '').toLowerCase().includes(String(search || '').toLowerCase()) ||
    String(m.email || '').toLowerCase().includes(String(search || '').toLowerCase())
  );

  const openAdd = () => {
    setForm({
      hoten: '', email: '', sdt: '', magoi: 1, tiendo: 'Beginner',
      trangthai: 'đang tập', ngaydangky: new Date().toISOString().split('T')[0],
    });
    setModal('add');
  };

  const openEdit = (m) => setForm({ ...m }) & setModal('edit');
  const save = async () => {
    try {
      if (modal === 'add') {
        const newMember = await createMember(form);
        setMembers([...members, newMember]);
      } else {
        const updated = await updateMember(form.id, form);
        setMembers(members.map(m => m.id === updated.id ? updated : m));
      }
      setModal(null);
    } catch (error) { alert('Lỗi: ' + error.message); }
  };
  const del = async (id) => {
    if (!window.confirm('Xóa học viên này?')) return;
    await deleteMember(id);
    setMembers(members.filter(m => m.id !== id));
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Quản lý học viên</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>{members.length} học viên đang tập</p>
        </div>
        {editable && (
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} /> Thêm học viên
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(196,30,58,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(196, 30, 58, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Học Viên Đang Tập</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{members.filter(m => m.trangthai === 'đang tập').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#c41e3a', fontWeight: 700 }}>↑ 8%</span></p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Học Viên</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{members.length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#ff6b35', fontWeight: 700 }}>↑ 8%</span></p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Học Viên Mới</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{Math.max(0, Math.floor(members.length * 0.2))}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>↑ 9%</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tạm Nghỉ</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{members.filter(m => m.trangthai === 'tạm nghỉ').length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tuần trước: <span style={{ color: '#10b981', fontWeight: 700 }}>↓ 2%</span></p>
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
            placeholder="Tìm kiếm học viên theo tên, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Members Section - List Style */}
      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(196, 30, 58, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="#c41e3a" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Danh sách học viên</h2>
          </div>
          <button style={{ color: '#9ca3af', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>···</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length > 0 ? (
            filtered.map(m => (
              <div key={m.id} style={{
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
                e.currentTarget.style.borderColor = 'rgba(196,30,58,0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}>
                <Avatar initials={m.hoten.charAt(0)} size={36} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{m.hoten}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{PACKAGES.find(p => p.id === m.magoi)?.ten}</p>
                </div>
<StatusBadge status={m.trangthai} />
                {editable && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(m)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 4 }}><Edit size={14} /></button>
                    {user.role === 'admin' && (
                      <button className="btn btn-danger" onClick={() => del(m.id)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={14} /></button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Không có học viên nào</p>
            </div>
          )}
        </div>
      </div>

{modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(null)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(196, 30, 58, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 24, margin: 0, marginBottom: 24 }}>{modal === 'add' ? 'Thêm học viên' : 'Sửa học viên'}</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Họ tên</label>
              <input className="input-field" value={form.hoten} onChange={e => setForm({...form, hoten: e.target.value})} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Email</label><input className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Số điện thoại</label><input className="input-field" value={form.sdt} onChange={e => setForm({...form, sdt: e.target.value})} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Gói tập</label>
                <select className="input-field" value={form.magoi} onChange={e => setForm({...form, magoi: parseInt(e.target.value)})}>
                  {PACKAGES.map(p => <option key={p.id} value={p.id} style={{ color: '#000000', background: '#0f1429' }}>{p.ten}</option>)}
                </select>
              </div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Tiến độ</label>
                <select className="input-field" value={form.tiendo} onChange={e => setForm({...form, tiendo: e.target.value})}>
                  {['Beginner','Intermediate','Advanced'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
                <select className="input-field" value={form.trangthai} onChange={e => setForm({...form, trangthai: e.target.value})}>
                  {['đang tập','tạm nghỉ','đã nghỉ'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ngày đăng ký</label>
                <input className="input-field" type="date" value={form.ngaydangky} onChange={e => setForm({...form, ngaydangky: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary" onClick={save}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
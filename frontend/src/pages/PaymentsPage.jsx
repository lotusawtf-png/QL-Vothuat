import { useState, useEffect } from 'react';
import { Plus, CheckCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPayments, createPayment, confirmPayment, getMembers } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
const PACKAGES = [
  { id: 1, ten: 'Gói Chiến Binh', gia: 800000 },
  { id: 2, ten: 'Gói Chiến Thần', gia: 2100000 },
  { id: 3, ten: 'Gói Vô Địch', gia: 3600000 },
];

export default function PaymentsPage({ user }) {
  const navigate = useNavigate();
  
  // Redirect member to their payment page
  useEffect(() => {
    if (user.role === 'member') {
      navigate('/member-payments');
    }
  }, [user.role, navigate]);

  const editable = user.role === 'admin' || user.role === 'manager';
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [p, m] = await Promise.all([getPayments(), getMembers()]);
      setPayments(p);
      setMembers(m);
      setLoading(false);
    };
    
    fetch();
    
    // Auto-refresh payments every 15 seconds
    const refreshInterval = setInterval(fetch, 15000);
    
    // Listen for member updates
    const handleMembersUpdated = fetch;
    window.addEventListener('membersUpdated', handleMembersUpdated);
    
    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('membersUpdated', handleMembersUpdated);
    };
  }, []);

  const myPayments = user.role === 'member' ? payments.filter(p => p.hocvien_id === user.memberId) : payments;
  const totalPaid = myPayments.filter(p => p.trangthai === 'đã thanh toán').reduce((s, p) => s + p.sotien, 0);
  const pending = myPayments.filter(p => p.trangthai === 'chờ xác nhận').length;

  const openAdd = () => {
    setForm({
      hocvien_id: members[0]?.id || '',
      goi_id: 1,
      phuongthuc: 'Tiền mặt',
      trangthai: 'đã thanh toán',
      ngay: new Date().toISOString().split('T')[0],
    });
    setModal(true);
  };

  const save = async () => {
    try {
      const member = members.find(m => m.id === parseInt(form.hocvien_id));
      const goi = PACKAGES.find(g => g.id === parseInt(form.goi_id));
      const newPayment = {
        hocvien_id: parseInt(form.hocvien_id),
        hocvien_ten: member?.hoten || '',
        goi_id: parseInt(form.goi_id),
        goi_ten: goi?.ten || '',
        sotien: goi?.gia || 0,
        phuongthuc: form.phuongthuc,
        trangthai: form.trangthai,
        ngay: form.ngay,
      };
      const created = await createPayment(newPayment);
      setPayments([...payments, created]);
      setModal(false);
    } catch (error) { alert('Lỗi: ' + error.message); }
  };

  const handleConfirm = async (id) => {
    await confirmPayment(id);
    setPayments(payments.map(p => p.id === id ? { ...p, trangthai: 'đã thanh toán' } : p));
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>Thanh Toán</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>{myPayments.length} giao dịch</p>
        </div>
        {editable && user.role !== 'member' && (
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} /> Thêm Giao Dịch
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Doanh Thu</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{fmt(totalPaid)}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>So với tháng trước: <span style={{ color: '#10b981', fontWeight: 700 }}>↑ 12%</span></p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }} className="stat-card">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Chờ Xác Nhận</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{pending}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Cần xử lý: <span style={{ color: '#f59e0b', fontWeight: 700 }}>!</span></p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Giao Dịch</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{myPayments.length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Hôm nay: <span style={{ color: '#4fc3f7', fontWeight: 700 }}>+3</span></p>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Danh sách giao dịch</h2>
          </div>
          <button style={{ color: '#9ca3af', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>···</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myPayments.length > 0 ? (
            myPayments.map(p => (
              <div key={p.id} style={{
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
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#ffffff', margin: 0 }}>{p.hocvien_ten}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{p.goi_ten} • {p.phuongthuc}</p>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Số tiền: <span style={{ color: '#10b981', fontWeight: 700 }}>{fmt(p.sotien)}</span></p>
                  <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>{p.ngay}</p>
                </div>
                <StatusBadge status={p.trangthai} />
                {editable && user.role !== 'member' && p.trangthai === 'chờ xác nhận' && (
                  <button className="btn btn-success" onClick={() => handleConfirm(p.id)} style={{ padding: '6px 12px', fontSize: 12, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /></button>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
              <p style={{ margin: 0 }}>Không có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setModal(false)}>
          <div style={{ background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 24 }}>Thêm Giao Dịch</h2>
            <div style={{ marginBottom: 16 }}><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Học viên</label>
              <select className="input-field" value={form.hocvien_id} onChange={e => setForm({ ...form, hocvien_id: e.target.value })}>
                {members.map(m => <option key={m.id} value={m.id} style={{ color: '#000000', background: '#0f1429' }}>{m.hoten}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Gói tập</label>
                <select className="input-field" value={form.goi_id} onChange={e => setForm({ ...form, goi_id: e.target.value })}>
                  {PACKAGES.map(g => <option key={g.id} value={g.id} style={{ color: '#000000', background: '#0f1429' }}>{g.ten} – {fmt(g.gia)}</option>)}
                </select>
              </div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Phương thức</label>
                <select className="input-field" value={form.phuongthuc} onChange={e => setForm({ ...form, phuongthuc: e.target.value })}>
                  {['Tiền mặt','Chuyển khoản','QR Code'].map(t => <option key={t} style={{ color: '#000000', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Ngày</label><input className="input-field" type="date" value={form.ngay} onChange={e => setForm({ ...form, ngay: e.target.value })} style={{ color: '#ffffff' }} /></div>
              <div><label style={{ color: '#ffffff', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>Trạng thái</label>
                <select className="input-field" value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })} style={{ color: '#ffffff' }}>
                  {['đã thanh toán','chờ xác nhận'].map(t => <option key={t} style={{ color: '#ffffff', background: '#0f1429' }}>{t}</option>)}
                </select>
              </div>
            </div>
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
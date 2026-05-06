import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { getPendingSchedules, approveScheduleRequest, rejectScheduleRequest } from '../services/api';
import Modal from '../components/Modal';

export default function ApprovalPage({ user }) {
  const [pendingSchedules, setPendingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadPendingSchedules();
  }, []);

  const loadPendingSchedules = async () => {
    try {
      const data = await getPendingSchedules();
      setPendingSchedules(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (scheduleId, trainerId) => {
    try {
      await approveScheduleRequest(scheduleId, trainerId);
      setModal(null);
      loadPendingSchedules();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleReject = async (scheduleId, trainerId) => {
    try {
      await rejectScheduleRequest(scheduleId, trainerId, rejectReason);
      setModal(null);
      setRejectReason('');
      loadPendingSchedules();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const openRejectModal = (schedule, trainer) => {
    setSelectedSchedule(schedule);
    setSelectedTrainer(trainer);
    setRejectReason('');
    setModal('reject');
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;

  const totalPending = pendingSchedules.reduce((sum, s) => 
    sum + (s.danh_sach_hlv_dang_ky?.filter(h => h.trang_thai === 'chờ duyệt').length || 0), 0
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', letterSpacing: '-0.5px' }}>
          Duyệt Lịch Dạy
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 6, fontWeight: 400 }}>
          Quản lý đơn đăng ký lịch dạy từ các huấn luyện viên
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 167, 38, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(255, 167, 38, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Chờ Duyệt</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#ffa726', marginBottom: 8 }}>{totalPending}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Đơn đăng ký cần xử lý</p>
          </div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(129, 199, 132, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(129, 199, 132, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>Tổng Lịch</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#81c784', marginBottom: 8 }}>{pendingSchedules.length}</p>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Lịch có đơn đăng ký</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {totalPending === 0 ? (
        <div style={{
          background: 'rgba(129, 199, 132, 0.1)',
          border: '1px solid rgba(129, 199, 132, 0.3)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <CheckCircle size={48} color="#81c784" style={{ marginBottom: 16, marginLeft: 'auto', marginRight: 'auto' }} />
          <h3 style={{ color: '#81c784', fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>Không có đơn chờ duyệt</h3>
          <p style={{ color: '#9ca3af', margin: 0 }}>Tất cả các đơn đăng ký lịch dạy đã được xử lý</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {pendingSchedules.map(schedule => {
            const pendingTrainers = schedule.danh_sach_hlv_dang_ky?.filter(h => h.trang_thai === 'chờ duyệt') || [];
            if (pendingTrainers.length === 0) return null;

            return (
              <div key={schedule.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255, 167, 38, 0.2)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Schedule Header */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 167, 38, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%)',
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255, 167, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <Clock size={20} color="#ffa726" />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: '0 0 4px 0' }}>
                      {schedule.tenbomon}
                    </h3>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                      {schedule.hluyen_ten} • {schedule.thu} • {schedule.gio} • {schedule.phongtap}
                    </p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 107, 53, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#ff6b35'
                  }}>
                    {pendingTrainers.length} đơn
                  </div>
                </div>

                {/* Trainer Requests */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pendingTrainers.map((trainer, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>
                          {trainer.hlv_ten}
                        </p>
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                          Đăng ký ngày: {trainer.ngay_dang_ky}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(schedule.id, trainer.hlv_id)}
                          style={{
                            background: 'rgba(129, 199, 132, 0.2)',
                            border: '1px solid rgba(129, 199, 132, 0.4)',
                            color: '#81c784',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(129, 199, 132, 0.3)';
                            e.currentTarget.style.borderColor = 'rgba(129, 199, 132, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(129, 199, 132, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(129, 199, 132, 0.4)';
                          }}
                        >
                          <CheckCircle size={16} />
                          Duyệt
                        </button>
                        <button
                          onClick={() => openRejectModal(schedule, trainer)}
                          style={{
                            background: 'rgba(244, 67, 54, 0.2)',
                            border: '1px solid rgba(244, 67, 54, 0.4)',
                            color: '#ef5350',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(244, 67, 54, 0.3)';
                            e.currentTarget.style.borderColor = 'rgba(244, 67, 54, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(244, 67, 54, 0.4)';
                          }}
                        >
                          <XCircle size={16} />
                          Từ chối
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {modal === 'reject' && (
        <Modal title="Từ Chối Đơn Đăng Ký" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
              Lý do từ chối (tùy chọn)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              style={{
                width: '100%',
                padding: '12px',
                marginTop: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: 14,
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setModal(null)}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Hủy
            </button>
            <button
              onClick={() => handleReject(selectedSchedule.id, selectedTrainer.hlv_id)}
              style={{
                padding: '10px 20px',
                background: 'rgba(244, 67, 54, 0.3)',
                border: '1px solid rgba(244, 67, 54, 0.4)',
                color: '#ef5350',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Từ Chối
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

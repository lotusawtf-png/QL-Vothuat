import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, Eye } from 'lucide-react';
import { getPendingPayments, getPayments, approvePayment, rejectPayment, getMember } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function PaymentApprovalPage({ user }) {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    loadPayments();
    
    // 🔄 AUTO-REFRESH: Poll for new payments every 3 seconds
    const pollInterval = setInterval(() => {
      loadPayments();
    }, 3000);
    
    // Listen for localStorage changes (when payments are updated in real-time)
    const handleStorageChange = (e) => {
      if (e.key === 'mockPayments') {
        console.log('💾 Payments updated in localStorage, refreshing...');
        loadPayments();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      console.log('📋 PaymentApprovalPage: loadPayments() called');
      const [pending, all] = await Promise.all([
        getPendingPayments(),
        getPayments(),
      ]);
      console.log('📋 Pending payments loaded:', pending);
      console.log('📋 All payments loaded:', all);
      setPendingPayments(pending);
      setAllPayments(all);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    setApproving(prev => ({ ...prev, [paymentId]: true }));
    try {
      await approvePayment(paymentId, approvalNotes);
      await loadPayments();
      setShowDetailModal(false);
      setApprovalNotes('');
      alert('✅ Yêu cầu thanh toán đã được duyệt');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    } finally {
      setApproving(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const handleReject = async (paymentId) => {
    setApproving(prev => ({ ...prev, [paymentId]: true }));
    try {
      await rejectPayment(paymentId, rejectionReason);
      await loadPayments();
      setShowDetailModal(false);
      setRejectionReason('');
      alert('✅ Yêu cầu thanh toán đã bị từ chối');
    } catch (err) {
      alert('❌ Lỗi: ' + err.message);
    } finally {
      setApproving(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
    setAction(null);
    setApprovalNotes('');
    setRejectionReason('');
  };

  const stats = {
    pending: pendingPayments.length,
    approved: allPayments.filter(p => p.trangthai === 'đã thanh toán').length,
    rejected: allPayments.filter(p => p.trangthai === 'chưa thanh toán' && p.ngay_duyet).length,
    totalAmount: pendingPayments.reduce((sum, p) => sum + (p.sotien || 0), 0),
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} color="#6366f1" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <p style={{ color: '#888', fontSize: 14 }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#6366f1" />
            </div>
            <div>
              <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', margin: 0 }}>Duyệt Thanh Toán</h1>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: '4px 0 0 0' }}>Quản lý các yêu cầu thanh toán từ học viên</p>
            </div>
          </div>
          
          {/* Live Updates Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px'
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4caf50',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4caf50' }}>🔄 Live Updates</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Pending */}
          <div style={{
            background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 152, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(255, 152, 0, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Chờ Xác Nhận</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stats.pending}</p>
              <p style={{ fontSize: 12, color: '#ff9800' }}>yêu cầu đang chờ</p>
            </div>
          </div>

          {/* Total Amount */}
          <div style={{
            background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Tổng Tiền</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', marginBottom: 4 }}>{fmt(stats.totalAmount)}</p>
              <p style={{ fontSize: 12, color: '#4fc3f7' }}>chờ duyệt</p>
            </div>
          </div>

          {/* Approved */}
          <div style={{
            background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(76, 175, 80, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Đã Duyệt</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#4caf50', marginBottom: 4 }}>{stats.approved}</p>
              <p style={{ fontSize: 12, color: '#4caf50' }}>đã phê duyệt</p>
            </div>
          </div>
        </div>

        {/* No Pending Payments */}
        {pendingPayments.length === 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '40px 20px',
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            marginBottom: 32,
          }}>
            <CheckCircle size={48} color="#4caf50" style={{ marginBottom: 16, opacity: 0.5 }} />
            <p style={{ color: '#9ca3af', fontSize: 16, margin: 0, fontWeight: 600 }}>Không có yêu cầu thanh toán chờ duyệt</p>
            <p style={{ color: '#666', fontSize: 14, margin: '8px 0 0 0' }}>Tất cả yêu cầu thanh toán đã được xử lý</p>
          </div>
        )}

        {/* Pending Payments List */}
        {pendingPayments.length > 0 && (
          <div className="page-card">
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Yêu Cầu Thanh Toán Chờ Duyệt</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 152, 0, 0.05)',
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 152, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 152, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Payment Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'rgba(255, 152, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Clock size={20} color="#ff9800" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', margin: 0, marginBottom: 4 }}>
                          {payment.hocvien_ten}
                        </p>
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                          {payment.goi_ten} • {fmt(payment.sotien)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ textAlign: 'right', marginRight: 16, minWidth: 80 }}>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4 }}>Ngày Yêu Cầu</p>
                    <p style={{ fontWeight: 600, color: '#fff', margin: 0, fontSize: 13 }}>
                      {new Date(payment.ngay).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => openDetail(payment)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#6366f1',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                      }}
                    >
                      <Eye size={14} /> Chi Tiết
                    </button>
                    <button
                      onClick={() => { setSelectedPayment(payment); setAction('approve'); setShowDetailModal(true); }}
                      disabled={approving[payment.id]}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(76, 175, 80, 0.2)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        color: '#4caf50',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: approving[payment.id] ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        opacity: approving[payment.id] ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!approving[payment.id]) {
                          e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                      }}
                    >
                      {approving[payment.id] ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
                      Duyệt
                    </button>
                    <button
                      onClick={() => { setSelectedPayment(payment); setAction('reject'); setShowDetailModal(true); }}
                      disabled={approving[payment.id]}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(244, 67, 54, 0.2)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        color: '#f44336',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: approving[payment.id] ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        opacity: approving[payment.id] ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!approving[payment.id]) {
                          e.currentTarget.style.background = 'rgba(244, 67, 54, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)';
                      }}
                    >
                      {approving[payment.id] ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={14} />}
                      Từ Chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedPayment && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
            onClick={() => setShowDetailModal(false)}
          >
            <div
              style={{
                background: '#0f1429',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Chi Tiết Yêu Cầu</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#9ca3af',
                    fontSize: 24,
                    cursor: 'pointer',
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Member & Package Info */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: 24,
              }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Học Viên</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{selectedPayment.hocvien_ten}</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Gói Tập</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#6366f1', margin: 0 }}>{selectedPayment.goi_ten}</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Số Tiền</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#4fc3f7', margin: 0 }}>{fmt(selectedPayment.sotien)}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: 24,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4 }}>Phương Thức</p>
                    <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{selectedPayment.phuongthuc}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4 }}>Ngày Yêu Cầu</p>
                    <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{new Date(selectedPayment.ngay).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4 }}>Trạng Thái</p>
                    <p style={{ fontWeight: 600, color: '#ff9800', margin: 0 }}>Chờ xác nhận</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 4 }}>Ghi Chú</p>
                    <p style={{ fontWeight: 600, color: '#fff', margin: 0, fontSize: 13 }}>{selectedPayment.ghichu || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Approval Section */}
              {action === 'approve' && (
                <div style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: 24,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#4caf50', margin: 0, marginBottom: 12 }}>✅ Duyệt Yêu Cầu Này</p>
                  <textarea
                    placeholder="Ghi chú phê duyệt (tùy chọn)"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      resize: 'vertical',
                      minHeight: 80,
                    }}
                  />
                </div>
              )}

              {/* Rejection Section */}
              {action === 'reject' && (
                <div style={{
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: 24,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f44336', margin: 0, marginBottom: 12 }}>❌ Từ Chối Yêu Cầu Này</p>
                  <textarea
                    placeholder="Lý do từ chối (bắt buộc)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      resize: 'vertical',
                      minHeight: 80,
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#9ca3af',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  Đóng
                </button>
                {action === 'approve' && (
                  <button
                    onClick={() => handleApprove(selectedPayment.id)}
                    disabled={approving[selectedPayment.id]}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #4caf50, #45a049)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: approving[selectedPayment.id] ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: approving[selectedPayment.id] ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!approving[selectedPayment.id]) {
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(76, 175, 80, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {approving[selectedPayment.id] ? 'Đang Xử Lý...' : '✅ Duyệt'}
                  </button>
                )}
                {action === 'reject' && (
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    disabled={!rejectionReason.trim() || approving[selectedPayment.id]}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #f44336, #da190b)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: (!rejectionReason.trim() || approving[selectedPayment.id]) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: (!rejectionReason.trim() || approving[selectedPayment.id]) ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (rejectionReason.trim() && !approving[selectedPayment.id]) {
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(244, 67, 54, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {approving[selectedPayment.id] ? 'Đang Xử Lý...' : '❌ Từ Chối'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Clock, Zap, Copy, Check } from 'lucide-react';
import { getMember, getPayments, createPayment, getPackages } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

// Bank account info for payments
const BANK_INFO = {
  ten: 'Phòng Tập GYM VOTHUATT',
  stk: '1234567890123',
  bank: 'Vietcombank',
  chi_nhanh: 'Chi nhánh Hà Nội',
  qr_code: 'https://via.placeholder.com/200?text=QR+Code', // Placeholder for QR code
};

export default function MemberPaymentPage({ user }) {
  const [member, setMember] = useState(null);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.memberId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [memberData, packagesData, paymentsData] = await Promise.all([
        getMember(user.memberId),
        getPackages(),
        getPayments(),
      ]);
      
      setMember(memberData);
      setPackages(packagesData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get payment status for a package
  const getPaymentStatus = (packageId) => {
    const payment = payments.find(p => p.hocvien_id === user.memberId && p.goi_id === packageId);
    return payment?.trangthai || 'chưa thanh toán';
  };

  // Get payment record for a package
  const getPaymentRecord = (packageId) => {
    return payments.find(p => p.hocvien_id === user.memberId && p.goi_id === packageId);
  };

  // Get selected packages with details and payment status
  const selectedPackagesWithStatus = member?.magoi
    ?.map(packageId => {
      const pkg = packages.find(p => p.id === packageId);
      const status = getPaymentStatus(packageId);
      const payment = getPaymentRecord(packageId);
      return {
        ...pkg,
        status,
        payment,
      };
    })
    .sort((a, b) => {
      // Sort by status: chờ xác nhận -> chưa thanh toán -> đã thanh toán
      const statusOrder = { 'chờ xác nhận': 0, 'chưa thanh toán': 1, 'đã thanh toán': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }) || [];

  const stats = {
    total: selectedPackagesWithStatus.length,
    paid: selectedPackagesWithStatus.filter(p => p.status === 'đã thanh toán').length,
    unpaid: selectedPackagesWithStatus.filter(p => p.status === 'chưa thanh toán').length,
    pending: selectedPackagesWithStatus.filter(p => p.status === 'chờ xác nhận').length,
    totalAmount: selectedPackagesWithStatus
      .filter(p => p.status === 'chưa thanh toán')
      .reduce((sum, p) => sum + (p.gia || 0), 0),
  };

  const handleCopySTK = () => {
    navigator.clipboard.writeText(BANK_INFO.stk);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPackageDetail = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'đã thanh toán':
        return { bg: 'rgba(76, 175, 80, 0.1)', border: 'rgba(76, 175, 80, 0.3)', text: '#4caf50', icon: CheckCircle };
      case 'chờ xác nhận':
        return { bg: 'rgba(255, 152, 0, 0.1)', border: 'rgba(255, 152, 0, 0.3)', text: '#ff9800', icon: Clock };
      case 'chưa thanh toán':
        return { bg: 'rgba(244, 67, 54, 0.1)', border: 'rgba(244, 67, 54, 0.3)', text: '#f44336', icon: AlertCircle };
      default:
        return { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.3)', text: '#9ca3af', icon: AlertCircle };
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(79, 195, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#4fc3f7" />
          </div>
          <div>
            <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', margin: 0 }}>Thanh Toán</h1>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '4px 0 0 0' }}>Quản lý các gói tập luyện của bạn</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(79, 195, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(79, 195, 247, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Tổng Gói</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stats.total}</p>
            <p style={{ fontSize: 12, color: '#4fc3f7' }}>gói đã chọn</p>
          </div>
        </div>

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
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Đã Thanh Toán</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stats.paid}</p>
            <p style={{ fontSize: 12, color: '#4caf50' }}>gói hoàn tất</p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(244, 67, 54, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 0% 0%, rgba(244, 67, 54, 0.1), transparent 80%)', opacity: 0.5, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Chưa Thanh Toán</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stats.unpaid}</p>
            <p style={{ fontSize: 12, color: '#ff9800' }}>{fmt(stats.totalAmount)}</p>
          </div>
        </div>

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
            <p style={{ fontSize: 12, color: '#ff9800' }}>đang xử lý</p>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="page-card" style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0 }}>Gói Tập Luyện Của Bạn</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedPackagesWithStatus.length > 0 ? (
            selectedPackagesWithStatus.map((pkg) => {
              const statusInfo = getStatusColor(pkg.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div
                  key={pkg.id}
                  onClick={() => openPackageDetail(pkg)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = statusInfo.text;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {/* Package Icon */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Zap size={24} color="#6366f1" />
                  </div>

                  {/* Package Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', margin: 0, marginBottom: 4 }}>
                      {pkg.ten}
                    </p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                      {pkg.thang} tháng • {pkg.mota}
                    </p>
                  </div>

                  {/* Amount */}
                  <div style={{ textAlign: 'right', marginRight: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0, marginBottom: 4 }}>
                      {fmt(pkg.gia)}
                    </p>
                    {pkg.status === 'chưa thanh toán' && (
                      <p style={{ fontSize: 11, color: '#f44336', margin: 0 }}>Cần thanh toán</p>
                    )}
                    {pkg.status === 'đã thanh toán' && pkg.payment && (
                      <p style={{ fontSize: 11, color: '#4caf50', margin: 0 }}>
                        Thanh toán {pkg.payment.ngay}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: statusInfo.bg,
                    border: `1px solid ${statusInfo.border}`,
                  }}>
                    <StatusIcon size={16} color={statusInfo.text} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: statusInfo.text }}>
                      {pkg.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <Zap size={40} style={{ opacity: 0.3, marginBottom: 16 }} />
              <p style={{ margin: 0, fontSize: 14 }}>Bạn chưa chọn gói tập luyện nào</p>
              <p style={{ margin: '8px 0 0 0', fontSize: 12 }}>Hãy chọn gói để bắt đầu tập luyện</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPackage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
                Chi Tiết Gói
              </h2>
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

            {/* Package Name & Status */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 4 }}>
                    {selectedPackage.ten}
                  </p>
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                    {selectedPackage.thang} tháng • {selectedPackage.mota}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: getStatusColor(selectedPackage.status).bg,
                  border: `1px solid ${getStatusColor(selectedPackage.status).border}`,
                }}>
                  {React.createElement(getStatusColor(selectedPackage.status).icon, {
                    size: 16,
                    color: getStatusColor(selectedPackage.status).text,
                  })}
                  <span style={{ fontSize: 12, fontWeight: 600, color: getStatusColor(selectedPackage.status).text }}>
                    {selectedPackage.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: 24,
            }}>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>
                Giá Gói
              </p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#6366f1', margin: 0 }}>
                {fmt(selectedPackage.gia)}
              </p>
            </div>

            {/* Payment Info */}
            {selectedPackage.payment && (
              <div style={{
                background: selectedPackage.status === 'đã thanh toán'
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(255, 152, 0, 0.1)',
                border: selectedPackage.status === 'đã thanh toán'
                  ? '1px solid rgba(76, 175, 80, 0.2)'
                  : '1px solid rgba(255, 152, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>
                  Thông Tin Thanh Toán
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div>
                    <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4 }}>Phương Thức</p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                      {selectedPackage.payment.phuongthuc}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4 }}>Ngày Thanh Toán</p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                      {selectedPackage.payment.ngay}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Info for Unpaid Packages */}
            {selectedPackage.status === 'chưa thanh toán' && (
              <div style={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f44336', margin: 0, marginBottom: 16 }}>
                  💳 Thông Tin Thanh Toán Chuyển Khoản
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 16,
                  fontSize: 13,
                }}>
                  <div>
                    <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                      Tên Tài Khoản
                    </p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                      {BANK_INFO.ten}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                      Ngân Hàng
                    </p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                      {BANK_INFO.bank}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                    Số Tài Khoản
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(0,0,0,0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}>
                    <p style={{ color: '#fff', fontWeight: 700, margin: 0, flex: 1, fontSize: 14, letterSpacing: '1px' }}>
                      {BANK_INFO.stk}
                    </p>
                    <button
                      onClick={handleCopySTK}
                      style={{
                        background: copied ? '#4caf50' : 'rgba(99, 102, 241, 0.5)',
                        border: 'none',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={14} /> Đã Copy
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                    Chi Nhánh
                  </p>
                  <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>
                    {BANK_INFO.chi_nhanh}
                  </p>
                </div>

                {/* Nội Dung Chuyển Khoản */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: 12,
                }}>
                  <p style={{ color: '#9ca3af', margin: 0, marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                    Nội Dung Chuyển Khoản
                  </p>
                  <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: 12, wordBreak: 'break-all' }}>
                    {member?.hoten} - {selectedPackage.ten}
                  </p>
                </div>

                {/* Important Note */}
                <div style={{
                  background: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: 12,
                }}>
                  <p style={{ fontSize: 12, color: '#ff9800', margin: 0, lineHeight: '1.5' }}>
                    ⚠️ <strong>Lưu ý:</strong> Sau khi chuyển khoản, vui lòng chờ xác nhận từ phòng tập trong vòng 1-2 giờ làm việc.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Instructions */}
            {selectedPackage.status === 'chưa thanh toán' && (
              <div style={{
                background: 'rgba(79, 195, 247, 0.1)',
                border: '1px solid rgba(79, 195, 247, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: 24,
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#4fc3f7', margin: 0, marginBottom: 12 }}>
                  📝 Hướng Dẫn Thanh Toán
                </p>
                <ol style={{ color: '#9ca3af', fontSize: 12, margin: 0, paddingLeft: 20, lineHeight: '1.8' }}>
                  <li>Chuyển khoản số tiền <strong>{fmt(selectedPackage.gia)}</strong> đến STK trên</li>
                  <li>Ghi chú: <strong>{member?.hoten} - {selectedPackage.ten}</strong></li>
                  <li>Chờ xác nhận từ phòng tập (1-2 giờ làm việc)</li>
                  <li>Kiểm tra trạng thái thanh toán tại đây</li>
                </ol>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

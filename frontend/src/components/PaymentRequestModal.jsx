import React, { useState } from 'react';
import { AlertCircle, Check, Loader2, Info } from 'lucide-react';
import { createPayment } from '../services/api';

/**
 * PaymentRequestModal - Modal để member tạo yêu cầu thanh toán
 * Gửi payment lên backend với status "chờ xác nhận" để admin/manager duyệt
 */
export default function PaymentRequestModal({ 
  isOpen, 
  onClose, 
  package: pkg, 
  member,
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePayment = async () => {
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      console.log('📤 Creating payment request:', {
        hocvien_id: member.id,
        goi_id: pkg.id,
        sotien: pkg.gia,
        phuongthuc: paymentMethod,
        trangthai: 'chờ xác nhận'
      });

      const paymentData = {
        hocvien_id: member.id,
        hocvien_ten: member.hoten,
        goi_id: pkg.id,
        goi_ten: pkg.ten,
        sotien: pkg.gia,
        phuongthuc: paymentMethod,
        trangthai: 'chờ xác nhận', // 🔑 Status là chờ xác nhận - admin phải duyệt
        ngay: new Date().toISOString().split('T')[0]
      };

      const response = await createPayment(paymentData);
      
      console.log('✅ Payment created successfully:', response);
      
      // Callback to parent component
      if (onSuccess) {
        onSuccess(response);
      }

      // Close modal and show success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('❌ Error creating payment:', err);
      setError(err.message || 'Lỗi khi tạo yêu cầu thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !pkg || !member) return null;

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0f1429 0%, #141414 100%)',
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, marginBottom: 8 }}>
            ✅ Tạo Yêu Cầu Thanh Toán
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
            Gửi yêu cầu thanh toán cho admin duyệt
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(79, 195, 247, 0.1)',
          border: '1px solid rgba(79, 195, 247, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: 24,
          display: 'flex',
          gap: 12,
        }}>
          <Info size={20} color="#4fc3f7" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#4fc3f7', margin: 0, marginBottom: 4 }}>
              Quy trình thanh toán
            </p>
            <ol style={{ fontSize: 12, color: '#9ca3af', margin: 0, paddingLeft: 16, lineHeight: '1.6' }}>
              <li>Bạn tạo yêu cầu thanh toán</li>
              <li>Admin/Manager xem và xác nhận</li>
              <li>Trạng thái cập nhật thành "Đã thanh toán"</li>
            </ol>
          </div>
        </div>

        {/* Package Info */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>
            Gói Tập Luyện
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 4 }}>
            {pkg.ten}
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#6366f1', margin: 0 }}>
            {new Intl.NumberFormat('vi-VN').format(pkg.gia)}đ
          </p>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#9ca3af',
            marginBottom: 8,
            textTransform: 'uppercase',
          }}>
            Phương Thức Thanh Toán
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <option value="Chuyển khoản" style={{ background: '#0f1429', color: '#fff' }}>
              💳 Chuyển Khoản
            </option>
            <option value="Tiền mặt" style={{ background: '#0f1429', color: '#fff' }}>
              💰 Tiền Mặt
            </option>
            <option value="QR Code" style={{ background: '#0f1429', color: '#fff' }}>
              📱 QR Code
            </option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: 24,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}>
            <AlertCircle size={16} color="#f44336" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: '#f44336', margin: 0, lineHeight: '1.5' }}>
              {error}
            </p>
          </div>
        )}

        {/* Success Message Placeholder */}
        {submitting && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: 24,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Loader2 size={16} color="#4caf50" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 12, color: '#4caf50', margin: 0 }}>
              Đang gửi yêu cầu...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: submitting ? 0.5 : 1,
              pointerEvents: submitting ? 'none' : 'auto',
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: submitting ? 0.7 : 1,
              pointerEvents: submitting ? 'none' : 'auto',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Đang Gửi...
              </>
            ) : (
              <>
                <Check size={16} />
                Gửi Yêu Cầu
              </>
            )}
          </button>
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: 11,
          color: '#9ca3af',
          lineHeight: '1.6',
        }}>
          <p style={{ margin: 0, marginBottom: 8 }}>
            <strong>📝 Lưu ý:</strong> Sau khi gửi yêu cầu, admin/manager sẽ xem xét trong vòng 1-2 giờ làm việc.
          </p>
          <p style={{ margin: 0 }}>
            Trạng thái sẽ được cập nhật tự động khi được phê duyệt.
          </p>
        </div>
      </div>
    </div>
  );
}

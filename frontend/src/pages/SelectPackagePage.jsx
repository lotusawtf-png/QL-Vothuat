import React, { useState, useEffect } from 'react';
import { Zap, Check, Loader2, AlertCircle } from 'lucide-react';
import { getPackages, getMember, getMembers, updateMemberPackages } from '../services/api';

export default function SelectPackagePage({ user, onComplete }) {
  const [packages, setPackages] = useState([]);
  const [member, setMember] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [user?.memberId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load packages
      const pkgs = await getPackages();
      setPackages(pkgs);

      // Load member data
      let memberData = null;
      let memberId = user?.memberId;
      
      // Method 1: Direct fetch by ID
      if (memberId) {
        memberData = await getMember(memberId);
      }
      
      // Method 2: Get all members and find by ID
      if (!memberData) {
        const allMembers = await getMembers();
        memberData = allMembers.find(m => 
          m.id === memberId || 
          m.id === parseInt(memberId) ||
          String(m.id) === String(memberId)
        );
      }
      
      // Method 3: Use first member if still not found
      if (!memberData) {
        const allMembers = await getMembers();
        memberData = allMembers[0];
        
        if (!memberData) {
          throw new Error('Không có học viên nào trong hệ thống');
        }
      }
      
      if (memberData) {
        setMember(memberData);
        const packages = Array.isArray(memberData.magoi) ? memberData.magoi : [];
        setSelectedPackages(packages);
      } else {
        throw new Error('Không thể tải thông tin học viên');
      }
    } catch (err) {
      setError('❌ Lỗi: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setLoading(false);
    }
  };

  const togglePackage = (packageId) => {
    setSelectedPackages(prev => {
      // Ensure prev is always an array
      const currentPackages = Array.isArray(prev) ? prev : [];
      
      if (currentPackages.includes(packageId)) {
        return currentPackages.filter(id => id !== packageId);
      } else {
        return [...currentPackages, packageId];
      }
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    // Ensure selectedPackages is an array
    const packagesToSave = Array.isArray(selectedPackages) ? selectedPackages : [];
    
    if (packagesToSave.length === 0) {
      setError('Vui lòng chọn ít nhất một gói tập luyện');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const result = await updateMemberPackages(user.memberId, packagesToSave);
      
      setSuccess(result.message || 'Cập nhật gói tập luyện thành công!');
      
      // Wait a moment then trigger completion
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1500);
    } catch (err) {
      setError('❌ Lỗi: ' + (err.message || 'Vui lòng thử lại'));
    } finally {
      setSaving(false);
    }
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

  if (!member) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#0f1429', border: '1px solid #ef535033', borderRadius: 12, padding: 32, maxWidth: 500, textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef5350" style={{ marginBottom: 16 }} />
          <p style={{ color: '#ef5350', fontSize: 16, fontWeight: 600 }}>Lỗi</p>
          <p style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Không thể tải thông tin học viên. Vui lòng đăng nhập lại.</p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: 24,
              padding: '10px 24px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Quay lại Đăng Nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', padding: '32px 20px' }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #6366f118 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #6366f110 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}>
              <Zap size={28} color="#fff" fill="#fff" />
            </div>
          </div>
          <h1 className="gym-heading" style={{ fontSize: 32, fontWeight: 800, color: '#f0f0f0', marginBottom: 8 }}>Chọn Gói Tập Luyện</h1>
          <p style={{ color: '#9ca3af', fontSize: 15 }}>Bạn có thể chọn một hoặc nhiều gói</p>
          {member && (
            <p style={{ color: '#4fc3f7', fontSize: 14, marginTop: 8 }}>
              Xin chào, <span style={{ fontWeight: 700 }}>{member.hoten}</span>
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239, 83, 80, 0.1)', border: '1px solid rgba(239, 83, 80, 0.3)', borderRadius: 12, padding: 16, marginBottom: 32, color: '#ef5350', fontSize: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)', borderRadius: 12, padding: 16, marginBottom: 32, color: '#4caf50', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Check size={18} />
            {success}
          </div>
        )}

        {/* Packages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
          {packages && packages.length > 0 ? packages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => !saving && togglePackage(pkg.id)}
              style={{
                background: selectedPackages.includes(pkg.id) ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' : '#0f1429',
                border: selectedPackages.includes(pkg.id) ? '2px solid #6366f1' : '1px solid #1a1f3a',
                borderRadius: 16,
                padding: 24,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: saving ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!selectedPackages.includes(pkg.id) && !saving) {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedPackages.includes(pkg.id) && !saving) {
                  e.currentTarget.style.borderColor = '#1a1f3a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Checkbox */}
              {selectedPackages.includes(pkg.id) && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  background: '#6366f1',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={18} color="#fff" />
                </div>
              )}

              {/* Content */}
              <div>
                <h3 style={{ color: '#f0f0f0', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{pkg.ten}</h3>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>{pkg.mota}</p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: '#6366f1' }}>
                    {(pkg.gia / 1000000).toLocaleString('vi-VN')}
                  </span>
                  <span style={{ color: '#888' }}>M</span>
                </div>

                <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#888', marginBottom: 4 }}>Thời hạn</p>
                    <p style={{ color: '#4fc3f7', fontWeight: 600 }}>{pkg.thang} tháng</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#888', marginBottom: 4 }}>Buổi/Tháng</p>
                    <p style={{ color: '#4caf50', fontWeight: 600 }}>{pkg.mota}</p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <p style={{ color: '#888', textAlign: 'center', gridColumn: '1 / -1' }}>Không có gói nào</p>
          )}
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 32
        }}>
          <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: '1.6' }}>
            <span style={{ color: '#6366f1', fontWeight: 600 }}>💡 Ghi chú:</span> Bạn có thể chọn nhiều gói cùng một lúc. Sau khi chọn, bạn sẽ chỉ nhìn thấy các lớp học của gói đã chọn trên trang Lịch Học.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={handleSave}
            disabled={saving || selectedPackages.length === 0}
            style={{
              padding: '14px 48px',
              background: selectedPackages.length === 0 ? '#1a1f3a' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: selectedPackages.length === 0 || saving ? 'not-allowed' : 'pointer',
              opacity: selectedPackages.length === 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {saving ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Đang lưu...
              </>
            ) : (
              <>
                <Check size={18} />
                Xác Nhận ({selectedPackages.length}/{packages.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

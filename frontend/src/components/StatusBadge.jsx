export default function StatusBadge({ status }) {
  // Hàm trả về style inline dựa trên status
  const getStyle = () => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '30px',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.3px',
    };

    switch (status) {
      case 'đang tập':
        return {
          ...baseStyle,
          background: '#0f2e1a',  // nền xanh đậm
          color: '#ffffff',       // chữ trắng
        };
      case 'đang làm':
      case 'đang mở':
      case 'có mặt':
      case 'đã thanh toán':
        return {
          ...baseStyle,
          background: '#0f2e1a',
          color: '#4ade80',       // chữ xanh sáng
        };
      case 'tạm nghỉ':
      case 'chờ xác nhận':
        return {
          ...baseStyle,
          background: '#2e220f',
          color: '#fbbf24',       // chữ vàng
        };
      case 'đã nghỉ':
      case 'đóng cửa':
      case 'vắng mặt':
        return {
          ...baseStyle,
          background: '#2e0f0f',
          color: '#f87171',       // chữ đỏ nhạt
        };
      default:
        return {
          ...baseStyle,
          background: '#0f1e2e',
          color: '#60a5fa',
        };
    }
  };

  return <span style={getStyle()}>{status}</span>;
}
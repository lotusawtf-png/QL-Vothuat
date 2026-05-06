export default function Avatar({ initials, size = 36, color = '#6366f1' }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
      border: `1.5px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: `0 2px 8px ${color}15`
    }}>
      <span style={{
        fontSize: size * 0.33,
        fontWeight: 800,
        color,
        fontFamily: "'Barlow Condensed','Poppins',sans-serif"
      }}>
        {initials}
      </span>
    </div>
  );
}
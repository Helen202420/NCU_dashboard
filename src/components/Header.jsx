import React, { useState, useEffect } from 'react';

const CustomCompass = ({ size = 52, color = "var(--color-secondary)" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
    {/* Inner Circle */}
    <circle cx="60" cy="60" r="30" stroke={color} strokeWidth="2.5" fill="none" />
    
    {/* Minor Points (diagonal) */}
    <polygon points="60,60 82,38 65,60" fill={color} opacity="0.5" />
    <polygon points="60,60 82,38 60,55" fill={color} opacity="0.8" />
    <polygon points="60,60 82,82 65,60" fill={color} opacity="0.8" />
    <polygon points="60,60 82,82 60,65" fill={color} opacity="0.5" />
    <polygon points="60,60 38,82 60,65" fill={color} opacity="0.8" />
    <polygon points="60,60 38,82 55,60" fill={color} opacity="0.5" />
    <polygon points="60,60 38,38 55,60" fill={color} opacity="0.8" />
    <polygon points="60,60 38,38 60,55" fill={color} opacity="0.5" />

    {/* Major Points (N, S, E, W) */}
    <polygon points="60,60 60,15 52,60" fill={color} opacity="0.5" />
    <polygon points="60,60 60,15 68,60" fill={color} opacity="1" />
    <polygon points="60,60 60,105 68,60" fill={color} opacity="0.5" />
    <polygon points="60,60 60,105 52,60" fill={color} opacity="1" />
    <polygon points="60,60 105,60 60,52" fill={color} opacity="0.5" />
    <polygon points="60,60 105,60 60,68" fill={color} opacity="1" />
    <polygon points="60,60 15,60 60,68" fill={color} opacity="0.5" />
    <polygon points="60,60 15,60 60,52" fill={color} opacity="1" />

    {/* N, S, E, W Labels (Rotated per user request: S on top, N on bottom, E on left, W on right) */}
    <text x="60" y="10" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">S</text>
    <text x="60" y="118" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">N</text>
    <text x="115" y="65" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">W</text>
    <text x="5" y="65" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">E</text>

  </svg>
);

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', { hour12: false });

  return (
    <header className="header-container">
      {/* Top golden bar with purple text */}
      <div className="header-top-bar">
        <div className="header-top-content">
          115 全國大專校院運動會 @ 中大
        </div>
      </div>

      {/* Main title area */}
      <div className="header-main">
        {/* Titles centered */}
        <div className="header-title-box">
          <h1>
            即時環境資訊監測儀表板
          </h1>
          <p style={{
            fontSize: 'var(--fs-h3)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            marginTop: '0.5rem',
            opacity: 0.75
          }}>
            Real-time Environmental Dashboard
          </p>

        </div>

        {/* Live Clock block with Robot Image on the right */}
        <div className="header-widgets">
           <div style={{
              background: 'rgba(245, 243, 248, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.5rem',
              borderRadius: '24px', 
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
           }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>CAMPUS TIME</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'monospace' }}>{timeString}</div>
           </div>
           
           <div style={{ padding: '0 0.25rem', display: 'flex', alignItems: 'center' }}>
             <CustomCompass size={56} color="var(--color-primary)" />
           </div>

           <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(245, 243, 248, 0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 8px 16px rgba(45, 27, 77, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '6px'
           }}>

             <img 
                src="/robot.png" 
                alt="NCU Mascot" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.warn('Please add robot.png to the public folder');
                }}
             />
           </div>
        </div>
      </div>
    </header>

  );
};

export default Header;

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

    {/* N, S, E, W Labels */}
    <text x="60" y="10" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">N</text>
    <text x="60" y="118" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">S</text>
    <text x="115" y="65" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">E</text>
    <text x="5" y="65" fill={color} fontSize="14" fontFamily="Inter, sans-serif" fontWeight="900" textAnchor="middle">W</text>
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
    <header style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top golden bar with purple text - Absolute positioned to break out of container */}
      <div style={{
        position: 'absolute',
        top: '-2rem', // Offset the dashboard-container's 2rem top padding
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        background: 'var(--color-secondary)',
        padding: '0.75rem 0',
        zIndex: 50,
        borderBottom: '2px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          fontSize: '1.1rem',
          fontWeight: 800, // Extra bold the specific text requested
          color: 'var(--color-primary-dark)',
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '0.02em'
        }}>
          115 全國大專校院運動會 @ 中大
        </div>
      </div>

      {/* Main title area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '4rem', // Push down title below the new golden bar
        paddingBottom: '1rem'
      }}>
        {/* Titles centered */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: 0,
            color: 'var(--color-primary-dark)',
            letterSpacing: '0.02em'
          }}>
            即時環境資訊監測儀表板
          </h1>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#563D82', // Freeze to deep purple
            marginTop: '0.5rem',
            opacity: 0.75
          }}>
            Real-time Environmental Dashboard
          </p>
        </div>

        {/* Live Clock block with Robot Image on the right */}
        <div style={{
           position: 'absolute',
           right: 0,
           top: '60%',
           transform: 'translateY(-50%)',
           display: 'flex',
           alignItems: 'center',
           gap: '0.5rem'
        }}>
           <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.5rem',
              borderRadius: '24px', 
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
           }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>CAMPUS TIME</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', fontFamily: 'monospace' }}>{timeString}</div>
           </div>
           
           <div style={{ padding: '0 0.5rem', display: 'flex', alignItems: 'center' }}>
             <CustomCompass size={56} color="#8576A5" />
           </div>

           <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
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
                  e.target.style.display = 'none'; // Hide if image is missing
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

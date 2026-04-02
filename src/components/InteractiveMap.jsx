import React from 'react';

// Custom lightweight SVG line icons to perfectly match the user's reference diagram
const strokeColor = "var(--color-primary-dark)";

const icons = {
  basketball: (
    <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M 2 12 H 22 M 12 2 V 22 M 4.9 4.9 Q 10.5 12 4.9 19.1 M 19.1 4.9 Q 13.5 12 19.1 19.1" />
    </svg>
  ),
  volleyball: (
    <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-20deg)' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M 8.9 2.5 Q 4 12 8.9 21.5 M 15.1 2.5 Q 20 12 15.1 21.5 M 6.4 7.5 Q 12 9.5 17.6 7.5 M 6.4 16.5 Q 12 14.5 17.6 16.5 M 2 12 L 6 12 M 4.8 5 L 7.3 6.6 M 4.8 19 L 7.3 17.4 M 22 12 L 18 12 M 19.2 5 L 16.7 6.6 M 19.2 19 L 16.7 17.4" />
    </svg>
  ),
  runner: (
    <svg width="45%" height="55%" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(-2px)' }}>
      {/* Head */}
      <circle cx="16" cy="3.5" r="2.2" fill={strokeColor} stroke="none" />
      
      {/* Right Arm (forward, bent up) */}
      <path d="M 13.5 7.5 L 17 10 L 20.5 5" fill="none" />
      
      {/* Left Arm (backward, swept left and down) */}
      <path d="M 13.5 7.5 L 9 10 L 5 12" fill="none" />
      
      {/* Torso */}
      <path d="M 13.5 7.5 L 11 14" fill="none" />
      
      {/* Right Leg (front knee bent, leg down) */}
      <path d="M 11 14 L 15 17.5 L 12 22.5" fill="none" />
      
      {/* Left Leg (back, foot swept high) */}
      <path d="M 11 14 L 7 17.5 L 2 15" fill="none" />
    </svg>
  ),
  tennis: (
    <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(25deg)' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M4.9 4.9 Q 10.5 12 4.9 19.1" />
      <path d="M19.1 4.9 Q 13.5 12 19.1 19.1" />
    </svg>
  ),
  restroom: (
    <svg width="50%" height="50%" viewBox="0 0 24 24">
      <text x="50%" y="50%" dy="0.35em" fill={strokeColor} fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">WC</text>
    </svg>
  )
};

const InteractiveMap = ({ onToggle, isActive }) => {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '1000px',
        position: 'relative',
        aspectRatio: '16/9',
        margin: '0 auto',
      }}
      className={`interactive-map ${isActive ? 'active' : ''}`}
    >
      <style>
        {`
          .map-zone {
            position: absolute;
            background: var(--gradient-gold); /* Champagne Gold Gradient */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease, box-shadow 0.3s ease;
            box-shadow: var(--shadow-sm);
            z-index: 1;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.4); /* soft detail */
          }
          .map-zone:hover {
            transform: scale(1.08); /* 放大互動效果 */
            filter: brightness(1.1); /* 變亮效果 */
            box-shadow: var(--shadow-lg);
            z-index: 10;
          }
          .interactive-map {
            min-height: 400px;
          }
          @media (max-width: 768px) {
            .interactive-map {
              min-height: 250px;
              aspect-ratio: 4/3; /* Slightly taller aspect ratio for mobile screens */
            }
          }
          .interactive-map.active .map-zone {
            box-shadow: var(--shadow-glow);
          }
        `}
      </style>

      {/* Center Huge Oval (Runner/Track) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '30%', top: '5%', width: '38%', height: '70%', borderRadius: '50%'
      }}>
        {icons.runner}
      </div>

      {/* === LEFT SIDE === */}

      {/* Top Left (Basketball) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '8%', top: '5%', width: '13%', height: '28%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Middle Left (Volleyball) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '8%', top: '37%', width: '13%', height: '28%', borderRadius: '4px'
      }}>
        {icons.volleyball}
      </div>

      {/* Bottom Left (Basketball) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '5%', top: '70%', width: '12%', height: '24%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Bottom Left Small (Restroom) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '18%', top: '69%', width: '7%', height: '12%', borderRadius: '2px'
      }}>
        {icons.restroom}
      </div>

      {/* === RIGHT SIDE === */}

      {/* Top Right (Basketball) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '78%', top: '15%', width: '13%', height: '40%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Bottom Right (Volleyball) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '78%', top: '60%', width: '13%', height: '30%', borderRadius: '4px'
      }}>
        {icons.volleyball}
      </div>

      {/* === BOTTOM === */}

      {/* Bottom Center (Tennis) */}
      <div className="map-zone" onClick={onToggle} style={{
        left: '28%', top: '83%', width: '46%', height: '16%', borderRadius: '4px'
      }}>
        {icons.tennis}
      </div>

    </div>
  );
};

export default InteractiveMap;

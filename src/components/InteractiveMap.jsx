import React from 'react';

// Custom lightweight SVG line icons to perfectly match the user's reference diagram
const strokeColor = "var(--color-primary-dark)";

const icons = {
  basketball: (
    <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      {/* 經典籃球十字線與側邊弧線 */}
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="M4.93 4.93c2.83 2.83 2.83 11.31 0 14.14" />
      <path d="M19.07 4.93c-2.83 2.83-2.83 11.31 0 14.14" />
    </svg>
  ),
  volleyball: (
    <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-20deg)' }}>
      <circle cx="12" cy="12" r="10" />
      {/* 經典 18 片傳統排球紋路 (Classic 18-panel volleyball) */}
      <path d="M 8.9 2.5 Q 4 12 8.9 21.5" />
      <path d="M 15.1 2.5 Q 20 12 15.1 21.5" />
      
      <path d="M 6.4 7.5 Q 12 9.5 17.6 7.5" />
      <path d="M 6.4 16.5 Q 12 14.5 17.6 16.5" />

      <path d="M 2 12 L 6 12" />
      <path d="M 4.8 5 L 7.3 6.6" />
      <path d="M 4.8 19 L 7.3 17.4" />
      
      <path d="M 22 12 L 18 12" />
      <path d="M 19.2 5 L 16.7 6.6" />
      <path d="M 19.2 19 L 16.7 17.4" />
    </svg>
  ),
  runner: (
    <svg width="30%" height="40%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scale(1.2)' }}>
      <circle cx="14" cy="5" r="2.5" />
      {/* Stick figure body/arms/legs based loosely on runner icon */}
      <path d="M9 10l3-2.5 3.5 2 2.5-1" />
      <path d="M12 13.5L9.5 18 11.5 22" />
      <path d="M12 13.5l3.5-1 1.5 5" />
      <path d="M1 11h4" />
      <path d="M2 15h3" />
    </svg>
  ),
  tennis: (
    <svg width="25%" height="75%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="5" />
      <line x1="11.5" y1="11.5" x2="19" y2="19" />
      <line x1="17" y1="21" x2="21" y2="17" />
      {/* Racket grid inner lines */}
      <path d="M4 8h8 M8 4v8" opacity="0.4" />
      
      <circle cx="16" cy="8" r="5" />
      <line x1="12.5" y1="11.5" x2="5" y2="19" />
      <line x1="7" y1="21" x2="3" y2="17" />
      {/* Racket 2 grid inner lines */}
      <path d="M12 8h8 M16 4v8" opacity="0.4" />
      
      <circle cx="12" cy="3" r="1.5" fill={strokeColor} />
    </svg>
  ),
  restroom: (
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Male Figure */}
      <circle cx="7" cy="5" r="2" />
      <path d="M7 8 L7 15" />
      <path d="M4 10 L10 10" />
      <path d="M7 15 L5 21 M7 15 L9 21" />
      {/* Female Figure */}
      <circle cx="17" cy="5" r="2" />
      <path d="M17 8 L14 15 L20 15 Z" />
      <path d="M17 15 L15 21 M17 15 L19 21" />
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
            background: var(--color-secondary); /* 金色 */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease, box-shadow 0.3s ease;
            box-shadow: var(--shadow-sm);
            z-index: 1;
            overflow: hidden;
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

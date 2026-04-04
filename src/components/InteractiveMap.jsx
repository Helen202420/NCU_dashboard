import React from 'react';

// Custom lightweight SVG line icons to perfectly match the user's reference diagram
const strokeColor = "var(--color-primary-dark)";

const icons = {
  basketball: (
    <img src="https://img.icons8.com/ios-filled/50/basketball-2.png" alt="basketball" className="map-icon" />
  ),
  volleyball: (
    <img src="https://img.icons8.com/ios-filled/50/volleyball-2.png" alt="volleyball" className="map-icon" />
  ),
  runner: (
    <img src="https://img.icons8.com/ios-filled/50/running.png" alt="running" className="map-icon" />
  ),
  tennis: (
    <img src="https://img.icons8.com/ios-filled/50/tennis-2.png" alt="tennis" className="map-icon" />
  ),
  restroom: (
    <img src="https://img.icons8.com/ios-filled/50/toilet.png" alt="restroom" className="map-icon" />
  )
};

const InteractiveMap = ({ onSelectVenue, isActive }) => {
  const venues = {
    track: { id: 'track', name: '操場環境', type: 'outdoor', deviceId: 'device_4' },
    indoorBB: { id: 'indoor_bb', name: '室內籃球場環境', type: 'indoor', deviceId: 'ab170023' },
    indoorVB: { id: 'indoor_vb', name: '室內排球場環境', type: 'indoor', deviceId: 'ab170019' },
    outdoorBB: { id: 'outdoor_bb', name: '室外籃球場環境', type: 'outdoor', deviceId: 'device_6' },
    outdoorVB: { id: 'outdoor_vb', name: '室外排球場環境', type: 'outdoor', deviceId: 'device_7' },
    tennis: { id: 'tennis', name: '室外網球場環境', type: 'outdoor', deviceId: 'ab170023' },
    wc: { id: 'wc', name: '洗手間環境', type: 'outdoor', deviceId: 'device_3' },
    outdoorBB2: { id: 'outdoor_bb_2', name: '室外籃球場環境', type: 'outdoor', deviceId: 'device_8' }
  };

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
            background: var(--gradient-gold); /* Default Outdoor Gold */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 0.3s ease, box-shadow 0.3s ease;
            box-shadow: var(--shadow-sm);
            z-index: 1;
            overflow: visible;
            border: 1px solid rgba(255,255,255,0.4);
          }
          .map-zone.indoor {
            background: #B192D4; /* Solid Lavender/Purple */
            box-shadow: var(--shadow-sm);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .map-zone:hover {
            transform: scale(1.08);
            filter: brightness(1.1);
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
          // .interactive-map.active .map-zone {
            box-shadow: var(--shadow-glow);
          }
          .map-icon {
            max-width: 60%;
            max-height: 60%;
            object-fit: contain;
            /* Filter to turn black (#000000) to Deep Purple (#2D1B4D) */
            filter: invert(12%) sepia(48%) saturate(4552%) hue-rotate(252deg) brightness(91%) contrast(105%);
            transition: transform 0.3s ease;
          }
          .map-zone:hover .map-icon {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* Center Huge Oval (Runner/Track) */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.track)} style={{
        left: '30%', top: '5%', width: '38%', height: '70%', borderRadius: '50%'
      }}>
        {icons.runner}
      </div>

      {/* === LEFT SIDE === */}

      {/* Top Left (Basketball) - Indoor */}
      <div className="map-zone indoor" onClick={() => onSelectVenue(venues.indoorBB)} style={{
        left: '8%', top: '5%', width: '13%', height: '28%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Middle Left (Volleyball) - Indoor */}
      <div className="map-zone indoor" onClick={() => onSelectVenue(venues.indoorVB)} style={{
        left: '8%', top: '37%', width: '13%', height: '28%', borderRadius: '4px'
      }}>
        {icons.volleyball}
      </div>

      {/* Bottom Left (Basketball) - Outdoor */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.outdoorBB2)} style={{
        left: '5%', top: '70%', width: '12%', height: '24%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Bottom Left Small (Restroom) - Outdoor */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.wc)} style={{
        left: '18%', top: '69%', width: '7%', height: '12%', borderRadius: '2px'
      }}>
        {icons.restroom}
      </div>

      {/* === RIGHT SIDE === */}

      {/* Top Right (Basketball) - Outdoor */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.outdoorBB)} style={{
        left: '78%', top: '15%', width: '13%', height: '40%', borderRadius: '4px'
      }}>
        {icons.basketball}
      </div>

      {/* Bottom Right (Volleyball) - Outdoor */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.outdoorVB)} style={{
        left: '78%', top: '60%', width: '13%', height: '30%', borderRadius: '4px'
      }}>
        {icons.volleyball}
      </div>

      {/* === BOTTOM === */}

      {/* Bottom Center (Tennis) - Outdoor */}
      <div className="map-zone" onClick={() => onSelectVenue(venues.tennis)} style={{
        left: '28%', top: '83%', width: '46%', height: '16%', borderRadius: '4px'
      }}>
        {icons.tennis}
      </div>

    </div>
  );
};

export default InteractiveMap;

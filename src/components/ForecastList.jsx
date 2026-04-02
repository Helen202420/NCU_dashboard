import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

// Generate 24 hours of mock data
const mockData = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  
  // Create some varied weather conditions based on time of day
  let icon = 'sun';
  let temp = 20 + Math.floor(Math.random() * 8);
  let precip = Math.floor(Math.random() * 20);
  
  if (i >= 18 || i <= 5) {
    icon = 'cloud';
    temp -= 4; // Cooler at night
  } else if (i > 13 && i < 17) {
    icon = 'cloud-sun';
    precip += 15;
  } else if (i === 17) {
    icon = 'rain';
    precip += 60;
  }
  
  return { 
    time: `${hour}:00`, 
    icon, 
    temp: `${temp}°`, 
    precip: `${precip}%`
  };
});

const getIcon = (type, isActive) => {
  const color = isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)';
  switch(type) {
    case 'sun': return <Sun size={32} color={color} />;
    case 'cloud-sun': return <Cloud size={32} color={color} />;
    case 'cloud': return <Cloud size={32} color={color} />;
    case 'rain': return <CloudRain size={32} color={color} />;
    default: return <Sun size={32} color={color} />;
  }
};

const ForecastList = () => {
  // Start with null so no card is initially selected (all white)
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div style={{ padding: '0 1rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800, color: 'var(--color-primary-dark)' }}>24小時天氣預報</h2>

        
        {/* Toggle switch */}
        <div style={{ display: 'flex', background: 'white', borderRadius: '20px', padding: '4px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '0.4rem 1rem', background: 'var(--color-primary-dark)', color: 'white', borderRadius: '16px', fontSize: 'var(--fs-tiny)', fontWeight: 700, cursor: 'pointer' }}>HOURLY</div>

          <div style={{ padding: '0.4rem 1rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-tiny)', fontWeight: 700, cursor: 'pointer' }}>DAILY</div>

        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', WebkitOverflowScrolling: 'touch' }}>
        {mockData.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <div 
              key={i} 
              onMouseEnter={() => setActiveIndex(i)} 
              onMouseLeave={() => setActiveIndex(null)}
              className={`glass-panel ${isActive ? 'text-white' : ''}`}
              style={{ 
                background: isActive ? 'var(--color-primary)' : 'rgba(245, 243, 248, 0.8)',
                minWidth: '120px', 
                padding: '2rem 1rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                border: isActive ? '1px solid var(--color-secondary)' : '1px solid rgba(229, 211, 168, 0.4)',
                position: 'relative',
                cursor: 'default',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
              }}>
              
              <div style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: isActive ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)' }}>

                {item.time}
              </div>
              
              <div className="flex-center" style={{ width: '48px', height: '48px' }}>
                {getIcon(item.icon, isActive)}
              </div>

              <div style={{ fontSize: 'var(--fs-h1)', fontWeight: 800, color: isActive ? 'white' : 'var(--color-primary-dark)' }}>

                {item.temp}
              </div>
              
              <div style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, color: isActive ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>

                <CloudRain size={12} /> {item.precip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;

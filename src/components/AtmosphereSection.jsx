import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Polygon } from 'recharts';

const data = [
  { subject: 'UV INDEX', A: 80, fullMark: 100 },
  { subject: 'COMFORT', A: 90, fullMark: 100 },
  { subject: 'HUMIDITY', A: 65, fullMark: 100 },
  { subject: 'AIR QUALITY', A: 85, fullMark: 100 },
  { subject: 'TEMP', A: 70, fullMark: 100 },
];

const AtmosphereSection = () => {
  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div>
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.2rem' }}>天氣雷達圖</h2>

        <p className="text-secondary-dark" style={{ fontSize: 'var(--fs-tiny)', fontWeight: 700, color: 'var(--color-secondary-dark)', letterSpacing: '0.05em' }}>Coming Soon...</p>

      </div>


      <div style={{ flex: 1, marginTop: '1rem', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }} />
            <Radar name="Atmosphere" dataKey="A" stroke="var(--color-secondary-dark)" fill="var(--color-secondary)" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
        
        {/* Soft center glow decoration */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          height: '100px',
          background: 'var(--color-secondary)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: 0.15,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}></div>
      </div>
    </div>
  );
};

export default AtmosphereSection;

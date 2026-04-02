import React from 'react';
import { Map, Crosshair } from 'lucide-react';

const SatelliteTrack = () => {
  return (
    <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
      {/* Background that looks like a satellite map. We will use a CSS gradient pattern to simulate terrain/grid for now. */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#1E293B',
        backgroundImage: 'radial-gradient(circle at 20% 30%, #334155 0%, transparent 40%), radial-gradient(circle at 80% 70%, #0F172A 0%, transparent 50%), linear-gradient(#1E293B, #0F172A)',
        zIndex: 0
      }}>
        {/* Subtle grid line overlay */}
        <div style={{
          width: '100%', height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: '#F8FAFC' }}>Satellite Track</h2>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-secondary)' }}></div>
           </div>
           <p style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', marginTop: '0.2rem' }}>ORBITAL CLOUD ANALYSIS</p>
        </div>


        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
           <button style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
             <Map size={18} color="#F8FAFC" />
           </button>
           <button style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
             <Crosshair size={18} color="#F8FAFC" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default SatelliteTrack;

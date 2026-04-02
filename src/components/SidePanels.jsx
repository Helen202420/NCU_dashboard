import React from 'react';
import { Home, Cloud, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

const IndoorClimate = ({ className }) => {
  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>INDOOR CLIMATE</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Home size={16} className="text-muted" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Thermometer size={20} className="text-muted"/>
             <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>TEMPERATURE</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>22.4°</div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', background: 'var(--color-secondary)' }}></div>
        </div>

        <div className="flex-between mt-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Droplets size={20} className="text-muted"/>
             <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>HUMIDITY</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>42<span style={{fontSize: '1rem'}}>%</span></div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '42%', height: '100%', background: 'var(--color-secondary)' }}></div>
        </div>

        <div className="flex-between mt-4">
          <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>CO2 LEVELS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>412 <span style={{fontSize: '0.9rem', fontWeight: 600}} className="text-muted">PPM</span></div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '30%', height: '100%', background: 'var(--color-primary)' }}></div>
        </div>
      </div>
    </div>
  );
};

const OutdoorAir = ({ className }) => {
  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>OUTDOOR AIR</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Cloud size={16} className="text-muted" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="flex-between">
          <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>AQI INDEX</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>28</div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '28%', height: '100%', background: 'var(--color-primary)' }}></div>
        </div>

        <div className="flex-between mt-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Wind size={20} className="text-muted"/>
             <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>WIND SPEED</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>12 <span style={{fontSize: '0.9rem', fontWeight: 600}} className="text-muted">KM/H</span></div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: 'var(--color-secondary)' }}></div>
        </div>

        <div className="flex-between mt-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Eye size={20} className="text-muted"/>
             <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>VISIBILITY</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>10 <span style={{fontSize: '0.9rem', fontWeight: 600}} className="text-muted">KM</span></div>
        </div>
        <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '90%', height: '100%', background: 'var(--color-primary)' }}></div>
        </div>
      </div>
    </div>
  );
};

const SidePanels = ({ show, hasInteracted }) => {
  // If not interacted yet and initially closed, don't apply any animation classes, just keep them hidden (opacity 0)
  const leftClass = hasInteracted ? (show ? 'panel-enter-left' : 'panel-exit-left') : (show ? '' : 'hidden-initial');
  const rightClass = hasInteracted ? (show ? 'panel-enter-right' : 'panel-exit-right') : (show ? '' : 'hidden-initial');

  return (
    <div className="side-panels-wrapper">
      <IndoorClimate className={leftClass} />
      <OutdoorAir className={rightClass} />
    </div>
  );
};

export default SidePanels;

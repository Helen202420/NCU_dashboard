import React from 'react';
import { Home, Cloud, Thermometer, Droplets, Wind, Zap } from 'lucide-react';

const MetricOverlay = ({ label, value, unit, icon: Icon, colorClass, percent = 50 }) => (
  <div style={{ marginBottom: '1.2rem' }}>
    <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size={18} className="text-muted" />
        <span className="text-muted" style={{ fontSize: 'var(--fs-small)', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 'var(--fs-h3)', fontWeight: 800 }}>
        {value}<span style={{ fontSize: 'var(--fs-tiny)', marginLeft: '2px' }}>{unit}</span>
      </div>
    </div>
    <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ width: `${percent}%`, height: '100%', background: colorClass }} />
    </div>
  </div>
);

const IndoorClimate = ({ className }) => {
  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '1.5rem 2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-body)', fontWeight: 800, color: 'var(--color-primary)' }}>室內環境</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Home size={16} className="text-muted" />
        </div>
      </div>

      <div>
        <MetricOverlay label="體感溫度" value="22.4" unit="°" icon={Thermometer} colorClass="var(--color-secondary)" percent={60} />
        <MetricOverlay label="RH" value="42" unit="%" icon={Droplets} colorClass="var(--color-secondary)" percent={42} />
        <MetricOverlay label="CO2" value="412" unit="PPM" icon={Wind} colorClass="var(--color-primary)" percent={30} />
        <MetricOverlay label="PM2.5" value="12" unit="µg/m³" icon={Cloud} colorClass="var(--color-primary)" percent={20} />
      </div>
    </div>
  );
};

const OutdoorAir = ({ className }) => {
  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '1.5rem 2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-body)', fontWeight: 800, color: 'var(--color-primary)' }}>室外環境</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Cloud size={16} className="text-muted" />
        </div>
      </div>

      <div>
        <MetricOverlay label="體感溫度" value="23.1" unit="°" icon={Thermometer} colorClass="var(--color-secondary)" percent={65} />
        <MetricOverlay label="RH" value="18" unit="%" icon={Droplets} colorClass="var(--color-secondary)" percent={18} />
        <MetricOverlay label="CO2" value="385" unit="PPM" icon={Wind} colorClass="var(--color-primary)" percent={25} />
        <MetricOverlay label="PM2.5" value="15" unit="µg/m³" icon={Cloud} colorClass="var(--color-primary)" percent={28} />
      </div>
    </div>
  );
};

const SidePanels = ({ show, hasInteracted }) => {
  // If not interacted yet and initially closed, don't apply any animation classes, just keep them hidden (opacity 0)
  const leftClass = hasInteracted ? (show ? 'panel-enter-left' : 'panel-exit-left') : (show ? '' : 'hidden-initial');
  const rightClass = hasInteracted ? (show ? 'panel-enter-right' : 'panel-exit-right') : (show ? '' : 'hidden-initial');

  return (
    <div className={`side-panels-wrapper ${show ? 'has-active-panels' : ''}`}>
      <IndoorClimate className={leftClass} />
      <OutdoorAir className={rightClass} />
    </div>
  );

};

export default SidePanels;

import React, { useState, useMemo } from 'react';
import { Home, Cloud, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateMockData = (baseValue, variance) => {
  return Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    value: parseFloat(Math.max(0, baseValue + (Math.random() * variance * 2 - variance)).toFixed(1))
  }));
};

const MetricOverlay = ({ label, value, unit, icon: Icon, colorClass, percent = 50, dataDomain, historyData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ 
      marginBottom: '0.8rem', 
      padding: '0.5rem', 
      background: isExpanded ? 'rgba(0,0,0,0.02)' : 'transparent', 
      borderRadius: '12px', 
      transition: 'background 0.3s ease' 
    }}>
      <div 
        className="flex-between" 
        style={{ marginBottom: '0.4rem' }} 
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon size={18} className="text-muted" />
          <span className="text-muted" style={{ fontSize: 'var(--fs-small)', fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontSize: 'var(--fs-h3)', fontWeight: 800 }}>
            {value}<span style={{ fontSize: 'var(--fs-tiny)', marginLeft: '2px' }}>{unit}</span>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            title="點擊展開/收合歷史趨勢"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: isExpanded ? colorClass : 'var(--color-text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.2rem', 
              cursor: 'pointer', 
              padding: '4px 6px', 
              opacity: isExpanded ? 1 : 0.6,
              outline: 'none'
            }}
          >
            <Activity size={14} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.5px' }}>HISTORY</span>
          </button>
        </div>
      </div>
      
      <div style={{ height: '4px', background: 'var(--color-bg)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: colorClass, transition: 'width 1s ease-out' }} />
      </div>

      {/* Expandable Chart Section */}
      <div style={{ 
        height: isExpanded ? '130px' : '0px', 
        opacity: isExpanded ? 1 : 0, 
        overflow: 'hidden', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: isExpanded ? '1rem' : '0',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {isExpanded && (
          <div style={{ width: '250px', height: '130px', position: 'relative' }}>
            <LineChart width={250} height={130} data={historyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <XAxis dataKey="time" hide />
              <YAxis 
                domain={dataDomain || ['auto', 'auto']} 
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-primary-dark)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                itemStyle={{ color: 'white' }}
                formatter={(val) => [`${val} ${unit}`, label]}
                labelStyle={{ color: 'var(--color-secondary)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colorClass} 
                strokeWidth={2.5} 
                dot={false} 
                isAnimationActive={true} 
                animationDuration={800}
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
};

const IndoorClimate = ({ className }) => {
  // Memoize data to avoid recreation on re-renders
  const indoorData = useMemo(() => ({
    temp: generateMockData(22.4, 2),
    rh: generateMockData(42, 5),
    co2: generateMockData(412, 50),
    pm25: generateMockData(12, 3),
  }), []);

  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '1.5rem 2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-body)', fontWeight: 800, color: 'var(--color-primary)' }}>室內環境</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Home size={16} className="text-muted" />
        </div>
      </div>

      <div>
        <MetricOverlay label="體感溫度" value="22.4" unit="°" icon={Thermometer} colorClass="var(--color-secondary)" percent={60} dataDomain={['auto', 'auto']} historyData={indoorData.temp} />
        <MetricOverlay label="RH" value="42" unit="%" icon={Droplets} colorClass="var(--color-secondary)" percent={42} dataDomain={['auto', 'auto']} historyData={indoorData.rh} />
        <MetricOverlay label="CO2" value="412" unit="PPM" icon={Wind} colorClass="var(--color-primary)" percent={30} dataDomain={['auto', 'auto']} historyData={indoorData.co2} />
        <MetricOverlay label="PM2.5" value="12" unit="µg/m³" icon={Cloud} colorClass="var(--color-primary)" percent={20} dataDomain={['auto', 'auto']} historyData={indoorData.pm25} />
      </div>
    </div>
  );
};

const OutdoorAir = ({ className }) => {
  const outdoorData = useMemo(() => ({
    temp: generateMockData(23.1, 3),
    rh: generateMockData(18, 5),
    co2: generateMockData(385, 20),
    pm25: generateMockData(15, 8),
  }), []);

  return (
    <div className={`glass-panel panel-container ${className}`} style={{ padding: '1.5rem 2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-body)', fontWeight: 800, color: 'var(--color-primary)' }}>室外環境</h2>
        <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--color-bg)', borderRadius: '50%' }}>
          <Cloud size={16} className="text-muted" />
        </div>
      </div>

      <div>
        <MetricOverlay label="體感溫度" value="23.1" unit="°" icon={Thermometer} colorClass="var(--color-secondary)" percent={65} dataDomain={['auto', 'auto']} historyData={outdoorData.temp} />
        <MetricOverlay label="RH" value="18" unit="%" icon={Droplets} colorClass="var(--color-secondary)" percent={18} dataDomain={['auto', 'auto']} historyData={outdoorData.rh} />
        <MetricOverlay label="CO2" value="385" unit="PPM" icon={Wind} colorClass="var(--color-primary)" percent={25} dataDomain={['auto', 'auto']} historyData={outdoorData.co2} />
        <MetricOverlay label="PM2.5" value="15" unit="µg/m³" icon={Cloud} colorClass="var(--color-primary)" percent={28} dataDomain={['auto', 'auto']} historyData={outdoorData.pm25} />
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

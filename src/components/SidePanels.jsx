import React, { useState, useEffect, useMemo } from 'react';
import { Thermometer, Droplets, CloudFog, Activity, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const API_BASE = 'https://box-sigma-ten.vercel.app/sensor/latest';

const MetricOverlay = ({ label, value, unit, icon: Icon, historyData, onToggleHistory, isActive }) => {
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    return historyData.map(d => ({
      time: new Date(d.device_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      value: d[label === '體感溫度' ? 'temperature' : label === '濕度' ? 'humidity' : label === 'PM2.5' ? 'pm25' : 'pm10']
    }));
  }, [historyData, label]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return ['auto', 'auto'];
    const vals = chartData.map(d => d.value).filter(v => v !== null && v !== undefined);
    if (vals.length === 0) return ['auto', 'auto'];
    return [Math.min(...vals) - 1, Math.max(...vals) + 1];
  }, [chartData]);

  return (
    <div style={{ marginBottom: '1.2rem', padding: '0.4rem 0' }}>
      <div className="flex-between" style={{ cursor: 'pointer' }} onClick={onToggleHistory}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="flex-center" style={{ width: '36px', height: '36px', background: 'rgba(49, 46, 129, 0.05)', borderRadius: '10px' }}>
             <Icon size={20} style={{ color: '#312E81' }} />
          </div>
          <div>
            <div style={{ color: '#312E81', fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>{label}</div>
            <div style={{ color: '#312E81', fontSize: '1.4rem', fontWeight: 800 }}>
              {value ?? '--'}<span style={{ fontSize: '0.9rem', marginLeft: '2px', fontWeight: 600 }}>{unit}</span>
            </div>
          </div>
        </div>
        
        <button 
          style={{ 
            background: isActive ? '#312E81' : 'transparent',
            border: `1.5px solid ${isActive ? '#312E81' : 'rgba(49, 46, 129, 0.2)'}`,
            borderRadius: '20px',
            padding: '4px 10px',
            color: isActive ? 'white' : '#312E81',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Activity size={14} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>HISTORY</span>
        </button>
      </div>

      {/* Trend Chart Section */}
      <div style={{ 
        height: isActive ? '140px' : '0px', 
        opacity: isActive ? 1 : 0, 
        overflow: 'hidden', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: isActive ? '1rem' : '0'
      }}>
        {isActive && (
          <div style={{ width: '100%', height: '140px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={yDomain} hide />
                  <Tooltip 
                    contentStyle={{ background: '#312E81', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                    itemStyle={{ color: 'white' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#312E81" 
                    strokeWidth={3} 
                    dot={false}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-center" style={{ height: '100%', color: '#312E81', opacity: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>
                暫無趨勢資料
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const VenuePanel = ({ venue, show, hasInteracted, onClose }) => {
  const [realTime, setRealTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState(null);

  useEffect(() => {
    if (!venue || !show) return;

    const fetchData = async () => {
      setLoading(true);
      
      const fetchRealTime = async () => {
        try {
          const fetchWithTimeout = (url, timeout = 3000) => {
            return Promise.race([
              fetch(url),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]);
          };

          let apiRes;
          try {
            apiRes = await fetchWithTimeout(API_BASE, 3000);
            if (!apiRes.ok) throw new Error(`HTTP Error: ${apiRes.status}`);
            const apiData = await apiRes.json();
            return apiData.results?.find(r => r.device_id === venue.deviceId)?.data;
          } catch (e) {
            console.warn('Real-time direct fetch failed or timed out, trying CORS proxy...');
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(API_BASE)}`;
            const proxyRes = await fetch(proxyUrl);
            const proxyData = await proxyRes.json();
            const apiData = typeof proxyData.contents === 'string' ? JSON.parse(proxyData.contents) : proxyData.contents;
            return apiData.results?.find(r => r.device_id === venue.deviceId)?.data;
          }
        } catch (err) {
          console.error('Real-time API fetch failed:', err);
          return null;
        }
      };

      const fetchHistory = async () => {
        try {
          const { data, error } = await supabase
            .from('air_quality')
            .select('*')
            .eq('device_id', venue.deviceId)
            .order('device_time', { ascending: false })
            .limit(14);
          
          if (error) throw error;
          return (data || []).reverse();
        } catch (err) {
          console.error('Supabase history error:', err);
          return [];
        }
      };

      try {
        const [rtData, histData] = await Promise.all([fetchRealTime(), fetchHistory()]);
        setRealTime(rtData);
        setHistory(histData);
      } catch (err) {
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [venue?.id, show]);

  if (!venue) return null;

  const isIndoor = venue.type === 'indoor';
  const bgColor = isIndoor ? '#EADCF5' : '#F5EEDC';
  const panelSideClass = isIndoor ? (show ? 'panel-enter-left' : 'panel-exit-left') : (show ? 'panel-enter-right' : 'panel-exit-right');
  
  if (!hasInteracted && !show) return null;

  const skeleton = (
    <div style={{ padding: '0.5rem 0' }}>
       {[1, 2, 3, 4].map(i => (
         <div key={i} style={{ height: '48px', borderRadius: '12px', background: 'rgba(49, 46, 129, 0.05)', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
       ))}
    </div>
  );

  return (
    <div 
      className={`glass-panel panel-container ${panelSideClass}`}
      style={{ 
        position: 'absolute',
        top: '0.2rem',
        [isIndoor ? 'left' : 'right']: '1.25rem',
        width: '360px',
        background: bgColor,
        padding: '1.4rem',
        boxShadow: '0 20px 40px rgba(49, 46, 129, 0.12)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.6)',
        zIndex: 100,
        pointerEvents: 'auto'
      }}
    >
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        @media (max-width: 1024px) {
          .glass-panel.panel-container {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            margin: 0 auto !important;
            box-shadow: 0 10px 30px rgba(49, 46, 129, 0.08) !important;
            transform: none !important;
            animation: mobileFadeInUp 0.4s ease-out forwards;
          }
        }
      `}</style>
      
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#312E81' }}>{venue.name}</h2>
        <button 
          onClick={onClose}
          style={{ 
            width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(49, 46, 129, 0.1)', 
            border: 'none', color: '#312E81', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {loading ? skeleton : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <MetricOverlay 
            label="體感溫度" value={realTime?.temperature} unit="°" icon={Thermometer} 
            historyData={history} isActive={activeMetric === '體感溫度'} 
            onToggleHistory={() => setActiveMetric(prev => prev === '體感溫度' ? null : '體感溫度')} 
          />
          <MetricOverlay 
            label="濕度" value={realTime?.humidity} unit="%" icon={Droplets} 
            historyData={history} isActive={activeMetric === '濕度'} 
            onToggleHistory={() => setActiveMetric(prev => prev === '濕度' ? null : '濕度')} 
          />
          <MetricOverlay 
            label="PM2.5" value={realTime?.pm25} unit="µg/m³" icon={CloudFog} 
            historyData={history} isActive={activeMetric === 'PM2.5'} 
            onToggleHistory={() => setActiveMetric(prev => prev === 'PM2.5' ? null : 'PM2.5')} 
          />
          <MetricOverlay 
            label="PM10" value={realTime?.pm10} unit="µg/m³" icon={CloudFog} 
            historyData={history} isActive={activeMetric === 'PM10'} 
            onToggleHistory={() => setActiveMetric(prev => prev === 'PM10' ? null : 'PM10')} 
          />
        </div>
      )}
    </div>
  );
};

const SidePanels = ({ show, hasInteracted, venue, onClose }) => {
  return (
    <div className={`side-panels-wrapper ${show ? 'has-active-panels' : ''}`}>
      <style>{`
        .side-panels-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
        }
        @media (max-width: 1024px) {
          .side-panels-wrapper {
            position: relative !important;
            height: auto !important;
            width: 100% !important;
            margin-bottom: 2rem !important;
            pointer-events: auto !important;
          }
        }
      `}</style>
      <VenuePanel venue={venue} show={show} hasInteracted={hasInteracted} onClose={onClose} />
    </div>
  );
};

export default SidePanels;

import React, { useState, useEffect, useMemo } from 'react';
import { Thermometer, Droplets, CloudFog, Activity, X, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { supabase } from '../lib/supabaseClient';

const API_BASE = 'https://box-sigma-ten.vercel.app/sensor/latest';

const MetricOverlay = ({ label, value, unit, icon: Icon, historyData, onToggleHistory, isActive, isOutdoor }) => {
  const chartData = useMemo(() => {
    // Generate the last 14 hours (HH:00) ending at the current hour
    const now = new Date();
    const slots = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(d.getHours() - i, 0, 0, 0);
      slots.push({
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        rawHour: d.getHours(),
        rawDate: d.getDate(),
        value: null
      });
    }

    if (!historyData || historyData.length === 0) return slots;

    // Map existing history data to the slots
    const result = slots.map(slot => {
      const match = historyData.find(d => {
        const dDate = new Date(isOutdoor ? d.obs_time : d.device_time);
        return dDate.getHours() === slot.rawHour && dDate.getDate() === slot.rawDate;
      });

      if (match) {
        let labelKey;
        if (isOutdoor) {
          labelKey = label === '溫度' ? 'temperature' : label === '相對濕度' ? 'humidity' : 'uv_index';
        } else {
          labelKey = label === '溫度' ? 'temperature' : label === '濕度' ? 'humidity' : label === 'PM2.5' ? 'pm25' : 'pm10';
        }
        const val = match[labelKey];
        return { ...slot, value: val === -99 ? null : val };
      }
      return slot;
    });

    return result;
  }, [historyData, label, isOutdoor]);

  const yConfig = useMemo(() => {
    const isTemp = label.includes('溫度');
    const isHumid = label.includes('濕度');
    const isUV = label.includes('紫外線');

    if (isTemp) return { domain: [10, 40], ticks: [10, 15, 20, 25, 30, 35, 40] };
    if (isHumid) return { domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] };
    if (isUV) return { domain: [0, 15], ticks: [0, 3, 6, 9, 12, 15] };
    // PM2.5/PM10
    return { domain: [0, 150], ticks: [0, 30, 60, 90, 120, 150] };
  }, [label]);

  const displayValue = value === -99 ? '偵測中' : (value ?? '--');

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
              {displayValue}<span style={{ fontSize: '0.9rem', marginLeft: '2px', fontWeight: 600 }}>{value === -99 ? '' : unit}</span>
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
        height: isActive ? '180px' : '0px',
        opacity: isActive ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: isActive ? '1rem' : '0'
      }}>
        {isActive && (
          <div style={{ width: '100%', height: '180px', paddingRight: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(49, 46, 129, 0.1)" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: '#312E81', fontWeight: 600 }}
                  axisLine={{ stroke: 'rgba(49, 46, 129, 0.2)' }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  domain={yConfig.domain}
                  ticks={yConfig.ticks}
                  tick={{ fontSize: 10, fill: '#312E81', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
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
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
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
      const isIndoor = venue.type === 'indoor';

      const fetchIndoorData = async () => {
        const testId = 'ab170023';
        try {
          // Real-time (Latest record)
          const { data: rtRes, error: rtErr } = await supabase
            .from('air_quality')
            .select('*')
            .eq('device_id', testId)
            .order('device_time', { ascending: false })
            .limit(1);

          if (rtErr) throw rtErr;

          // History for last 14 hours
          const fourteenHoursAgo = new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString();
          const { data: histRes, error: histErr } = await supabase
            .from('air_quality')
            .select('*')
            .eq('device_id', testId)
            .gte('device_time', fourteenHoursAgo)
            .order('device_time', { ascending: true });

          if (histErr) throw histErr;

          // Data Dilution Logic (30 equidistant buckets over 14 hours)
          const numBuckets = 30;
          const now = Date.now();
          const startTime = now - 14 * 60 * 60 * 1000;
          const bucketWidth = (14 * 60 * 60 * 1000) / numBuckets;

          const buckets = Array.from({ length: numBuckets }, (_, i) => ({
            startTime: startTime + i * bucketWidth,
            endTime: startTime + (i + 1) * bucketWidth,
            points: []
          }));

          histRes.forEach(d => {
            const time = new Date(d.device_time).getTime();
            const bucketIndex = Math.floor((time - startTime) / bucketWidth);
            if (bucketIndex >= 0 && bucketIndex < numBuckets) {
              buckets[bucketIndex].points.push(d);
            }
          });

          const dilutedHistory = buckets.map(bucket => {
            const validPoints = bucket.points.filter(p => p.temperature !== -99 && p.humidity !== -99);
            if (validPoints.length === 0) return null;

            // Calculate averages for this bucket
            const avg = (key) => validPoints.reduce((sum, p) => sum + p[key], 0) / validPoints.length;

            return {
              device_time: new Date(bucket.startTime).toISOString(),
              temperature: avg('temperature'),
              humidity: avg('humidity'),
              pm25: avg('pm25'),
              pm10: avg('pm10')
            };
          }).filter(p => p !== null);

          return { rtData: rtRes?.[0] || null, histData: dilutedHistory };
        } catch (err) {
          console.error('Indoor Supabase fetch failed:', err);
          return { rtData: null, histData: [] };
        }
      };

      const fetchOutdoorData = async () => {
        try {
          // Latest for real-time
          const { data: rtRes, error: rtErr } = await supabase
            .from('weather_logs')
            .select('*')
            .order('obs_time', { ascending: false })
            .limit(1);

          if (rtErr) throw rtErr;

          // History for charts (limit 100 to extract hourly samples)
          const { data: histRes, error: histErr } = await supabase
            .from('weather_logs')
            .select('*')
            .order('obs_time', { ascending: false })
            .limit(100);

          if (histErr) throw histErr;

          // Hourly Sampling Logic
          const sampledHistory = [];
          if (histRes) {
            const seenHours = new Set();
            histRes.forEach(item => {
              const hourKey = item.obs_time.substring(0, 13); // '2024-04-03 14'
              if (!seenHours.has(hourKey)) {
                sampledHistory.push(item);
                seenHours.add(hourKey);
              }
            });
          }

          return {
            rtData: rtRes?.[0] || null,
            histData: sampledHistory.reverse()
          };
        } catch (err) {
          console.error('Outdoor Supabase fetch error:', err);
          return { rtData: null, histData: [] };
        }
      };

      try {
        const { rtData, histData } = isIndoor ? await fetchIndoorData() : await fetchOutdoorData();
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
      {[1, 2, 3].map(i => (
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
          {isIndoor ? (
            <>
              <MetricOverlay
                label="溫度" value={realTime?.temperature} unit="°" icon={Thermometer}
                historyData={history} isActive={activeMetric === '體感溫度'} isOutdoor={false}
                onToggleHistory={() => setActiveMetric(prev => prev === '體感溫度' ? null : '體感溫度')}
              />
              <MetricOverlay
                label="濕度" value={realTime?.humidity} unit="%" icon={Droplets}
                historyData={history} isActive={activeMetric === '濕度'} isOutdoor={false}
                onToggleHistory={() => setActiveMetric(prev => prev === '濕度' ? null : '濕度')}
              />
              <MetricOverlay
                label="PM2.5" value={realTime?.pm25} unit="µg/m³" icon={CloudFog}
                historyData={history} isActive={activeMetric === 'PM2.5'} isOutdoor={false}
                onToggleHistory={() => setActiveMetric(prev => prev === 'PM2.5' ? null : 'PM2.5')}
              />
              <MetricOverlay
                label="PM10" value={realTime?.pm10} unit="µg/m³" icon={CloudFog}
                historyData={history} isActive={activeMetric === 'PM10'} isOutdoor={false}
                onToggleHistory={() => setActiveMetric(prev => prev === 'PM10' ? null : 'PM10')}
              />
            </>
          ) : (
            <>
              <MetricOverlay
                label="溫度" value={realTime?.temperature} unit="°C" icon={Thermometer}
                historyData={history} isActive={activeMetric === '實測溫度'} isOutdoor={true}
                onToggleHistory={() => setActiveMetric(prev => prev === '實測溫度' ? null : '實測溫度')}
              />
              <MetricOverlay
                label="濕度" value={realTime?.humidity} unit="%" icon={Droplets}
                historyData={history} isActive={activeMetric === '相對濕度'} isOutdoor={true}
                onToggleHistory={() => setActiveMetric(prev => prev === '相對濕度' ? null : '相對濕度')}
              />
              <MetricOverlay
                label="紫外線指數" value={realTime?.uv_index} unit="" icon={Sun}
                historyData={history} isActive={activeMetric === '紫外線指數'} isOutdoor={true}
                onToggleHistory={() => setActiveMetric(prev => prev === '紫外線指數' ? null : '紫外線指數')}
              />
            </>
          )}
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

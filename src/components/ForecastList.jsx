import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ForecastList = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        
        console.log('Fetching weather for date:', todayDate);

        const { data, error } = await supabase
          .from('weather_logs')
          .select('*')
          .ilike('obs_time', `${todayDate}%`)
          .order('obs_time', { ascending: true });

        if (error) throw error;
        
        // Deduplicate: Keep only the first record for each unique hour
        const hourlyMap = new Map();
        (data || []).forEach(record => {
          // Extract hour from obs_time (e.g., "2026-04-03 06:15:00" -> "06")
          // Assuming the format is strictly YYYY-MM-DD HH:mm:ss or similar
          try {
            const timePart = record.obs_time.split(' ')[1]; // "06:15:00"
            const hour = timePart.split(':')[0]; // "06"
            
            if (!hourlyMap.has(hour)) {
              hourlyMap.set(hour, record);
            }
          } catch (e) {
            // Fallback for different formats
            const hour = record.obs_time.substring(11, 13);
            if (hour && !hourlyMap.has(hour)) {
              hourlyMap.set(hour, record);
            }
          }
        });

        const hourlyData = Array.from(hourlyMap.values());
        setWeatherData(hourlyData);

      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    // Assuming obs_time is a string like "2026-04-03 11:00:00" or similar
    try {
      const date = new Date(timeStr.replace(' ', 'T')); // Convert to ISO-like if needed
      if (isNaN(date.getTime())) {
        // Fallback: if it's just "HH:mm:ss"
        return timeStr.split(':').slice(0, 2).join(':');
      }
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) {
      return timeStr.substring(0, 5);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-primary-dark)' }}>
        <p style={{ fontWeight: 600 }}>資料加載中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <p style={{ fontWeight: 600 }}>資料讀取錯誤: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 1rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 800, color: 'var(--color-primary-dark)' }}>24小時天氣預報</h2>
        
        <div style={{ display: 'flex', background: 'white', borderRadius: '20px', padding: '4px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '0.4rem 1rem', background: 'var(--color-primary-dark)', color: 'white', borderRadius: '16px', fontSize: 'var(--fs-tiny)', fontWeight: 700, cursor: 'pointer' }}>HOURLY</div>
          <div style={{ padding: '0.4rem 1rem', color: 'var(--color-text-muted)', fontSize: 'var(--fs-tiny)', fontWeight: 700, cursor: 'pointer' }}>DAILY</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.5rem', WebkitOverflowScrolling: 'touch', minHeight: '280px' }}>
        {weatherData.map((item, i) => {
          return (
            <div 
              key={item.id || i} 
              className="glass-panel text-white"
              style={{ 
                background: 'var(--color-primary)',
                minWidth: '150px', 
                padding: '1.8rem 1.2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.8rem',
                border: '1px solid rgba(229, 211, 168, 0.4)',
                position: 'relative',
                cursor: 'default',
                boxShadow: '0 12px 24px rgba(45, 27, 77, 0.15)',
                transition: 'transform 0.3s ease',
                borderRadius: '24px'
              }}>
              
              {/* Time */}
              <div style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.2rem' }}>
                {formatTime(item.obs_time)}
              </div>
              
              {/* UV Index */}
              <div style={{ 
                fontSize: 'var(--fs-tiny)', 
                fontWeight: 800, 
                color: 'var(--color-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                background: 'rgba(229, 211, 168, 0.15)',
                padding: '0.3rem 0.6rem',
                borderRadius: '12px'
              }}>
                <Sun size={14} fill="var(--color-secondary)" /> UV {item.uv_index?.toFixed(1) || '0.0'}
              </div>

              {/* Temperature */}
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', margin: '0.5rem 0' }}>
                {Math.round(item.temperature || 0)}°
              </div>
              
              {/* Humidity */}
              <div style={{ 
                fontSize: 'var(--fs-small)', 
                fontWeight: 600, 
                color: 'rgba(255,255,255,0.7)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem' 
              }}>
                <Droplets size={16} color="var(--color-secondary)" /> {item.humidity || 0}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;

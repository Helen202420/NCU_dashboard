import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, Droplets, Umbrella } from 'lucide-react';

const ForecastList = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping based on Chinese weather status
  const getWeatherIcon = (status) => {
    if (!status) return Cloud;
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('雷雨') || statusLower.includes('陣雨')) {
      // Prefer CloudLightning if "雷雨", else CloudRain for "陣雨"
      return statusLower.includes('雷雨') ? CloudLightning : CloudRain;
    }
    if (statusLower.includes('陰')) return Cloud;
    if (statusLower.includes('晴')) return Sun;
    if (statusLower.includes('短暫陣雨')) return CloudDrizzle;
    
    return Cloud; // Default fallback
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Try multiple API endpoints (with fallback)
        const apiUrls = [
          'https://ncu-niag-weather-detect.vercel.app/api/forecast-hourly',
          '/api/forecast-hourly' // Fallback to relative path if backend proxy exists
        ];
        
        let lastError = null;
        let data = null;

        for (const apiUrl of apiUrls) {
          try {
            console.log(`Fetching from: ${apiUrl}`);
            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              mode: 'cors'
            });
            
            if (!response.ok) {
              lastError = `HTTP ${response.status}`;
              continue;
            }
            
            data = await response.json();
            console.log('Successfully fetched weather data:', data);
            break;
          } catch (e) {
            lastError = e.message;
            console.warn(`Failed to fetch from ${apiUrl}:`, e);
            // Try next URL
          }
        }

        if (!data) {
          throw new Error(`Failed to fetch from any endpoint. Last error: ${lastError}`);
        }
        
        // Parse API data: convert string values to appropriate types
        const parsedData = (data || []).map(item => ({
          ...item,
          temp: parseInt(item.temp, 10) || 0,
          humidity: parseInt(item.humidity, 10) || 0,
          pop: parseInt(item.pop, 10) || 0,
          time: item.time || '--:--'
        }));
        
        setWeatherData(parsedData);

      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err.message || 'Failed to load forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

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
        <h2 className="forecast-title" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>24小時天氣預報</h2>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.5rem', WebkitOverflowScrolling: 'touch', minHeight: '360px' }}>
        {weatherData.map((item, i) => {
          const WeatherIcon = getWeatherIcon(item.status);
          return (
            <div 
              key={i} 
              className="glass-panel text-white"
              style={{ 
                background: 'var(--color-primary)',
                minWidth: '200px', 
                minHeight: '320px',
                padding: '1.8rem 1.4rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                border: '1px solid rgba(229, 211, 168, 0.4)',
                position: 'relative',
                cursor: 'default',
                boxShadow: '0 12px 24px rgba(45, 27, 77, 0.15)',
                transition: 'transform 0.3s ease',
                borderRadius: '24px'
              }}>
              
              {/* ===== LAYER 1: Time (Top) ===== */}
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: 300, 
                color: 'rgba(200, 180, 220, 0.9)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                {item.time}
              </div>
              
              {/* ===== LAYER 2: Weather Core (Icon + Status) ===== */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.6rem',
                padding: '0.8rem 0'
              }}>
                {/* Weather Icon */}
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WeatherIcon size={40} color="var(--color-secondary)" strokeWidth={1.5} />
                </div>
                
                {/* Status Text */}
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {item.status || 'N/A'}
                </div>
              </div>

              {/* ===== LAYER 3: Main Data (Temperature + Rain Probability) ===== */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem 0'
              }}>
                {/* Temperature - Very Large & Bold */}
                <div style={{ 
                  fontSize: '2.8rem', 
                  fontWeight: 800, 
                  color: 'rgba(255, 255, 255, 1)',
                  lineHeight: '1'
                }}>
                  {item.temp}°
                </div>

                {/* Rain Probability - Bright Blue */}
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: '#60A5FA',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px'
                }}>
                  <Umbrella size={18} color="#60A5FA" strokeWidth={2} />
                  {item.pop}%
                </div>
              </div>

              {/* ===== LAYER 4: Environment Details (Bottom) ===== */}
              <div style={{ 
                fontSize: '0.8rem', 
                fontWeight: 400, 
                color: 'rgba(200, 180, 220, 0.8)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                marginTop: '0.5rem'
              }}>
                <Droplets size={14} color="rgba(200, 180, 220, 0.8)" strokeWidth={2} />
                RH {item.humidity}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;

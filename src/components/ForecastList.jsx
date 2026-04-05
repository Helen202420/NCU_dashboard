import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, Droplets, Umbrella } from 'lucide-react';

const ForecastList = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentHour, setCurrentHour] = useState(null);

  // 根據 status 關鍵字映射對應的天氣圖示
  const getWeatherIcon = (status) => {
    if (!status) return Cloud;
    
    const statusStr = status.toLowerCase();
    
    // 雷雨或陣雨 → CloudLightning
    if (statusStr.includes('雷雨')) {
      return CloudLightning;
    }
    // 陣雨 → CloudRain
    if (statusStr.includes('陣雨') && !statusStr.includes('短暫')) {
      return CloudRain;
    }
    // 短暫陣雨 → CloudDrizzle
    if (statusStr.includes('短暫陣雨')) {
      return CloudDrizzle;
    }
    // 陰 → Cloud
    if (statusStr.includes('陰')) {
      return Cloud;
    }
    // 晴 → Sun
    if (statusStr.includes('晴')) {
      return Sun;
    }
    
    return Cloud; // 預設
  };

  useEffect(() => {
    // 設置當前小時
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    setCurrentHour(hour);
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching weather from API...');
        
        const response = await fetch('https://ncu-niag-weather-detect.vercel.app/api/forecast-hourly');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('API data received:', data);
        
        // 確保資料是陣列，並進行必要的資料處理
        const parsedData = (Array.isArray(data) ? data : []).map(item => ({
          time: item.time || '--:--',
          temp: parseInt(item.temp, 10) || 0,
          humidity: parseInt(item.humidity, 10) || 0,
          status: item.status || 'N/A',
          pop: parseInt(item.pop, 10) || 0
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
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>24小時天氣預報</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1.5rem', WebkitOverflowScrolling: 'touch', minHeight: '360px' }}>
        {weatherData.map((item, i) => {
          const WeatherIcon = getWeatherIcon(item.status);
          const isCurrentHour = item.time.startsWith(currentHour);
          
          return (
            <div 
              key={i} 
              className={isCurrentHour ? 'glass-panel forecast-card-current' : 'glass-panel'}
              style={{ 
                background: 'var(--color-primary)',
                minWidth: '200px', 
                minHeight: '320px',
                padding: '1.8rem 1.4rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                border: isCurrentHour ? '2px solid #FFD700' : '1px solid rgba(229, 211, 168, 0.4)',
                position: 'relative',
                cursor: 'default',
                boxShadow: isCurrentHour ? '0 6px 20px rgba(255, 215, 0, 0.15), 0 12px 24px rgba(45, 27, 77, 0.15)' : '0 12px 24px rgba(45, 27, 77, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                borderRadius: '24px',
                transform: isCurrentHour ? 'scale(1.03)' : 'scale(1)',
              }}>
              
              {isCurrentHour && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                  borderRadius: '24px 24px 0 0'
                }} />
              )}
              
              {/* ===== LAYER 1: 時間層 (上方) ===== */}
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: 300, 
                color: isCurrentHour ? '#FFD700' : 'rgba(200, 180, 220, 0.9)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease'
              }}>
                {isCurrentHour ? '🔴 ' : ''}{item.time}
              </div>
              
              {/* ===== LAYER 2: 天氣核心層 (圖示 + 狀態文字) ===== */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '0.6rem',
                padding: '0.8rem 0'
              }}>
                {/* 天氣圖示 */}
                <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WeatherIcon size={40} color="var(--color-secondary)" strokeWidth={1.5} />
                </div>
                
                {/* 狀態文字 */}
                <div style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: 'rgba(255, 255, 255, 0.95)',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {item.status}
                </div>
              </div>

              {/* ===== LAYER 3: 主數據層 (溫度 + 降雨機率) ===== */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                padding: '1rem 0'
              }}>
                {/* 溫度 - 特大字體 */}
                <div style={{ 
                  fontSize: '2.8rem', 
                  fontWeight: 800, 
                  color: 'rgba(255, 255, 255, 1)',
                  lineHeight: '1',
                  letterSpacing: '-0.05em'
                }}>
                  {item.temp}°
                </div>

                {/* 降雨機率 - 亮藍色 */}
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: '#60A5FA',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}>
                  <Umbrella size={18} color="#60A5FA" strokeWidth={2} />
                  {item.pop}%
                </div>
              </div>

              {/* ===== LAYER 4: 環境細節層 (底部) ===== */}
              <div style={{ 
                fontSize: '0.8rem', 
                fontWeight: 400, 
                color: 'rgba(200, 180, 220, 0.8)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                paddingTop: '0.8rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
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

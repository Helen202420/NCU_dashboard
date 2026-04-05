import React, { useState, useEffect, useRef } from 'react';
import { Satellite } from 'lucide-react';

const SatelliteTrack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerHeight, setContainerHeight] = useState('400px');
  const containerRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const preloadTimeoutRef = useRef(null);

  const BASE_URL = 'https://ruqkseyidudveptggnfg.supabase.co/storage/v1/object/public/satellite-images/';

  // Fetch and prepare animation data
  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🛰️ Fetching satellite animation data...');

        const response = await fetch('https://cloud-image.vercel.app/get-latest-satellite');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        console.log('Satellite API response:', data);

        if (data.data_list && Array.isArray(data.data_list) && data.data_list.length > 0) {
          // Sort by obs_time (oldest to newest)
          const sortedData = [...data.data_list].sort((a, b) => {
            return new Date(a.obs_time) - new Date(b.obs_time);
          });

          // Construct full URLs
          const imagesList = sortedData.map(item => ({
            url: BASE_URL + item.image_url,
            time: item.obs_time
          }));

          console.log(`📊 Loaded ${imagesList.length} satellite images for animation`);

          setImagesData(imagesList);
          setCurrentIndex(0);
          setLoading(false); // ← 關鍵：設置載入完成

          // Start preloading images (background)
          preloadImages(imagesList);
        } else {
          throw new Error('No animation data available');
        }
      } catch (err) {
        console.error('Error fetching satellite data:', err);
        setError(err.message || 'Failed to load satellite animation data');
        setLoading(false);
      }
    };

    fetchSatelliteData();

    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  // Preload all images
  const preloadImages = (imagesList) => {
    imagesList.forEach((item) => {
      const img = new Image();
      img.src = item.url;
    });
  };

  // Animation playback
  useEffect(() => {
    if (imagesData.length > 0 && !loading && !error) {
      console.log('▶️ Starting satellite animation');

      // 設定 transition 時間並循環播放
      animationIntervalRef.current = setInterval(() => {
        setCurrentIndex(prevIdx => (prevIdx + 1) % imagesData.length);
      }, 900); // 間隔時間（淡入淡出 + 顯示）

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [imagesData, loading, error]);

  const handleImageLoad = (e) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // 扣除 padding (2rem = 32px)
      const imgWidth = e.target.naturalWidth;
      const imgHeight = e.target.naturalHeight;
      
      if (imgWidth > 0 && imgHeight > 0) {
        const calculatedHeight = (containerWidth * imgHeight) / imgWidth + 100; // 加上標題、狀態文字的高度
        setContainerHeight(`${calculatedHeight}px`);
        console.log(`🛰️ Satellite image loaded: ${imgWidth}x${imgHeight}, calculated height: ${calculatedHeight}px`);
      }
    }
  };

  const currentImage = imagesData[currentIndex];

  return (
    <div ref={containerRef} style={{
      backgroundColor: '#2D1B4D',
      padding: '2rem',
      height: containerHeight,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(45, 27, 77, 0.15)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Satellite size={24} color="#E5D3A8" strokeWidth={2} />
          <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: '#E5D3A8', marginBottom: 0 }}>衛星雲圖</h2>
        </div>
        
        <div style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, color: '#CBD5E1', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {loading && <span>載入中...</span>}
          {error && <span style={{ color: '#FCA5A5' }}>暫時無法取得圖像</span>}
        </div>
      </div>

      <div style={{ flex: 1, marginTop: '1.2rem', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* 底層圖片（前一幀，淡出） */}
        {imagesData.length > 0 && (
          <img
            src={imagesData[(currentIndex - 1 + imagesData.length) % imagesData.length].url}
            alt="Previous Satellite"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
              padding: '1rem',
              borderRadius: '12px',
              opacity: 0,
              transition: 'opacity 0.4s ease-out',
              zIndex: 1
            }}
          />
        )}
        
        {/* 頂層圖片（當前幀，淡入） */}
        {currentImage && (
          <img
            src={currentImage.url}
            alt="Satellite Cloud"
            onLoad={handleImageLoad}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
              padding: '1rem',
              borderRadius: '12px',
              opacity: 1,
              transition: 'opacity 0.4s ease-in',
              zIndex: 2
            }}
          />
        )}

        {!currentImage && !loading && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(45, 27, 77, 0.5)',
            borderRadius: '12px',
            minHeight: '200px'
          }}>
            <p style={{ color: '#CBD5E1' }}>無法載入圖像</p>
          </div>
        )}

        {loading && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(45, 27, 77, 0.5)',
            borderRadius: '12px',
            minHeight: '200px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(229, 211, 168, 0.3)',
              borderTop: '3px solid #E5D3A8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteTrack;

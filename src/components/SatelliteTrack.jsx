import React, { useState, useEffect } from 'react';
import { Satellite } from 'lucide-react';

const SatelliteTrack = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerHeight, setContainerHeight] = useState('400px');
  const containerRef = React.useRef(null);

  const BASE_URL = 'https://ruqkseyidudveptggnfg.supabase.co/storage/v1/object/public/satellite-images/';

  useEffect(() => {
    const fetchSatelliteImage = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🛰️ Fetching satellite image...');

        const response = await fetch('https://cloud-image.vercel.app/get-latest-satellite');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        console.log('Satellite API response:', data);

        if (data.latest_data && data.latest_data.image_url) {
          const imagePath = data.latest_data.image_url;
          const fullImageUrl = BASE_URL + imagePath;

          console.log('Full satellite image URL:', fullImageUrl);

          setImageUrl(fullImageUrl);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching satellite image:', err);
        setError(err.message || 'Failed to load satellite image');
      } finally {
        setLoading(false);
      }
    };

    fetchSatelliteImage();
  }, []);

  const handleImageLoad = (e) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // 扣除 padding (2rem = 32px)
      const imgWidth = e.target.naturalWidth;
      const imgHeight = e.target.naturalHeight;
      
      if (imgWidth > 0 && imgHeight > 0) {
        const calculatedHeight = (containerWidth * imgHeight) / imgWidth + 64; // 加上標題、狀態文字的高度
        setContainerHeight(`${calculatedHeight}px`);
        console.log(`🛠️ Satellite image loaded: ${imgWidth}x${imgHeight}, calculated height: ${calculatedHeight}px`);
      }
    }
  };

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
        
        {loading && <p style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, color: '#CBD5E1', marginTop: '0.4rem' }}>載入中...</p>}
        {error && <p style={{ fontSize: 'var(--fs-tiny)', fontWeight: 600, color: '#FCA5A5', marginTop: '0.4rem' }}>暫時無法取得圖像</p>}
      </div>

      <div style={{ flex: 1, marginTop: '1.2rem', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Satellite Cloud"
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: 'calc(100vh - 200px)',
              objectFit: 'contain',
              padding: '1rem',
              borderRadius: '12px'
            }}
          />
        )}

        {!imageUrl && !loading && (
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

import React from 'react';

const Marquee = () => {
  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '0.5rem 0' /* To accommodate the glowing box shadows top/bottom without clipping */
    }}>
      <style>
        {`
          @keyframes scroll-rtl {
            /* 從畫面最右側外面開始，移動到畫面最左側外面 (改用 vw 支援滿版對齊) */
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .marquee-track {
            display: inline-flex;
            gap: 4rem; /* 兩個框框之間的距離 */
            animation: scroll-rtl 25s linear infinite; /* Adjusted speed for 3 items */
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          .message-box {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            border: 2px solid var(--color-secondary); /* 金色邊框 */
            border-radius: 999px; /* 每個獨立的圓角框 */
            padding: 0.6rem 2rem;
            color: var(--color-primary-dark);
            font-weight: 800;
            font-size: var(--fs-h3);

            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(8px);
            WebkitBackdrop-filter: blur(8px);
            box-shadow: var(--shadow-sm);
          }
        `}
      </style>
      <div className="marquee-track">
        <div className="message-box">
          <span style={{ fontSize: 'var(--fs-h2)' }}>🏃</span>

          運動前中後，補水不可少
        </div>
        <div className="message-box">
          <span style={{ fontSize: 'var(--fs-h2)' }}>🏃</span>

          注意天氣變化，安全第一
        </div>
        <div className="message-box">
          <span style={{ fontSize: 'var(--fs-h2)' }}>🏃</span>

          熱身做足，運動更安全
        </div>
      </div>
    </div>
  );
};

export default Marquee;

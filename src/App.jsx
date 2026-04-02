import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InteractiveMap from './components/InteractiveMap';
import SidePanels from './components/SidePanels';
import AtmosphereSection from './components/AtmosphereSection';
import SatelliteTrack from './components/SatelliteTrack';
import ForecastList from './components/ForecastList';
import Marquee from './components/Marquee';
import './App.css';

const App = () => {
  // Use user's preference for initial state: hidden before first click
  const [showPanels, setShowPanels] = useState(false);
  // Track if interaction has happened so we don't play animation on mount
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto hide panels after some time for an interactive feel, or just keep them togglable
  // We'll keep them togglable
  const togglePanels = () => {
    setShowPanels(prev => !prev);
    setHasInteracted(true);
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-main">
        {/* Top Section: Map with pop-out panels */}
        <div className="map-and-panels-container">
          <SidePanels show={showPanels} hasInteracted={hasInteracted} />
          
          <div className="center-map-wrapper">
             <InteractiveMap onToggle={togglePanels} isActive={showPanels} />
          </div>
        </div>

        {/* Marquee Banner */}
        <div style={{ width: '100%', marginTop: '-1.5rem', marginBottom: '1.5rem', zIndex: 10 }}>
           <Marquee />
        </div>

        {/* Middle Section: Atmosphere and Satellite */}
        <div className="middle-section">
          <AtmosphereSection />
          <SatelliteTrack />
        </div>

        {/* Bottom Section: 24-hr layout */}
        <section className="bottom-section" style={{marginTop: '3rem', width: '100%'}}>
          <ForecastList />
        </section>
      </main>
    </div>
  );
};

export default App;

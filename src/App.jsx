import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InteractiveMap from './components/InteractiveMap';
import SidePanels from './components/SidePanels';
import AtmosphereSection from './components/AtmosphereSection';
import SatelliteTrack from './components/SatelliteTrack';
import ForecastList from './components/ForecastList';
import Marquee from './components/Marquee';
import './App.css';

const App = () => {
  const [showPanels, setShowPanels] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const panelRef = useRef(null);
  const mapRef = useRef(null);

  const handleSelectVenue = (venue) => {
    // If clicking the same venue that is already open, toggle it off
    if (showPanels && selectedVenue?.id === venue.id) {
      setShowPanels(false);
    } else {
      setSelectedVenue(venue);
      setShowPanels(true);
    }
    setHasInteracted(true);
  };

  // Global click-outside handler to close panels
  useEffect(() => {
    if (!showPanels) return;

    const handleClickOutside = (e) => {
      // Don't close if clicking on the panel itself
      if (panelRef.current && panelRef.current.contains(e.target)) {
        return;
      }
      // Don't close if clicking on the map
      if (mapRef.current && mapRef.current.contains(e.target)) {
        return;
      }
      // Close the panel for any other click
      setShowPanels(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPanels]);

  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="dashboard-main">
        {/* Top Section: Map with pop-out panels */}
        <div className="map-and-panels-container">
          {/* Scoped backdrop: closes panel when clicking empty map area */}
          {showPanels && (
            <div
              style={{
                position: 'absolute', inset: 0,
                zIndex: 6, cursor: 'default'
              }}
              onClick={() => setShowPanels(false)}
            />
          )}
          <div ref={panelRef}>
            <SidePanels 
              show={showPanels} 
              hasInteracted={hasInteracted} 
              venue={selectedVenue} 
              onClose={() => setShowPanels(false)}
            />
          </div>
          
          <div className="center-map-wrapper" ref={mapRef}>
             <InteractiveMap onSelectVenue={handleSelectVenue} isActive={showPanels} />
          </div>
        </div>


        {/* Marquee Banner */}
        <div style={{ width: '100%', marginTop: '1.5rem', marginBottom: '1.5rem', zIndex: 10 }}>
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

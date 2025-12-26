import React, { useState } from 'react';
import './App.css';
import { MapView } from './components/MapView';
import { sampleWebcams } from './data/sampleWebcams';
import { WebcamLocation } from './types/webcam';

function App() {
  const [view, setView] = useState<'home' | 'map'>('home');
  const [selectedWebcam, setSelectedWebcam] = useState<WebcamLocation | null>(null);

  return (
    <div className="app">
      {view === 'home' ? (
        <div className="home-container">
          <header className="header">
            <h1 className="title">🌍 PeekPlanet</h1>
            <p className="subtitle">Peek at the planet before you go</p>
          </header>

          <main className="main-content">
            <div className="hero-section">
              <h2 className="hero-title">Discover Live Webcams Worldwide 🚀</h2>
              <p className="hero-description">
                Explore tourist destinations in real-time before you travel. 
                Watch live streams from beaches, cities, landmarks, and natural wonders around the globe.
              </p>
              <button 
                className="cta-button"
                onClick={() => setView('map')}
              >
                Explore Map →
              </button>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3 className="feature-title">Interactive Map</h3>
                <p className="feature-description">
                  Browse webcams on an interactive world map. Click markers to view live streams.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏖️</div>
                <h3 className="feature-title">Filter Categories</h3>
                <p className="feature-description">
                  Beaches, cities, nature, landmarks, mountains, and more tourist spots.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔴</div>
                <h3 className="feature-title">Live Streams</h3>
                <p className="feature-description">
                  Watch destinations in real-time. Plan your trip with live weather and crowd info.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Smart Search</h3>
                <p className="feature-description">
                  Find webcams by location name, city, country, or category instantly.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">Mobile Ready</h3>
                <p className="feature-description">
                  Perfect experience on desktop, tablet, and mobile devices.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🧭</div>
                <h3 className="feature-title">Get Directions</h3>
                <p className="feature-description">
                  Navigate directly to any webcam location with Google Maps integration.
                </p>
              </div>
            </div>
          </main>

          <footer className="footer">
            <p>Made with ❤️ for travelers</p>
            <p className="footer-subtitle">
              Open source project • <a href="https://github.com/peekplanet/peekplanet" target="_blank" rel="noopener noreferrer">GitHub</a>
            </p>
          </footer>
        </div>
      ) : (
        <MapView 
          webcams={sampleWebcams}
          onWebcamSelect={(webcam) => {
            setSelectedWebcam(webcam);
            // Could open a modal or detail page here
            console.log('Selected webcam:', webcam);
          }}
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}

export default App;

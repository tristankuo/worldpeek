import { useState, useEffect } from 'react';
import './App.css';
import { MapView } from './components/MapView';
import { WEBCAMS } from './data/webcams';
import { WebcamLocation } from './types/webcam';

function App() {
  const [selectedWebcam, setSelectedWebcam] = useState<WebcamLocation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {
      console.warn('LocalStorage access denied:', e);
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Clear crash retry flag on successful load
    sessionStorage.removeItem('app_crashed_retry');
  }, []);

  useEffect(() => {
    if (!selectedWebcam) {
      setIsExpanded(false);
    }
  }, [selectedWebcam]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage access denied:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <MapView 
        webcams={WEBCAMS}
        onWebcamSelect={(webcam) => {
          setSelectedWebcam(webcam);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      {selectedWebcam && (
        <div className="video-modal-overlay" onClick={() => setSelectedWebcam(null)}>
          <div className={`video-modal-content ${isExpanded ? 'expanded' : ''}`} onClick={e => e.stopPropagation()}>
            <button 
              className="resize-modal" 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Zoom Out" : "Zoom In"}
            >
              {isExpanded ? '➖' : '➕'}
            </button>
            <button className="close-modal" onClick={() => setSelectedWebcam(null)}>×</button>
            <h3>{selectedWebcam.name}</h3>
            <div className="video-container">
              <iframe 
                src={selectedWebcam.streamUrl} 
                title={selectedWebcam.name}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <p className="modal-location">📍 {selectedWebcam.city}, {selectedWebcam.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

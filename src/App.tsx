import { useState, useEffect } from 'react';
import './App.css';
import { MapView } from './components/MapView';
import { WEBCAMS } from './data/webcams';
import { WebcamLocation } from './types/webcam';

function App() {
  const [selectedWebcam, setSelectedWebcam] = useState<WebcamLocation | null>(null);
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
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedWebcam(null)}>×</button>
            <h3>{selectedWebcam.name}</h3>
            <div className="video-container">
              {selectedWebcam.streamUrl.includes('youtube.com/embed') ? (
                <iframe 
                  src={selectedWebcam.streamUrl} 
                  title={selectedWebcam.name}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="external-stream-placeholder" style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${selectedWebcam.thumbnailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>
                  <div style={{
                    background: 'rgba(0,0,0,0.7)',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <p style={{ marginBottom: '15px', fontSize: '1.1em' }}>
                      This stream is hosted on {selectedWebcam.provider || 'an external site'}
                    </p>
                    <a 
                      href={selectedWebcam.streamUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="watch-external-btn"
                      style={{
                        display: 'inline-block',
                        background: '#ff0000',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '24px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1em',
                        transition: 'transform 0.2s'
                      }}
                    >
                      Watch Live ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
            <p className="modal-location">📍 {selectedWebcam.city}, {selectedWebcam.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

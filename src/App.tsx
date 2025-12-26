import React, { useState } from 'react';
import './App.css';
import { MapView } from './components/MapView';
import { sampleWebcams } from './data/sampleWebcams';
import { WebcamLocation } from './types/webcam';

function App() {
  const [selectedWebcam, setSelectedWebcam] = useState<WebcamLocation | null>(null);

  return (
    <div className="app">
      <MapView 
        webcams={sampleWebcams}
        onWebcamSelect={(webcam) => {
          setSelectedWebcam(webcam);
        }}
      />
      
      {selectedWebcam && (
        <div className="video-modal-overlay" onClick={() => setSelectedWebcam(null)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
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

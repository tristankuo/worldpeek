import React, { useEffect, useRef, useState } from 'react';
import { WebcamLocation } from '../types/webcam';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';
import './MapView.css';

interface MapViewProps {
  webcams: WebcamLocation[];
  onWebcamSelect?: (webcam: WebcamLocation) => void;
  onBack?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ webcams, onWebcamSelect, onBack }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedWebcam, setSelectedWebcam] = useState<WebcamLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      setError('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      setIsLoading(false);
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (mapRef.current) {
          initializeMap();
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (googleMapRef.current && !isLoading) {
      addWebcamMarkers();
    }
  }, [webcams, isLoading]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 3,
      center: { lat: 20, lng: 0 },
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      beach: '🏖️',
      city: '🏙️',
      nature: '🏞️',
      landmark: '🗼',
      mountain: '⛰️',
      other: '📹'
    };
    return icons[category] || '📹';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      beach: '#4FC3F7',
      city: '#FF6B6B',
      nature: '#4CAF50',
      landmark: '#FFA726',
      mountain: '#9575CD',
      other: '#78909C'
    };
    return colors[category] || '#78909C';
  };

  const createMarkerIcon = (webcam: WebcamLocation): string => {
    const icon = getCategoryIcon(webcam.category);
    const color = getCategoryColor(webcam.category);
    
    return `data:image/svg+xml;utf-8,${encodeURIComponent(`
      <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="20" fill="${webcam.isLive ? color : '#666'}" 
                stroke="white" stroke-width="3"/>
        <text x="25" y="33" text-anchor="middle" font-size="20">
          ${icon}
        </text>
        ${webcam.isLive ? `<circle cx="40" cy="10" r="5" fill="#ff0000"/>` : ''}
      </svg>
    `)}`;
  };

  const createInfoWindowContent = (webcam: WebcamLocation): string => {
    return `
      <div style="max-width: 300px; padding: 10px;">
        <div style="position: relative;">
          <img 
            src="${webcam.thumbnailUrl}" 
            alt="${webcam.name}"
            style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;"
            onerror="this.src='https://via.placeholder.com/300x150?text=Webcam'"
          />
          ${webcam.isLive ? `
            <div style="position: absolute; top: 10px; right: 10px; 
                        background: #ff0000; color: white; padding: 4px 8px; 
                        border-radius: 4px; font-size: 12px; font-weight: bold;">
              🔴 LIVE
            </div>
          ` : ''}
        </div>
        
        <h3 style="margin: 12px 0 8px 0; font-size: 16px; color: #202124;">
          ${webcam.name}
        </h3>
        
        <p style="margin: 0; color: #666; font-size: 14px;">
          📍 ${webcam.city}, ${webcam.country}
        </p>
        
        ${webcam.description ? `
          <p style="margin: 8px 0; color: #666; font-size: 13px;">
            ${webcam.description}
          </p>
        ` : ''}
        
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button 
            onclick="window.viewWebcam('${webcam.id}')"
            style="flex: 1; padding: 8px 16px; background: #667eea; 
                   color: white; border: none; border-radius: 4px; 
                   cursor: pointer; font-size: 14px; font-weight: 500;">
            Watch Live
          </button>
          <button 
            onclick="window.getDirections(${webcam.coordinates.lat}, ${webcam.coordinates.lng})"
            style="padding: 8px 12px; background: #34a853; color: white; 
                   border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            🗺️
          </button>
        </div>
      </div>
    `;
  };

  const addWebcamMarkers = () => {
    if (!googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const map = googleMapRef.current;
    const bounds = new google.maps.LatLngBounds();

    webcams.forEach(webcam => {
      const marker = new google.maps.Marker({
        position: webcam.coordinates,
        map: map,
        title: webcam.name,
        icon: {
          url: createMarkerIcon(webcam),
          scaledSize: new google.maps.Size(50, 50),
          anchor: new google.maps.Point(25, 25)
        },
        animation: webcam.isLive ? google.maps.Animation.DROP : undefined
      });

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(webcam)
      });

      marker.addListener('click', () => {
        // Close other info windows
        markersRef.current.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });

        infoWindow.open(map, marker);
        setSelectedWebcam(webcam);
        
        map.panTo(webcam.coordinates);
        if (map.getZoom()! < 12) {
          map.setZoom(12);
        }
      });

      (marker as any).infoWindow = infoWindow;
      markersRef.current.push(marker);
      bounds.extend(webcam.coordinates);
    });

    if (webcams.length > 0) {
      map.fitBounds(bounds);
    }
  };

  // Setup global functions for info window buttons
  useEffect(() => {
    window.viewWebcam = (id: string) => {
      const webcam = webcams.find(w => w.id === id);
      if (webcam) {
        if (onWebcamSelect) {
          onWebcamSelect(webcam);
        } else {
          window.open(webcam.streamUrl, '_blank');
        }
      }
    };

    window.getDirections = (lat: number, lng: number) => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return () => {
      delete window.viewWebcam;
      delete window.getDirections;
    };
  }, [webcams, onWebcamSelect]);

  if (isLoading) {
    return (
      <div className="map-view">
        <div className="map-header">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Home
            </button>
          )}
          <h2>🗺️ World Map</h2>
        </div>
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-view">
        <div className="map-header">
          {onBack && (
            <button className="back-button" onClick={onBack}>
              ← Back to Home
            </button>
          )}
          <h2>🗺️ World Map</h2>
        </div>
        <div className="map-error">
          <p>⚠️ {error}</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            To use Google Maps, add your API key to the .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view">
      <div className="map-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back to Home
          </button>
        )}
        <h2>🗺️ Explore Webcams ({webcams.length})</h2>
        
        {selectedWebcam && (
          <div className="selected-webcam-info">
            <span>{selectedWebcam.name}</span>
            {selectedWebcam.isLive && <span className="live-badge">🔴 LIVE</span>}
          </div>
        )}
      </div>
      
      <div ref={mapRef} className="map-container" />
      
      <div className="map-legend">
        <div className="legend-item">🏖️ Beach</div>
        <div className="legend-item">🏙️ City</div>
        <div className="legend-item">🗼 Landmark</div>
        <div className="legend-item">🏞️ Nature</div>
        <div className="legend-item">⛰️ Mountain</div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { WebcamLocation } from '../types/webcam';
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';
import { darkMapStyle, lightMapStyle } from '../utils/mapStyles';
import './MapView.css';

interface MapViewProps {
  webcams: WebcamLocation[];
  onWebcamSelect?: (webcam: WebcamLocation) => void;
  onBack?: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ webcams, onWebcamSelect, onBack, theme, toggleTheme }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WebcamLocation[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const REGIONS = [
    { id: 'Global', icon: '🌍', label: 'Global' },
    { id: 'US', icon: '🇺🇸', label: 'US & Canada' },
    { id: 'EU', icon: '🇪🇺', label: 'Europe' },
    { id: 'JP', icon: '🇯🇵', label: 'Japan' },
    { id: 'KR', icon: '🇰🇷', label: 'Korea' },
    { id: 'TW', icon: '🇹🇼', label: 'Taiwan' },
    { id: 'SG', icon: '🇸🇬', label: 'Singapore' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = webcams.filter(w => 
        w.name.toLowerCase().includes(query) || 
        w.city.toLowerCase().includes(query) || 
        w.country.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, webcams]);

  const handleSearchSelect = (webcam: WebcamLocation) => {
    setSearchQuery('');
    setShowSearchResults(false);
    
    if (googleMapRef.current) {
      googleMapRef.current.panTo(webcam.coordinates);
      googleMapRef.current.setZoom(12);
      
      // Find and click the marker to open info window
      const marker = markersRef.current.find(m => {
        const pos = m.getPosition();
        return pos && 
          Math.abs(pos.lat() - webcam.coordinates.lat) < 0.0001 && 
          Math.abs(pos.lng() - webcam.coordinates.lng) < 0.0001;
      });
      
      if (marker) {
        window.google.maps.event.trigger(marker, 'click');
      }
    }
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setIsScriptLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps script:', err);
        setError(err.message || 'Failed to load Google Maps. Please check your configuration.');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isScriptLoaded && mapRef.current) {
      initializeMap();
      setIsLoading(false);
      // Attempt to set view to user's location on startup
      handleMyLocation(true);
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setOptions({
        styles: theme === 'dark' ? darkMapStyle : lightMapStyle
      });
    }
  }, [theme]);

  useEffect(() => {
    if (googleMapRef.current && !isLoading) {
      addWebcamMarkers();
    }
  }, [webcams, isLoading, selectedCategory, selectedRegion]);

  const handleMyLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) alert("Geolocation is not supported by your browser");
      return;
    }

    // Reset region to Global so user can see webcams near them regardless of previous filter
    if (!silent) {
      setSelectedRegion('Global');
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        
        if (googleMapRef.current && window.google) {
          // Simply zoom to user location for both mobile and desktop
          // This avoids issues with geocoding bounds causing grey areas or zooming out too far
          googleMapRef.current.setCenter({ lat: latitude, lng: longitude });
          googleMapRef.current.setZoom(9);
          
          // Trigger resize to ensure tiles load correctly
          window.google.maps.event.trigger(googleMapRef.current, 'resize');
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Error getting location:", error);
        if (!silent) {
          let errorMessage = "Unable to retrieve your location.";
          if (error.code === 1) errorMessage = "Location permission denied. Please enable location services for this site.";
          else if (error.code === 2) errorMessage = "Location unavailable. Please check your GPS signal.";
          else if (error.code === 3) errorMessage = "Location request timed out. Please try again.";
          alert(errorMessage);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // Allow cached position up to 5 minutes old
      }
    );
  };

  const getGlobalZoomLevel = () => {
    const width = window.innerWidth;
    if (width > 1024) return 3;
    return 2;
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: getGlobalZoomLevel(),
      center: { lat: 30, lng: 140 },
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy',
      styles: theme === 'dark' ? darkMapStyle : lightMapStyle
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
    const bounds = new window.google.maps.LatLngBounds();

    const filteredWebcams = webcams.filter(w => {
      // Category filter
      if (selectedCategory && w.category !== selectedCategory) return false;

      // Region filter
      if (selectedRegion === 'Global') return true;
      if (selectedRegion === 'US') return ['United States', 'USA', 'Canada'].includes(w.country);
      if (selectedRegion === 'EU') return ['United Kingdom', 'UK', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Ireland', 'Greece', 'Austria', 'Belgium', 'Portugal', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Cyprus', 'Luxembourg', 'Iceland'].includes(w.country);
      if (selectedRegion === 'JP') return w.country === 'Japan';
      if (selectedRegion === 'KR') return ['South Korea', 'Korea'].includes(w.country);
      if (selectedRegion === 'TW') return w.country === 'Taiwan';
      if (selectedRegion === 'SG') return w.country === 'Singapore';
      return true;
    });

    filteredWebcams.forEach(webcam => {
      const marker = new window.google.maps.Marker({
        position: webcam.coordinates,
        map: map,
        title: webcam.name,
        icon: {
          url: createMarkerIcon(webcam),
          scaledSize: new window.google.maps.Size(50, 50),
          anchor: new window.google.maps.Point(25, 25)
        },
        animation: webcam.isLive ? window.google.maps.Animation.DROP : undefined
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(webcam)
      });

      marker.addListener('click', () => {
        // Close other info windows
        markersRef.current.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });

        infoWindow.open(map, marker);
        
        map.panTo(webcam.coordinates);
        if (map.getZoom()! < 12) {
          map.setZoom(12);
        }
      });

      (marker as any).infoWindow = infoWindow;
      markersRef.current.push(marker);
      bounds.extend(webcam.coordinates);
    });

    if (filteredWebcams.length > 0) {
      if (selectedRegion !== 'Global') {
        map.fitBounds(bounds);
      }
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

  const resetView = () => {
    setSelectedRegion('Global');
    setSelectedCategory(null);
    if (googleMapRef.current) {
      googleMapRef.current.setCenter({ lat: 30, lng: 140 });
      googleMapRef.current.setZoom(getGlobalZoomLevel());
      
      // Close any open info windows
      markersRef.current.forEach(m => {
        const iw = (m as any).infoWindow;
        if (iw) iw.close();
      });
    }
  };

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
        <div className="header-left">
          <h1 
            onClick={resetView}
            title="Reset to Global View"
            className="app-title"
          >
            🌍 WorldPeek
          </h1>
          <span className="location-count">Explore {webcams.length} locations</span>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search city, country, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
          
          {showSearchResults && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map(webcam => (
                  <div 
                    key={webcam.id} 
                    className="search-result-item"
                    onClick={() => handleSearchSelect(webcam)}
                  >
                    <span className="result-icon">{getCategoryIcon(webcam.category)}</span>
                    <div className="result-info">
                      <div className="result-name">{webcam.name}</div>
                      <div className="result-location">{webcam.city}, {webcam.country}</div>
                    </div>
                    {webcam.isLive && <span className="live-badge-small">LIVE</span>}
                  </div>
                ))
              ) : (
                <div className="no-results">No locations found</div>
              )}
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <button 
            className={`control-button ${isLocating ? 'locating' : ''}`}
            onClick={() => handleMyLocation(false)}
            title="My Location"
            disabled={isLocating}
          >
            {isLocating ? '⏳' : '📍'}
          </button>
          <div className="filter-control-wrapper">
            <button 
              onClick={() => setShowRegionMenu(!showRegionMenu)} 
              className={`control-button ${showRegionMenu || selectedRegion !== 'Global' ? 'active' : ''}`}
              title="Select Region"
            >
              {REGIONS.find(r => r.id === selectedRegion)?.icon || '🌍'}
            </button>
            {showRegionMenu && (
              <div className="filter-menu region-menu">
                {REGIONS.map(region => (
                  <button
                    key={region.id}
                    className={selectedRegion === region.id ? 'active' : ''}
                    onClick={() => { 
                      if (region.id === 'Global') {
                        if (googleMapRef.current) {
                          googleMapRef.current.setCenter({ lat: 30, lng: 140 });
                          googleMapRef.current.setZoom(getGlobalZoomLevel());
                        }
                        setSelectedRegion('Global');
                      } else {
                        setSelectedRegion(region.id); 
                      }
                      setShowRegionMenu(false); 
                    }}
                  >
                    {region.icon} {region.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="filter-control-wrapper">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)} 
              className={`control-button ${showFilterMenu || selectedCategory ? 'active' : ''}`}
              title="Filter"
            >
              🏷️
            </button>
            {showFilterMenu && (
              <div className="filter-menu">
                <button 
                  onClick={() => { setSelectedCategory(null); setShowFilterMenu(false); }} 
                  className={!selectedCategory ? 'active' : ''}
                >
                  🌐 All
                </button>
                {['beach', 'city', 'landmark', 'nature', 'mountain'].map(category => (
                  <button
                    key={category}
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => { setSelectedCategory(category); setShowFilterMenu(false); }}
                  >
                    {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
      
      <div className="map-wrapper" style={{ position: 'relative', height: 'calc(100vh - 80px)' }}>
        {isLoading && (
          <div className="map-loading" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
        <div ref={mapRef} className="map-container" style={{ height: '100%', width: '100%' }} />
      
      <div className="map-footer-links">
        <a href="/about.html" target="_blank" rel="noopener noreferrer">About</a>
        <span className="separator">•</span>
        <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
        <span className="separator">•</span>
        <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer">Terms</a>
      </div>
      </div>
    </div>
  );
};

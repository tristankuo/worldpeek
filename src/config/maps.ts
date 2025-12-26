// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places', 'geometry'] as const,
  version: 'weekly'
};

// Validate key is present in production
if (!GOOGLE_MAPS_CONFIG.apiKey && import.meta.env.MODE === 'production') {
  console.error('⚠️ Google Maps API key is not configured');
}

export const isMapConfigValid = (): boolean => {
  return GOOGLE_MAPS_CONFIG.apiKey !== '' && 
         GOOGLE_MAPS_CONFIG.apiKey !== 'your_google_maps_api_key';
};

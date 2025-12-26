import { getFunctions, httpsCallable } from 'firebase/functions';

interface MapConfig {
  apiKey: string;
}

// Fetch API key securely from Firebase Function or local env
export async function getSecureMapConfig(): Promise<MapConfig> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Always try environment variable first
  if (apiKey && apiKey !== 'your_google_maps_api_key') {
    return { apiKey };
  }
  
  // In production with Firebase Functions enabled, try to fetch from function
  if (import.meta.env.PROD) {
    try {
      const functions = getFunctions();
      const getConfig = httpsCallable<void, MapConfig>(functions, 'getMapConfig');
      const result = await getConfig();
      
      if (result.data?.apiKey) {
        return result.data;
      }
    } catch (error) {
      console.warn('Firebase Function not available, falling back to environment variable');
    }
  }
  
  // If we reach here, no API key is available
  throw new Error('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env file');
}

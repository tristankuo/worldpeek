import { getFunctions, httpsCallable } from 'firebase/functions';

interface MapConfig {
  apiKey: string;
}

// Fetch API key securely from Firebase Function or local env
export async function getSecureMapConfig(): Promise<MapConfig> {
  // In development, use local .env
  if (import.meta.env.MODE === 'development' || !import.meta.env.PROD) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      throw new Error('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env file');
    }
    
    return { apiKey };
  }
  
  // In production, fetch from secure Firebase Function
  try {
    const functions = getFunctions();
    const getConfig = httpsCallable<void, MapConfig>(functions, 'getMapConfig');
    const result = await getConfig();
    
    if (!result.data?.apiKey) {
      throw new Error('No API key returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to get map config from Firebase:', error);
    
    // Fallback to environment variable if function fails
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey && apiKey !== 'your_google_maps_api_key') {
      console.warn('Using fallback API key from environment');
      return { apiKey };
    }
    
    throw new Error('Unable to load Google Maps configuration');
  }
}

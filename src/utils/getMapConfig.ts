interface MapConfig {
  apiKey: string;
}

// Fetch API key from environment variable
// Firebase Functions approach commented out until Blaze plan is activated
export async function getSecureMapConfig(): Promise<MapConfig> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log('API Key check:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined',
    env: import.meta.env.MODE 
  });
  
  if (!apiKey || apiKey === 'your_google_maps_api_key' || apiKey === 'your_google_maps_api_key_here') {
    console.error('API key not configured:', apiKey);
    throw new Error('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env file');
  }
  
  return { apiKey };
  
  // TODO: Uncomment when Firebase Blaze plan is activated
  // In production with Firebase Functions enabled, try to fetch from function
  // if (import.meta.env.PROD) {
  //   try {
  //     const functions = getFunctions();
  //     const getConfig = httpsCallable<void, MapConfig>(functions, 'getMapConfig');
  //     const result = await getConfig();
  //     
  //     if (result.data?.apiKey) {
  //       return result.data;
  //     }
  //   } catch (error) {
  //     console.warn('Firebase Function not available, using environment variable');
  //   }
  // }
}

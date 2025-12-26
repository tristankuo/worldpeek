import { getSecureMapConfig } from './getMapConfig';

export async function loadGoogleMapsScript(): Promise<void> {
  console.log('🗺️ loadGoogleMapsScript called');
  
  // Check if already loaded immediately
  if (window.google && window.google.maps) {
    console.log('✅ Google Maps already loaded');
    return Promise.resolve();
  }

  return new Promise(async (resolve, reject) => {
    // Timeout to prevent hanging indefinitely
    const timeoutId = setTimeout(() => {
      reject(new Error('Google Maps script load timed out'));
    }, 10000); // 10 seconds timeout

    const onScriptLoad = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    const onScriptError = () => {
      clearTimeout(timeoutId);
      reject(new Error('Failed to load Google Maps script'));
    };

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.log('🔄 Google Maps script already exists, attaching listeners');
      existingScript.addEventListener('load', onScriptLoad);
      existingScript.addEventListener('error', onScriptError);
      
      // If script is already loaded but window.google isn't ready yet, 
      // or if we missed the load event, we might hang.
      // Let's poll for window.google just in case.
      const intervalId = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          existingScript.removeEventListener('load', onScriptLoad);
          existingScript.removeEventListener('error', onScriptError);
          resolve();
        }
      }, 500);
      
      return;
    }

    try {
      // Get API key securely
      console.log('🔑 Fetching map config...');
      const config = await getSecureMapConfig();
      console.log('✅ Map config retrieved');
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);
      
      document.head.appendChild(script);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Failed to get map configuration:', error);
      reject(error);
    }
  });
}

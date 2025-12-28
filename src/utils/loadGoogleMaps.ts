import { getSecureMapConfig } from './getMapConfig';

let loadingPromise: Promise<void> | null = null;

export async function loadGoogleMapsScript(): Promise<void> {
  console.log('🗺️ loadGoogleMapsScript called');
  
  if (window.google && window.google.maps) {
    console.log('✅ Google Maps already loaded');
    return Promise.resolve();
  }

  if (loadingPromise) {
    console.log('⏳ Google Maps load already in progress');
    return loadingPromise;
  }

  loadingPromise = new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      loadingPromise = null; // Reset on failure
      reject(new Error('Google Maps script load timed out'));
    }, 10000);

    try {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      
      if (existingScript) {
        console.log('🔄 Google Maps script already exists, polling for readiness');
        const intervalId = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            resolve();
          }
        }, 100);
        return;
      }

      console.log('🔑 Fetching map config...');
      const config = await getSecureMapConfig();
      
      // Define global callback
      const callbackName = 'initGoogleMapsCallback';
      (window as any)[callbackName] = () => {
        console.log('✅ Google Maps callback fired');
        clearTimeout(timeoutId);
        delete (window as any)[callbackName];
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      script.onerror = (error) => {
        clearTimeout(timeoutId);
        loadingPromise = null;
        console.error('Failed to load Google Maps script:', error);
        reject(new Error('Failed to load Google Maps script'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      clearTimeout(timeoutId);
      loadingPromise = null;
      console.error('Failed to initialize Google Maps:', error);
      reject(error);
    }
  });

  return loadingPromise;
}

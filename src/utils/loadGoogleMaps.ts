import { getSecureMapConfig } from './getMapConfig';

export async function loadGoogleMapsScript(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }

    try {
      // Get API key securely
      const config = await getSecureMapConfig();
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.addEventListener('load', () => resolve());
      script.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to get map configuration:', error);
      reject(error);
    }
  });
}

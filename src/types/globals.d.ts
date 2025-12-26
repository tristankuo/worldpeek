declare global {
  interface Window {
    google: typeof google;
    viewWebcam: (id: string) => void;
    getDirections: (lat: number, lng: number) => void;
  }
}

export {};

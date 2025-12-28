export interface WebcamLocation {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  city: string;
  country: string;
  streamUrl: string;
  thumbnailUrl?: string;
  category: WebcamCategory;
  isLive: boolean;
  provider?: string;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastChecked?: string;
}

export type WebcamCategory = 'beach' | 'city' | 'nature' | 'landmark' | 'mountain' | 'zoo' | 'aquarium' | 'theme-park' | 'other';

export interface WebcamFilter {
  category?: WebcamCategory;
  country?: string;
  isLive?: boolean;
  searchQuery?: string;
}

export interface WebcamSource {
  name: string;
  apiEndpoint?: string;
  scrapingUrl?: string;
  region: string;
  type: 'api' | 'scraping' | 'rss' | 'youtube';
}

export interface ClassificationResult {
  isTourist: boolean;
  confidence: number;
  category?: WebcamCategory;
  reason?: string;
}

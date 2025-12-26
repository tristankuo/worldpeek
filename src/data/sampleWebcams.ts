import { WebcamLocation } from '../types/webcam';

// Sample webcam data for demonstration
export const sampleWebcams: WebcamLocation[] = [
  {
    id: '1',
    name: 'Times Square, New York',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    city: 'New York',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/AdUw5RdyZxI',
    thumbnailUrl: 'https://i.ytimg.com/vi/AdUw5RdyZxI/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live view of Times Square in Manhattan, New York City',
    provider: 'EarthCam'
  },
  {
    id: '2',
    name: 'Waikiki Beach, Hawaii',
    coordinates: { lat: 21.2793, lng: -157.8293 },
    city: 'Honolulu',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://i.ytimg.com/vi/8jB0nDDVJwI/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Beautiful Waikiki Beach with Diamond Head in the background',
    provider: 'YouTube'
  },
  {
    id: '3',
    name: 'Eiffel Tower, Paris',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    city: 'Paris',
    country: 'France',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
    category: 'landmark',
    isLive: true,
    description: 'Iconic Eiffel Tower in Paris, France',
    provider: 'YouTube'
  },
  {
    id: '4',
    name: 'Grand Canyon National Park',
    coordinates: { lat: 36.1069, lng: -112.1129 },
    city: 'Grand Canyon',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400',
    category: 'nature',
    isLive: true,
    description: 'Breathtaking views of the Grand Canyon',
    provider: 'National Park Service'
  },
  {
    id: '5',
    name: 'Shibuya Crossing, Tokyo',
    coordinates: { lat: 35.6595, lng: 139.7004 },
    city: 'Tokyo',
    country: 'Japan',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
    category: 'city',
    isLive: true,
    description: 'Famous Shibuya Crossing in Tokyo, Japan',
    provider: 'YouTube'
  },
  {
    id: '6',
    name: 'Bondi Beach, Sydney',
    coordinates: { lat: -33.8915, lng: 151.2767 },
    city: 'Sydney',
    country: 'Australia',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400',
    category: 'beach',
    isLive: true,
    description: 'Popular Bondi Beach in Sydney, Australia',
    provider: 'SkylineWebcams'
  },
  {
    id: '7',
    name: 'Mount Fuji, Japan',
    coordinates: { lat: 35.3606, lng: 138.7274 },
    city: 'Fujinomiya',
    country: 'Japan',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400',
    category: 'mountain',
    isLive: true,
    description: 'Majestic Mount Fuji, Japan\'s highest mountain',
    provider: 'YouTube'
  },
  {
    id: '8',
    name: 'Big Ben, London',
    coordinates: { lat: 51.5007, lng: -0.1246 },
    city: 'London',
    country: 'United Kingdom',
    streamUrl: 'https://www.youtube.com/embed/8jB0nDDVJwI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    category: 'landmark',
    isLive: true,
    description: 'Historic Big Ben clock tower in London',
    provider: 'EarthCam'
  }
];

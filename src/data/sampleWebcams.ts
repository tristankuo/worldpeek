import { WebcamLocation } from '../types/webcam';

// Curated list of active YouTube live webcams
export const sampleWebcams: WebcamLocation[] = [
  // --- Taiwan ---
  {
    id: 'HzYW9k3qkSs',
    name: 'Jiufen Old Street',
    coordinates: { lat: 25.1099, lng: 121.8452 },
    city: 'New Taipei City',
    country: 'Taiwan',
    streamUrl: 'https://www.youtube.com/embed/HzYW9k3qkSs?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/HzYW9k3qkSs/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'Live view of the historic Jiufen Old Street, famous for its tea houses and lantern-lit alleyways.',
    provider: 'YouTube'
  },
  {
    id: 'GUCaVR88ZFU',
    name: 'Hehuanshan',
    coordinates: { lat: 24.1373, lng: 121.2757 },
    city: 'Nantou',
    country: 'Taiwan',
    streamUrl: 'https://www.youtube.com/embed/GUCaVR88ZFU?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/GUCaVR88ZFU/mqdefault_live.jpg',
    category: 'mountain',
    isLive: true,
    description: 'Breathtaking views from Hehuanshan, one of Taiwan\'s highest accessible peaks.',
    provider: 'YouTube'
  },
  {
    id: 'tD_a03trUvE',
    name: 'Shiding Thousand Island Lake',
    coordinates: { lat: 24.9333, lng: 121.6333 },
    city: 'New Taipei City',
    country: 'Taiwan',
    streamUrl: 'https://www.youtube.com/embed/tD_a03trUvE?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/tD_a03trUvE/mqdefault_live.jpg',
    category: 'nature',
    isLive: true,
    description: 'Scenic view of the Thousand Island Lake in Shiding District.',
    provider: 'YouTube'
  },
  {
    id: 'Ndo_8RuefH4',
    name: 'Taipei 101 / Elephant Mountain',
    coordinates: { lat: 25.0273, lng: 121.5707 },
    city: 'Taipei',
    country: 'Taiwan',
    streamUrl: 'https://www.youtube.com/embed/Ndo_8RuefH4?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/Ndo_8RuefH4/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Iconic view of Taipei 101 and the city skyline from Elephant Mountain.',
    provider: 'YouTube'
  },

  // --- Japan ---
  {
    id: 'gFRtAAmiFbE',
    name: 'Shibuya Crossing',
    coordinates: { lat: 35.6595, lng: 139.7004 },
    city: 'Tokyo',
    country: 'Japan',
    streamUrl: 'https://www.youtube.com/embed/gFRtAAmiFbE?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/gFRtAAmiFbE/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live feed of the world-famous Shibuya Crossing in Tokyo.',
    provider: 'YouTube'
  },
  {
    id: 'DjdUEyjx8GM',
    name: 'Mt. Fuji (Lake Kawaguchi)',
    coordinates: { lat: 35.5171, lng: 138.7518 },
    city: 'Fujikawaguchiko',
    country: 'Japan',
    streamUrl: 'https://www.youtube.com/embed/DjdUEyjx8GM?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/DjdUEyjx8GM/mqdefault_live.jpg',
    category: 'mountain',
    isLive: true,
    description: 'Stunning view of Mount Fuji from Lake Kawaguchi.',
    provider: 'YouTube'
  },
  {
    id: 'a-DmMSV2Bb4',
    name: 'Tokyo Tower',
    coordinates: { lat: 35.6586, lng: 139.7454 },
    city: 'Tokyo',
    country: 'Japan',
    streamUrl: 'https://www.youtube.com/embed/a-DmMSV2Bb4?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/a-DmMSV2Bb4/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'Live view of the iconic Tokyo Tower.',
    provider: 'YouTube'
  },

  // --- South Korea ---
  {
    id: '-JhoMGoAfFc',
    name: 'N Seoul Tower',
    coordinates: { lat: 37.5512, lng: 126.9882 },
    city: 'Seoul',
    country: 'South Korea',
    streamUrl: 'https://www.youtube.com/embed/-JhoMGoAfFc?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/-JhoMGoAfFc/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'Panoramic view of Seoul from N Seoul Tower.',
    provider: 'YouTube'
  },
  {
    id: '3Uf3w-UHB4U',
    name: 'Haeundae Beach',
    coordinates: { lat: 35.1587, lng: 129.1603 },
    city: 'Busan',
    country: 'South Korea',
    streamUrl: 'https://www.youtube.com/embed/3Uf3w-UHB4U?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/3Uf3w-UHB4U/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Live cam of Haeundae Beach, South Korea\'s most famous beach.',
    provider: 'YouTube'
  },
  {
    id: 'Piac-qj2Mbg',
    name: 'Gwanghwamun Gate',
    coordinates: { lat: 37.5759, lng: 126.9769 },
    city: 'Seoul',
    country: 'South Korea',
    streamUrl: 'https://www.youtube.com/embed/Piac-qj2Mbg?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/Piac-qj2Mbg/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'View of Gwanghwamun Gate and Gwanghwamun Square.',
    provider: 'YouTube'
  },

  // --- Southeast Asia ---
  {
    id: 'vV7-D3HTo58',
    name: 'Victoria Harbour',
    coordinates: { lat: 22.2933, lng: 114.1717 },
    city: 'Hong Kong',
    country: 'Hong Kong',
    streamUrl: 'https://www.youtube.com/embed/vV7-D3HTo58?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/vV7-D3HTo58/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live view of Victoria Harbour and the Hong Kong skyline.',
    provider: 'YouTube'
  },
  {
    id: 'byhWzqNSsF0',
    name: 'Pattaya Beach',
    coordinates: { lat: 12.9276, lng: 100.8771 },
    city: 'Pattaya',
    country: 'Thailand',
    streamUrl: 'https://www.youtube.com/embed/byhWzqNSsF0?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/byhWzqNSsF0/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Live cam of Pattaya Beach.',
    provider: 'YouTube'
  },
  {
    id: 'q6P4e_wK_60',
    name: 'Bangkok City',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    city: 'Bangkok',
    country: 'Thailand',
    streamUrl: 'https://www.youtube.com/embed/q6P4e_wK_60?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/q6P4e_wK_60/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live view of the Bangkok city skyline.',
    provider: 'YouTube'
  },
  {
    id: 'H7_tC35y6lE',
    name: 'Marina Bay Sands',
    coordinates: { lat: 1.2834, lng: 103.8607 },
    city: 'Singapore',
    country: 'Singapore',
    streamUrl: 'https://www.youtube.com/embed/H7_tC35y6lE?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/H7_tC35y6lE/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'Iconic view of Marina Bay Sands and the Singapore skyline.',
    provider: 'YouTube'
  },

  // --- Europe ---
  {
    id: 'LwihxyJ4V20',
    name: 'Zermatt / Matterhorn',
    coordinates: { lat: 46.0207, lng: 7.7491 },
    city: 'Zermatt',
    country: 'Switzerland',
    streamUrl: 'https://www.youtube.com/embed/LwihxyJ4V20?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/LwihxyJ4V20/mqdefault_live.jpg',
    category: 'mountain',
    isLive: true,
    description: 'Spectacular view of the Matterhorn from Zermatt.',
    provider: 'YouTube'
  },
  {
    id: 'Cp4RRAEgpeU',
    name: 'Venice Grand Canal',
    coordinates: { lat: 45.4408, lng: 12.3155 },
    city: 'Venice',
    country: 'Italy',
    streamUrl: 'https://www.youtube.com/embed/Cp4RRAEgpeU?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/Cp4RRAEgpeU/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live view of the Grand Canal and Rialto Bridge in Venice.',
    provider: 'YouTube'
  },
  {
    id: 'rJ2IY6rp-G8',
    name: 'Eiffel Tower',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    city: 'Paris',
    country: 'France',
    streamUrl: 'https://www.youtube.com/embed/rJ2IY6rp-G8?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/rJ2IY6rp-G8/mqdefault_live.jpg',
    category: 'landmark',
    isLive: true,
    description: 'Live cam of the Eiffel Tower in Paris.',
    provider: 'YouTube'
  },

  // --- North America ---
  {
    id: '1-iS7LArMPA',
    name: 'Times Square',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    city: 'New York City',
    country: 'USA',
    streamUrl: 'https://www.youtube.com/embed/1-iS7LArMPA?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/1-iS7LArMPA/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'The bustling energy of Times Square, NYC.',
    provider: 'YouTube'
  },
  {
    id: 'X08pW_7u4rM',
    name: 'Niagara Falls',
    coordinates: { lat: 43.0896, lng: -79.0849 },
    city: 'Niagara Falls',
    country: 'Canada',
    streamUrl: 'https://www.youtube.com/embed/X08pW_7u4rM?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/X08pW_7u4rM/mqdefault_live.jpg',
    category: 'nature',
    isLive: true,
    description: 'Live view of the majestic Niagara Falls.',
    provider: 'YouTube'
  },
  {
    id: '683_h7A8XF4',
    name: 'Banff & Lake Louise',
    coordinates: { lat: 51.4254, lng: -116.1773 },
    city: 'Banff',
    country: 'Canada',
    streamUrl: 'https://www.youtube.com/embed/683_h7A8XF4?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/683_h7A8XF4/mqdefault_live.jpg',
    category: 'nature',
    isLive: true,
    description: 'Beautiful scenery of Banff National Park and Lake Louise.',
    provider: 'YouTube'
  },
  {
    id: '1EiC9bvVGnk',
    name: 'Jackson Hole Town Square',
    coordinates: { lat: 43.4799, lng: -110.7624 },
    city: 'Jackson',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/1EiC9bvVGnk/mqdefault_live.jpg',
    category: 'city',
    isLive: true,
    description: 'Live view of Jackson Hole Town Square, Wyoming',
    provider: 'YouTube'
  },

  // --- Space & Nature ---
  {
    id: 'xRPjKQtRXR8',
    name: 'International Space Station',
    coordinates: { lat: 0, lng: 0 },
    city: 'Space',
    country: 'Orbit',
    streamUrl: 'https://www.youtube.com/embed/xRPjKQtRXR8?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/xRPjKQtRXR8/mqdefault_live.jpg',
    category: 'other',
    isLive: true,
    description: 'Live view from the International Space Station',
    provider: 'NASA'
  },
  {
    id: 'ydYDqZQpim8',
    name: 'Namib Desert Waterhole',
    coordinates: { lat: -23.5616, lng: 15.0413 },
    city: 'Namib-Naukluft Park',
    country: 'Namibia',
    streamUrl: 'https://www.youtube.com/embed/ydYDqZQpim8?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/ydYDqZQpim8/mqdefault_live.jpg',
    category: 'nature',
    isLive: true,
    description: 'Live wildlife cam from the Namib Desert',
    provider: 'YouTube'
  },
  {
    id: '4eK-i7vC-js',
    name: 'Tembe Elephant Park',
    coordinates: { lat: -27.0456, lng: 32.4199 },
    city: 'KwaZulu-Natal',
    country: 'South Africa',
    streamUrl: 'https://www.youtube.com/embed/4eK-i7vC-js?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/4eK-i7vC-js/mqdefault_live.jpg',
    category: 'nature',
    isLive: true,
    description: 'Live elephant cam from Tembe Elephant Park',
    provider: 'YouTube'
  },

  // --- Beaches ---
  {
    id: 'p-rSdt0aFuw',
    name: 'Waikiki Beach',
    coordinates: { lat: 21.2761, lng: -157.8263 },
    city: 'Honolulu',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/p-rSdt0aFuw?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/p-rSdt0aFuw/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Live view of Waikiki Beach, Hawaii',
    provider: 'YouTube'
  },
  {
    id: 'AzZfgAJGEtw',
    name: 'Santa Monica Pier',
    coordinates: { lat: 34.0092, lng: -118.4976 },
    city: 'Santa Monica',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/AzZfgAJGEtw?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/AzZfgAJGEtw/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Live view of Santa Monica Pier, California',
    provider: 'YouTube'
  },
  {
    id: 'vvFullsC9LI',
    name: 'Venice Beach Boardwalk',
    coordinates: { lat: 33.9850, lng: -118.4695 },
    city: 'Los Angeles',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/vvFullsC9LI?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/vvFullsC9LI/mqdefault_live.jpg',
    category: 'beach',
    isLive: true,
    description: 'Live view of Venice Beach Boardwalk',
    provider: 'YouTube'
  },

  // --- Other ---
  {
    id: 'JE2PXYBv9FQ',
    name: 'Heathrow Airport',
    coordinates: { lat: 51.4700, lng: -0.4543 },
    city: 'London',
    country: 'United Kingdom',
    streamUrl: 'https://www.youtube.com/embed/JE2PXYBv9FQ?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/JE2PXYBv9FQ/mqdefault_live.jpg',
    category: 'other',
    isLive: true,
    description: 'Live view of Heathrow Airport',
    provider: 'YouTube'
  },
  {
    id: 'xIDzfP2Pjks',
    name: 'LAX Airport',
    coordinates: { lat: 33.9416, lng: -118.4085 },
    city: 'Los Angeles',
    country: 'United States',
    streamUrl: 'https://www.youtube.com/embed/xIDzfP2Pjks?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/xIDzfP2Pjks/mqdefault_live.jpg',
    category: 'other',
    isLive: true,
    description: 'Live view of LAX Airport',
    provider: 'YouTube'
  },
  {
    id: 'hRjpKBfIRwA',
    name: 'Mount Washington Ski',
    coordinates: { lat: 49.7422, lng: -125.3036 },
    city: 'Courtenay',
    country: 'Canada',
    streamUrl: 'https://www.youtube.com/embed/hRjpKBfIRwA?autoplay=1&mute=1',
    thumbnailUrl: 'https://i.ytimg.com/vi/hRjpKBfIRwA/mqdefault_live.jpg',
    category: 'mountain',
    isLive: true,
    description: 'Live view from Mount Washington Ski Resort',
    provider: 'YouTube'
  }
];

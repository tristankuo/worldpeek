import React from 'react';
import './FeaturedDestinations.css';
import { WebcamLocation } from '../types/webcam';
import { WEBCAMS } from '../data/webcams';

interface FeaturedDestinationsProps {
  onWebcamSelect: (webcam: WebcamLocation) => void;
}

export const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({ onWebcamSelect }) => {
  
  const featuredIds = [
    { 
      id: '5uZa3-RMFos', 
      title: 'Sydney Harbour, Australia', 
      desc: "Experience the vibrant energy of Sydney Harbour in stunning 4K resolution. Watch as ferries glide across the sparkling water, with the iconic Opera House and Harbour Bridge framing the scene. This 24/7 live stream captures the essence of Australia's most famous city, from the golden hues of sunrise to the dazzling city lights at night." 
    },
    { 
      id: '57w2gYXjRic', 
      title: 'Abbey Road, London', 
      desc: "Step into music history with a live view of the world's most famous zebra crossing. Located outside the legendary Abbey Road Studios in London, this camera captures fans from around the globe recreating the Beatles' iconic album cover. It's a charming and often amusing glimpse into pop culture tourism in action." 
    },
    { 
      id: 'rnXIjl_Rzy4', 
      title: 'Times Square, New York City', 
      desc: "Feel the pulse of the \"City That Never Sleeps\" with this live feed from the heart of Manhattan. Times Square is a sensory overload of neon billboards, yellow taxis, and bustling crowds. Whether it's the ball drop on New Year's Eve or a rainy Tuesday afternoon, the energy here is palpable and unmatched anywhere else on Earth." 
    },
    { 
      id: 'tujkoXI8rWM', 
      title: 'Shibuya Crossing, Tokyo', 
      desc: "Witness the organized chaos of the world's busiest pedestrian crossing. Located in Tokyo, Japan, Shibuya Crossing is a mesmerizing spectacle of humanity. When the lights turn red, vehicles stop, and a sea of people floods the intersection from all directions. It's a perfect example of Tokyo's fast-paced yet orderly urban life." 
    },
    { 
      id: 'Cp4RRAEgpeU', 
      title: 'Venice Grand Canal, Italy', 
      desc: "Transport yourself to the romantic waterways of Venice. This live stream offers a serene view of the Grand Canal, where gondolas and vaporettos navigate the historic waters. Admire the centuries-old architecture lining the canal banks and soak in the timeless beauty of this floating city, all from the comfort of your home." 
    },
    { 
      id: 'OzYp4NRZlwQ', 
      title: 'Eiffel Tower, Paris', 
      desc: "Gaze upon the Iron Lady in all her glory. This camera provides a breathtaking view of the Eiffel Tower, the enduring symbol of Paris and romance. Watch as it sparkles on the hour every evening, illuminating the Parisian skyline. It's a magical sight that captures the charm and elegance of the French capital." 
    },
    { 
      id: 'MMeBDRfRHyA', 
      title: 'Fushimi Inari Taisha, Kyoto', 
      desc: "Immerse yourself in the spiritual atmosphere of Kyoto's Fushimi Inari Taisha. Famous for its thousands of vermilion torii gates, this shrine is a gateway to traditional Japan. Watch visitors ascend the sacred Mount Inari and experience the serene beauty of this historic landmark." 
    },
    { 
      id: 'gn-vU9Ehe38', 
      title: 'Copacabana Beach, Rio de Janeiro', 
      desc: "Soak up the sun on one of the world's most famous beaches. Copacabana in Rio de Janeiro is a vibrant stretch of sand where the city meets the sea. Watch locals playing soccer and volleyball, tourists enjoying the waves, and the rhythmic energy of Brazilian beach culture unfold live." 
    },
    { 
      id: '10GcCC7tykM', 
      title: 'Niagara Falls, Canada/USA', 
      desc: "Marvel at the raw power of nature with a live view of Niagara Falls. See the massive volume of water cascading over the edge, creating a constant mist that often forms rainbows. In winter, the frozen formations are a sight to behold, while summer brings lush greenery and boat tours venturing into the mist." 
    },
    { 
      id: 'Sv9hcJ3k5h4', 
      title: 'Mount Fuji, Japan', 
      desc: "Witness the majestic beauty of Mount Fuji, Japan's highest peak and an active volcano. This 4K live stream captures the mountain's iconic snow-capped cone reflecting in the serene waters of Lake Kawaguchiko. A symbol of Japan, it offers a peaceful and awe-inspiring view throughout the seasons." 
    }
  ];

  const handleSelect = (id: string) => {
    const webcam = WEBCAMS.find(w => w.id === id);
    if (webcam) {
      onWebcamSelect(webcam);
    }
  };

  return (
    <div className="featured-destinations">
      <h2>Featured Destinations</h2>
      <p className="featured-intro">
        Explore our hand-picked selection of the world's most mesmerizing live views. 
        From bustling cityscapes to serene beaches, these high-definition streams offer a window to the world.
      </p>
      
      <div className="featured-grid">
        {featuredIds.map((item) => (
          <div key={item.id} className="featured-item">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button className="watch-live-btn" onClick={() => handleSelect(item.id)}>
              Watch Live 🔴
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import './FeaturedDestinations.css';

export const FeaturedDestinations: React.FC = () => {
  return (
    <div className="featured-destinations">
      <h2>Featured Destinations</h2>
      <p className="featured-intro">
        Explore our hand-picked selection of the world's most mesmerizing live views. 
        From bustling cityscapes to serene beaches, these high-definition streams offer a window to the world.
      </p>
      
      <div className="featured-grid">
        <div className="featured-item">
          <h3>Sydney Harbour, Australia</h3>
          <p>
            Experience the vibrant energy of Sydney Harbour in stunning 4K resolution. 
            Watch as ferries glide across the sparkling water, with the iconic Opera House and Harbour Bridge framing the scene. 
            This 24/7 live stream captures the essence of Australia's most famous city, from the golden hues of sunrise to the dazzling city lights at night.
          </p>
        </div>

        <div className="featured-item">
          <h3>Abbey Road, London</h3>
          <p>
            Step into music history with a live view of the world's most famous zebra crossing. 
            Located outside the legendary Abbey Road Studios in London, this camera captures fans from around the globe recreating the Beatles' iconic album cover. 
            It's a charming and often amusing glimpse into pop culture tourism in action.
          </p>
        </div>

        <div className="featured-item">
          <h3>Times Square, New York City</h3>
          <p>
            Feel the pulse of the "City That Never Sleeps" with this live feed from the heart of Manhattan. 
            Times Square is a sensory overload of neon billboards, yellow taxis, and bustling crowds. 
            Whether it's the ball drop on New Year's Eve or a rainy Tuesday afternoon, the energy here is palpable and unmatched anywhere else on Earth.
          </p>
        </div>

        <div className="featured-item">
          <h3>Shibuya Crossing, Tokyo</h3>
          <p>
            Witness the organized chaos of the world's busiest pedestrian crossing. 
            Located in Tokyo, Japan, Shibuya Crossing is a mesmerizing spectacle of humanity. 
            When the lights turn red, vehicles stop, and a sea of people floods the intersection from all directions. 
            It's a perfect example of Tokyo's fast-paced yet orderly urban life.
          </p>
        </div>

        <div className="featured-item">
          <h3>Venice Grand Canal, Italy</h3>
          <p>
            Transport yourself to the romantic waterways of Venice. 
            This live stream offers a serene view of the Grand Canal, where gondolas and vaporettos navigate the historic waters. 
            Admire the centuries-old architecture lining the canal banks and soak in the timeless beauty of this floating city, all from the comfort of your home.
          </p>
        </div>

        <div className="featured-item">
          <h3>Eiffel Tower, Paris</h3>
          <p>
            Gaze upon the Iron Lady in all her glory. 
            This camera provides a breathtaking view of the Eiffel Tower, the enduring symbol of Paris and romance. 
            Watch as it sparkles on the hour every evening, illuminating the Parisian skyline. 
            It's a magical sight that captures the charm and elegance of the French capital.
          </p>
        </div>

        <div className="featured-item">
          <h3>Santorini, Greece</h3>
          <p>
            Escape to the idyllic Greek islands with a view of Santorini's famous caldera. 
            White-washed buildings with blue domes cling to the cliffs, overlooking the deep blue Aegean Sea. 
            This stream is particularly spectacular at sunset, when the sky is painted in hues of orange and pink, creating a picture-perfect postcard moment.
          </p>
        </div>

        <div className="featured-item">
          <h3>Copacabana Beach, Rio de Janeiro</h3>
          <p>
            Soak up the sun on one of the world's most famous beaches. 
            Copacabana in Rio de Janeiro is a vibrant stretch of sand where the city meets the sea. 
            Watch locals playing soccer and volleyball, tourists enjoying the waves, and the rhythmic energy of Brazilian beach culture unfold live.
          </p>
        </div>

        <div className="featured-item">
          <h3>Niagara Falls, Canada/USA</h3>
          <p>
            Marvel at the raw power of nature with a live view of Niagara Falls. 
            See the massive volume of water cascading over the edge, creating a constant mist that often forms rainbows. 
            In winter, the frozen formations are a sight to behold, while summer brings lush greenery and boat tours venturing into the mist.
          </p>
        </div>

        <div className="featured-item">
          <h3>Northern Lights (Aurora Borealis)</h3>
          <p>
            Chase the elusive Aurora Borealis from the comfort of your screen. 
            Located in prime viewing spots like Lapland or Manitoba, these cameras capture the dancing green and purple lights of the aurora. 
            While activity varies, catching a glimpse of this natural phenomenon is a truly awe-inspiring experience.
          </p>
        </div>
      </div>
    </div>
  );
};

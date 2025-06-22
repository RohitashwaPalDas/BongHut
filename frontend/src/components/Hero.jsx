import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  const heroImages = [assets.hero_img, assets.hero_img2, assets.hero_img3]; // Add your image paths here
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length);
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 overflow-hidden">
      {/* Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Latest Arrivals</h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>

      {/* Right Side with sliding animation */}
      <div className="w-full sm:w-1/2 relative h-[full] sm:h-auto overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className="w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

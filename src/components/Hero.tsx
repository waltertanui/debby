import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-[#00A4E4] to-[#0093cd] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              The Most Flexible Asset Management Platform
            </h1>
            <p className="text-xl mb-8">
              Track, manage, and optimize your assets with our powerful and customizable solution.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-[#00A4E4] px-6 py-3 rounded-md font-semibold flex items-center">
                Request Demo <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold">
                Watch Video
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Asset Management"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
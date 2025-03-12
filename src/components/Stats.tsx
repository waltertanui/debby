import React from 'react';

const Stats = () => {
  return (
    <div className="bg-[#00A4E4] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">5000+</div>
            <div className="text-lg">Customers Worldwide</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="text-lg">Uptime Guaranteed</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-lg">Customer Support</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-lg">Countries Served</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
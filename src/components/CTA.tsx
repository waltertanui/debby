import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Asset Management?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of organizations that trust Asset Panda to manage their assets.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link 
                to="/signup"
                className="bg-[#00A4E4] text-white px-8 py-4 rounded-md font-semibold flex items-center justify-center hover:bg-[#0093cd] transition-colors"
              >
                Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/contact"
                className="border-2 border-[#00A4E4] text-[#00A4E4] px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
import React, { useState } from 'react';
import { Box, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Box className="h-8 w-8 text-[#00A4E4]" />
              <span className="ml-2 text-xl font-bold text-gray-900">AssetFlow</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <a href="#" className="text-gray-600 hover:text-gray-900">Solutions</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-[#00A4E4] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0093cd] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Solutions</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Features</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Resources</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Pricing</a>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-[#00A4E4] hover:bg-[#0093cd]"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
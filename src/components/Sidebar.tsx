import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Package, Users, FileText, LogOut, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center text-[#00A4E4] font-semibold">
          <Package className="h-6 w-6 mr-2" />
          Asset Panda
        </Link>
      </div>
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-2 rounded-lg ${
            isActive('/dashboard')
              ? 'bg-[#00A4E4] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/assets"
          className={`flex items-center px-4 py-2 rounded-lg ${
            isActive('/assets')
              ? 'bg-[#00A4E4] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="h-5 w-5 mr-3" />
          Assets
        </Link>
        <Link
          to="/reports"
          className={`flex items-center px-4 py-2 rounded-lg ${
            isActive('/reports')
              ? 'bg-[#00A4E4] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileText className="h-5 w-5 mr-3" />
          Reports
        </Link>
        <Link
          to="/settings"
          className={`flex items-center px-4 py-2 rounded-lg ${
            isActive('/settings')
              ? 'bg-[#00A4E4] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg w-full mt-8"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;
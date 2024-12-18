import React from 'react';
import Sidebar from './sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSidebar = ['/', '/notifications', '/history'].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-white">
      {showSidebar && <Sidebar />}
      <main className="flex-1 flex flex-col">
        <div className={`flex-1 overflow-y-auto ${showSidebar ? 'pb-16' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;


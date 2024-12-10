import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ScanIcon, ClockIcon, BellIcon } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
  return (
    <Link 
      to={href} 
      className={`flex items-center p-2 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}
    >
      {icon}
      <span className="hidden md:inline ml-3">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10 md:static md:w-64 md:h-screen md:border-r md:border-t-0">
      <div className="flex justify-around items-center h-16 px-4 md:flex-col md:h-full md:justify-start md:items-start md:py-6">
        <div className="hidden md:block mb-6">
          <h1 className="text-xl font-semibold tracking-tight">ARNOTTS</h1>
          <p className="text-sm text-gray-500">Department Stores</p>
        </div>
        <NavItem 
          href="/" 
          icon={<HomeIcon className="w-6 h-6" />}
          label="Home"
          isActive={location.pathname === '/'}
        />
        <NavItem 
          href="/scan" 
          icon={<ScanIcon className="w-6 h-6" />}
          label="Scan"
          isActive={location.pathname === '/scan'}
        />
        <NavItem 
          href="/history" 
          icon={<ClockIcon className="w-6 h-6" />}
          label="History"
          isActive={location.pathname === '/history'}
        />
        <NavItem 
          href="/notifications" 
          icon={<BellIcon className="w-6 h-6" />}
          label="Notifications"
          isActive={location.pathname === '/notifications'}
        />
      </div>
    </nav>
  );
};

export default Sidebar;


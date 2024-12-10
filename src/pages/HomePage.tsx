import React from 'react';
import { Link } from 'react-router-dom';
import { ScanIcon } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 px-5 md:px-8 py-6">
        <header className="text-center md:text-left mb-6">
          <h1 className="text-xl font-semibold tracking-tight">ARNOTTS</h1>
          <p className="text-sm text-gray-500">Arnotts Department Stores</p>
        </header>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Hey!</h2>
            <p className="text-gray-600">Christie</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Your Dashboard</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DashboardCard
              title="Scan new"
              description="Scanned 233"
              icon={<ScanIcon className="h-6 w-6 text-[#6B7CFF]" />}
              bgColor="bg-[#F8F9FE]"
              iconBgColor="bg-[#E8EBFF]"
              href="/scan"
            />
            <DashboardCard
              title="Export Data"
              description="3 downloaded files"
              icon={
                <svg className="h-6 w-6 text-[#FF6B7C]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              bgColor="bg-[#FEF8F9]"
              iconBgColor="bg-[#FFE8EB]"
              href="/export"
            />
            <DashboardCard
              title="Stock"
              description="7477 items"
              icon={
                <svg className="h-6 w-6 text-[#6BFF6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              bgColor="bg-[#F8FEF9]"
              iconBgColor="bg-[#E8FFE8]"
              href="/stock"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  href: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, bgColor, iconBgColor, href }) => {
  return (
    <Link to={href} className={`p-4 ${bgColor} rounded-lg hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
};

export default HomePage;


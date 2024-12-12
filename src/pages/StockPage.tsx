import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchItems } from '../store/slices/itemsSlice';
import { RootState, AppDispatch } from '../store/store';

const categories = [
  { name: 'Home', items: 2318, icon: '📱' },
  { name: 'Electrical', items: 1890, icon: '⚡' },
  { name: 'Furniture', items: 712, icon: '🪑' },
  { name: 'Beauty', items: 1327, icon: '💄' },
  { name: 'Women', items: 4922, icon: '👗' },
  { name: 'Men', items: 1247, icon: '👔' },
];

const StockPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 px-5 md:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-blue-500">
            <ChevronLeft className="h-10 w-10 bg-[#eeeeee]/70 p-2 rounded-lg" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Stock</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search product or item..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <StockSummary label="Total Items" value="16,436" />
          <StockSummary label="Categories" value="8" valueColor="text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StockSummary: React.FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = "text-black" }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
};

const CategoryCard: React.FC<{ category: { name: string; items: number; icon: string } }> = ({ category }) => {
  return (
    <Link
      to={`/stock/${category.name.toLowerCase()}`}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
          {category.icon}
        </div>
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-sm text-blue-500">{category.items} items</p>
        </div>
      </div>
      <div className="flex items-center text-red-400">
        <span className="text-sm mr-2">Check Details</span><ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
};

export default StockPage;


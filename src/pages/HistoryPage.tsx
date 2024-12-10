import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const recentScans = [
  {
    id: 1,
    name: 'Silk Sundress',
    itemRef: 'PT234-C5878-5',
    stock: 115,
    image: '/placeholder.svg',
    quantity: 1,
    brand: 'Arnotts'
  },
  {
    id: 2,
    name: 'Smart Goggles',
    itemRef: 'E46-T68',
    stock: 35,
    image: '/placeholder.svg',
    quantity: 1,
    brand: 'Arnotts'
  },
  {
    id: 3,
    name: 'Chandelier',
    itemRef: '10744D-5642Z',
    stock: 5,
    image: '/placeholder.svg',
    quantity: 1,
    brand: 'Arnotts'
  }
];

const HistoryPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 px-5 md:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-blue-500">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Recent Scans</h1>
        </div>
        <div className="space-y-4 mb-8">
          {recentScans.map((item) => (
            <ScannedItem key={item.id} item={item} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items to be added</h2>
          <span className="text-blue-500 text-xl font-semibold">7</span>
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl">
          Update
        </button>
      </div>
    </div>
  );
};

const ScannedItem: React.FC<{ item: typeof recentScans[0] }> = ({ item }) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{item.brand}</p>
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-xs text-gray-400">Item Ref: {item.itemRef}</p>
        <p className="text-xs text-blue-500">{item.stock} items in stock</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400">
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-sm">{item.quantity}</span>
        <button className="text-blue-500">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;


import React, { useState, useEffect } from 'react';
import { Plus, Minus, ChevronLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScanHistory } from '../context/ScanHistoryContext';

const UpdateModal: React.FC<{ isOpen: boolean; onClose: () => void; count: number }> = ({ 
  isOpen, 
  onClose,
  count 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl w-[75%] max-w-md p-6 relative transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center gap-8 p-8">
          <h2 className={`text-xl transition-transform duration-300 delay-150
            ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
          >
            <span className="text-blue-500">{count}</span> items updated successfully!
          </h2>
          
          <div className={`w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center
            transition-all duration-300 delay-300
            ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          >
            <div className="w-8 h-8 text-blue-500">✓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scanHistory } = useScanHistory();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 px-5 md:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-blue-500">
            <ChevronLeft className="h-10 w-10 bg-[#eeeeee]/70 p-2 rounded-lg" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Recent Scans</h1>
        <div className="space-y-4 mb-8">
          {scanHistory.map((item) => (
            <ScannedItem key={item.barcode + item.timestamp.toISOString()} item={item} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items to be added</h2>
          <span className="text-blue-500 text-xl font-semibold">7</span>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl"
        >
          Update
        </button>
      </div>

      <UpdateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        count={7}
      />
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


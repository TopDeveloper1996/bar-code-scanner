import { useState } from 'react';
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom';
import EditStock from './EditStock';

interface StockItem {
  quantity: number;
  lastEdit: string;
  brand: string;
  name: string;
  itemRef: string;
  sku: string;
  image: string;
}

const ElectricalStockList: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const stockItems: StockItem[] = [
    {
      quantity: 50,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Therabody Go",
      itemRef: "E46-T88",
      sku: "THE-SMA",
      image: "/watch.png",
    },
    {
      quantity: 35,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Smart Goggles",
      itemRef: "E46-T78",
      sku: "AR-SMA",
      image: "/watch.png",
    },
    {
      quantity: 92,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Smart Watch",
      itemRef: "1234567890",
      sku: "SMA-WA",
      image: "/watch.png",
    },
    {
      quantity: 34,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Laptop iGoser",
      itemRef: "99771 - KKTOK",
      sku: "LAP-LAP",
      image: "/watch.png",
    },
    {
      quantity: 120,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Earpods ePdro",
      itemRef: "971 - EAITH",
      sku: "EAR-EAR",
      image: "/watch.png",
    },
    {
      quantity: 54,
      lastEdit: "10/08/2024",
      brand: "Arnotts",
      name: "Nintendo Switch",
      itemRef: "NSW-2024",
      sku: "NIN-SWT",
      image: "/watch.png",
    },
  ];

  const handleEditClick = (item: StockItem) => {
    setIsClosing(false);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
    }, 300); // Match this with your animation duration
  };

  return (
    <div className="p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/stock" className="text-blue-500">
            <ChevronLeft className="h-10 w-10 bg-[#eeeeee]/70 p-2 rounded-lg" />
          </Link>
        </div>
        <h1 className="mt-4 text-2xl font-semibold flex items-center gap-2">
          Stock <span className="text-gray-400">›</span>
          <span className="text-pink-400">Electrical</span>
        </h1>
        <p className="text-blue-500 font-medium">2318 items</p>
      </header>

      {/* Items List */}
      <div className="flex flex-col gap-3">
        {stockItems.map((item) => (
          <div key={item.sku} className="flex items-center bg-gray-100 rounded-xl p-2 shadow-sm">
            {/* Quantity Section */}
            <div className="min-w-[80px] text-center">
              <span className="text-blue-500 text-xl font-semibold">{item.quantity}</span>
              <span className="block text-xs text-gray-500">items</span>
              <span className="block text-[10px] text-gray-400">Last Edit: {item.lastEdit}</span>
            </div>

            {/* Item Details */}
            <div className="flex items-center flex-1 mx-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover mr-3"
              />
              <div>
                <span className="text-gray-500 text-sm">{item.brand}</span>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <span className="text-xs text-gray-400">Item Ref: {item.itemRef}</span>
              </div>
            </div>

            {/* SKU/Barcode */}
            <div className="text-center mr-4">
              <img src="/barcode.png" className="h-8 w-16 bg-gray-200 mb-1">
                {/* Barcode placeholder */}
              </img>
              <span className="text-xs text-gray-500">SKU: {item.sku}</span>
            </div>

            {/* Action Button */}
            <button 
              className="p-2 text-pink-400"
              onClick={() => handleEditClick(item)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* EditStock Drawer */}
      {selectedItem && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity ease-in-out duration-300 flex justify-center items-end
            ${isClosing ? 'bg-opacity-0' : 'bg-opacity-70'}`}
          onClick={handleClose}
        >
          <div 
            className={`bg-white w-full rounded-t-2xl transform transition-transform duration-300 ease-out
              ${isClosing ? 'translate-y-full' : 'animate-slide-up'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <EditStock
              barcode={selectedItem.itemRef}
              initialData={{
                title: selectedItem.name,
                barcode: selectedItem.itemRef,
                quantity: selectedItem.quantity,
                brand: selectedItem.brand,
                category: "Electrical",
                last_edit: selectedItem.lastEdit,
                image: selectedItem.image
              }}
              onClose={handleClose}
              onSave={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricalStockList; 
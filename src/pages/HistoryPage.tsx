import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, ChevronLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScanHistory } from '../context/ScanHistoryContext';
import { config } from '../config';
// import { ScannedProduct } from '../context/ScanHistoryContext';

interface ProductInfo {
  barcode: string;
  name: string;
  quantity: number;
  count: number;
  brand?: string;
  image?: string;
  title?: string;
  fromScan?: boolean;
}

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

export default function HistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scanHistory, clearScanHistory } = useScanHistory();
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalCount = useMemo(() => 
    products.reduce((sum, product) => sum + product.count, 0),
    [products]
  );

  const handleIncrement = (barcode: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.barcode === barcode 
          ? { ...product, count: product.count + 1 }
          : product
      )
    );
  };

  const handleDecrement = (barcode: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.barcode === barcode && product.count > 1
          ? { ...product, count: product.count - 1 }
          : product
      )
    );
  };

  useEffect(() => {
    let mounted = true;

    const fetchProductsInfo = async () => {
      if (scanHistory.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Process data before fetch
        const barcodeCount = scanHistory.reduce((acc, item) => {
          acc[item.barcode] = (acc[item.barcode] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const uniqueBarcodes = [...new Set(scanHistory.map(item => item.barcode))];
        const scanData = uniqueBarcodes.map(barcode => {
          const item = scanHistory.find(scan => scan.barcode === barcode);
          return {
            barcode,
            brand: item?.brand,
            title: item?.title,
            image: item?.image
          };
        });

        const response = await fetch(`${config.apiUrl}/api/scanned_products_info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            barcodes: uniqueBarcodes,
            scanHistory: scanData
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch products info');

        const data = await response.json();
        
        if (mounted) {
          setProducts(data.map((product: ProductInfo) => ({
            ...product,
            count: barcodeCount[product.barcode] || 1,
          })));
        }
      } catch (error) {
        console.error('Error fetching products info:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductsInfo();
    return () => { mounted = false; };
  }, [scanHistory]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/quantity_update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) throw new Error('Failed to update quantities');

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error updating quantities:', error);
    }
  };

  const handleModalClose = () => {
    clearScanHistory();
    setProducts([]);
    setIsModalOpen(false);
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            products.map((product) => (
              <div key={product.barcode} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.fromScan ? product.title : product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {product.fromScan ? product.title : product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Item Ref: {product.barcode}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.quantity || 0} items in stock
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleDecrement(product.barcode)}
                  >
                    <Minus size={18} className="text-gray-600" />
                  </button>
                  <span className="w-8 text-center">{product.count}</span>
                  <button 
                    className="p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleIncrement(product.barcode)}
                  >
                    <Plus size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Items to be added</h2>
          <span className="text-blue-500 text-xl font-semibold">{totalCount}</span>
        </div>

        <button 
          onClick={handleUpdate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl"
        >
          Update
        </button>
      </div>

      <UpdateModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        count={totalCount}
      />
    </div>
  );
}


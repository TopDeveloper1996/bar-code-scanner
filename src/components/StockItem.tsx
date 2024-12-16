import { useEffect, useState } from 'react';
import { Barcode, Edit2 } from 'lucide-react';
import EditStock from './EditStock';
import { config } from '../config';

interface StockItemProps {
  barcode: string;
}

interface ItemInfo {
  title: string;
  brand: string;
  quantity: number;
  last_edit: string;
  barcode: string;
  category: string;
  image?: string;
}

export default function StockItem({ barcode }: StockItemProps) {
  const [itemInfo, setItemInfo] = useState<ItemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchItemInfo = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/item_info/${barcode}`);
      if (!response.ok) throw new Error('Failed to fetch item info');
      const data = await response.json();
      setItemInfo(data);
    } catch (error) {
      console.error('Error fetching item info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItemInfo();
  }, [barcode]);

  const handleSave = () => {
    fetchItemInfo();
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-50 rounded-xl p-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  if (!itemInfo) return null;

  return (
    <>
      <div className="flex items-center justify-between bg-white rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-500">
              {itemInfo.quantity}
            </span>
            <span className="text-sm text-gray-500">items</span>
          </div>
          <div>
            <div className="text-sm text-gray-500">
              Last Edit: {itemInfo.last_edit}
            </div>
            <h3 className="font-medium">{itemInfo.brand}</h3>
            <h2 className="text-lg font-semibold">{itemInfo.title}</h2>
            <div className="text-sm text-gray-500 mt-1">
              Item Ref: {itemInfo.barcode}
            </div>
          </div>
        </div>
        <div className="text-gray-400">
          <Barcode size={24} />
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Edit2 className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {isEditing && itemInfo && (
        <EditStock
          barcode={barcode}
          initialData={itemInfo}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
} 
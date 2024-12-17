import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { config } from '../config';

interface EditStockProps {
  barcode: string;
  initialData: {
    title: string;
    barcode: string;
    quantity: number;
    last_edit: string;
    brand: string;
    category: string;
    image?: string;
  };
  onClose: () => void;
  onSave: () => void;
}

export default function EditStock({ barcode, initialData, onClose, onSave }: EditStockProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData.title,
    barcode: initialData.barcode,
    quantity: initialData.quantity,
    brand: initialData.brand,
    category: initialData.category,
    image: initialData.image
  });

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/api/stock/update/${barcode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          last_edit: new Date()
        }),
      });

      if (!response.ok) throw new Error('Failed to update stock item');
      
      onSave();
      handleClose();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out transform ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"/>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto">
          {/* Close button */}
          <button 
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Section */}
          <div className="relative h-40 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt={formData.title} 
                className="h-32 w-32 object-cover rounded-xl"
              />
            ) : (
              <div className="h-32 w-32 bg-gray-100 rounded-xl flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-500">Product Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Barcode</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">Items in Stock</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-sm text-gray-500">
              Last Edit: {initialData.last_edit}
            </div>
          </div>

          {/* Save Button */}
          <div className="p-4 bg-white border-t sticky bottom-0">
            <button
              type="submit"
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
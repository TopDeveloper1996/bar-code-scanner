interface EditStockProps {
  productTitle: string;
  itemRef: string;
  sku: string;
  itemsInStock: number;
  lastEdit: string;
  image: string;
  onSave?: () => void;
}

const EditStock: React.FC<EditStockProps> = ({
  productTitle,
  itemRef,
  sku,
  itemsInStock,
  lastEdit,
  image,
  onSave
}) => {
  return (
    <div className="p-6 flex flex-col gap-2">
      {/* Product Image */}
      <div className="relative w-24 h-24 mx-auto">
        <img 
          src={image} 
          alt={productTitle}
          className="w-full h-full rounded-2xl object-cover"
        />
        <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" 
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-1">
        <div>
          <label className="block text-sm text-gray-500">Product Title</label>
          <input 
            type="text" 
            value={productTitle}
            className="w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500">Item Ref</label>
          <input 
            type="text" 
            value={itemRef}
            className="w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500">SKU</label>
          <input 
            type="text" 
            value={sku}
            className="w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500">Items in Stock</label>
          <input 
            type="number" 
            value={itemsInStock}
            className="w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500">Last Edit</label>
          <input 
            type="text" 
            value={lastEdit}
            className="w-full border-b border-gray-200 pb-1 focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={onSave}
        className="mt-4 w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Save
      </button>
    </div>
  );
};

export default EditStock; 
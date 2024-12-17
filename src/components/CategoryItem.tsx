import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CategoryItemProps {
  originalCategoryName: string;
  categoryName: string;
  itemQuantity: number;
}

export default function CategoryItem({ originalCategoryName, categoryName, itemQuantity }: CategoryItemProps) {
  const navigate = useNavigate();
  const handleCheckDetails = () => {
    navigate(`/stock/${encodeURIComponent(originalCategoryName)}`);
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-blue-500">
              {itemQuantity}
            </span>
            <span className="text-gray-500">items</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900">{categoryName}</h2>
        </div>
      </div>
      <button
        onClick={handleCheckDetails}
        className="flex items-center gap-1 text-pink-400 hover:text-pink-500"
      >
        Check Details
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

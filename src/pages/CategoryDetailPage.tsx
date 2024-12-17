import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import CategoryItem from '../components/CategoryItem';
import StockItem from '../components/StockItem';
import { config } from '../config';

interface CategoryInfo {
  categories: {
    categoryName: string;
    sumQuantity: number;
  }[],
  items: string[],
  subTotalQuantity: number;
}

export default function CategoryDetailPage() {
  const { category } = useParams<{ category: string }>();
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${config.apiUrl}/api/category_info/${encodeURIComponent(category!)}`);
        if (!response.ok) throw new Error('Failed to fetch category info');
        const data = await response.json();
        setCategoryInfo(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchCategoryInfo();
    }
  }, [category]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <Link to="/stock" className="text-blue-500 hover:underline">
            Back to Stock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/stock" className="text-blue-500">
            <ChevronLeft className="h-10 w-10 bg-white p-2 rounded-lg" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Stock</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <span>{category}</span>
              <span>{categoryInfo?.subTotalQuantity || 0} items</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Show subcategories */}
          {categoryInfo?.categories.map((subCategory) => (
            <CategoryItem
              key={subCategory.categoryName}
              originalCategoryName={subCategory.categoryName}
              categoryName={subCategory.categoryName.split('>').pop() || ''}
              itemQuantity={subCategory.sumQuantity}
            />
          ))}

          {/* Show direct items */}
          {categoryInfo?.items.map((barcode) => (
            <StockItem key={barcode} barcode={barcode} />
          ))}
        </div>
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryItem from '../components/CategoryItem';
import { config } from '../config/index';

interface CategorySummary {
  name: string;
  itemCount: number;
}

export default function StockPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-blue-500">
            <ChevronLeft className="h-10 w-10 bg-white p-2 rounded-lg" />
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Stock</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product or item..."
            className="w-full pl-12 p-4 pr-12 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-24" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8 bg-white rounded-2xl p-4">
              <div>
                <h2 className="text-gray-500">Total Items</h2>
                <p className="text-2xl font-semibold">{totalItems}</p>
              </div>
              <div>
                <h2 className="text-gray-500">Categories</h2>
                <p className="text-2xl font-semibold text-blue-500">{categories.length}</p>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.name}
                  categoryName={category.name}
                  itemQuantity={category.itemCount}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


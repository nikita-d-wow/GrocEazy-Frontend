import { useEffect, useState } from 'react';
import type { Category } from '../../types/Category';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface MobileCategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export default function MobileCategorySidebar({
  selectedCategory,
  onSelectCategory,
}: MobileCategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get('/api/categories')
      .then((res) => {
        // Handle both response formats: { categories: [...] } or just [...]
        const categoriesData = Array.isArray(res.data)
          ? res.data
          : res.data.categories || [];
        setCategories(categoriesData);
      })
      .catch((err) => {
        toast.error('Failed to fetch categories:', err);
        setCategories([]); // Set empty array on error
      });
  }, []);

  return (
    <div className="w-24 flex-shrink-0 bg-white border-r border-gray-100 h-[calc(100vh-64px)] overflow-y-auto sticky top-16 pb-20 no-scrollbar">
      <div className="flex flex-col">
        <button
          onClick={() => onSelectCategory(null)}
          className={`p-3 text-xs font-medium text-center border-b border-gray-50 transition-colors ${
            selectedCategory === null
              ? 'bg-green-50 text-green-700 border-l-4 border-l-green-600'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <div className="mb-1 text-2xl">🏷️</div>
          All
        </button>

        {categories &&
          categories.length > 0 &&
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={`p-3 text-xs font-medium text-center border-b border-gray-50 transition-colors ${
                selectedCategory === category._id
                  ? 'bg-green-50 text-green-700 border-l-4 border-l-green-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="mb-1 w-10 h-10 mx-auto rounded-full bg-gray-100 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full text-lg">
                    🥗
                  </span>
                )}
              </div>
              <span className="line-clamp-2">{category.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

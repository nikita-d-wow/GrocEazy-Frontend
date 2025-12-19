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
        const categoriesData = (
          Array.isArray(res.data) ? res.data : res.data.categories || []
        ).filter((cat: Category) => cat.isActive !== false);
        setCategories(categoriesData);
      })
      .catch((err) => {
        toast.error('Failed to fetch categories:', err);
        setCategories([]); // Set empty array on error
      });
  }, []);

  return (
    <div className="flex gap-4 px-4 min-w-full">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl transition-all w-20 border-2 ${
          selectedCategory === null
            ? 'bg-green-100 text-green-700 border-green-600 scale-105'
            : 'bg-gray-50 text-gray-500 border-transparent'
        }`}
      >
        <div className="text-2xl mb-1">🏷️</div>
        <span className="text-xs font-medium truncate w-full text-center">
          All
        </span>
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-xl transition-all w-20 border-2 ${
            selectedCategory === category._id
              ? 'bg-green-100 text-green-700 border-green-600 scale-105'
              : 'bg-gray-50 text-gray-500 border-transparent'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden mb-1 shadow-sm">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="flex items-center justify-center h-full text-lg">
                🥗
              </span>
            )}
          </div>
          <span className="text-xs font-medium truncate w-full text-center">
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
}

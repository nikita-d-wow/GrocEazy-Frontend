import type { FC, ChangeEvent } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchCategories } from '../../redux/actions/categoryActions';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import type { Category } from '../../types/Category';

interface FilterState {
  selectedCategory: string | null;
  priceRange: [number, number];
  sortBy: string;
}

interface Props {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const ProductFilters: FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useAppDispatch();

  const { categories, loading } = useSelector((state: any) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    setFilters({
      ...filters,
      selectedCategory:
        filters.selectedCategory === categoryId ? null : categoryId,
    });
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: 0 | 1
  ) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = Number(e.target.value);
    setFilters({ ...filters, priceRange: newRange });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-20">
      <h3 className="font-bold text-gray-800 mb-6 text-lg border-b pb-2">
        Filters
      </h3>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
          Categories
        </h4>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            <li
              className={`cursor-pointer text-sm py-1 px-2 rounded-md transition-colors ${
                !filters.selectedCategory
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setFilters({ ...filters, selectedCategory: null })}
            >
              All Categories
            </li>

            {categories.map((category: Category) => (
              <li
                key={category.id}
                className={`cursor-pointer text-sm py-1 px-2 rounded-md transition-colors ${
                  filters.selectedCategory === category.id
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
          Price Range
        </h4>

        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
          Sort By
        </h4>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-white"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;

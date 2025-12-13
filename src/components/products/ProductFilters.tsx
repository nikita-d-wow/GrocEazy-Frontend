import type { FC } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchCategories } from '../../redux/actions/categoryActions';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import type { Category } from '../../types/Category';
import PriceRangeSlider from '../common/PriceRangeSlider';

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

  // Filter out deleted categories
  const visibleCategories = (categories || []).filter(
    (cat: Category) => !cat.isDeleted
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-20">
      <h3 className="font-bold text-gray-800 mb-6 text-lg border-b pb-3">
        Filters
      </h3>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
          Categories
        </h4>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {/* All Categories Option */}
            <li
              className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all duration-200 ${
                !filters.selectedCategory
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setFilters({ ...filters, selectedCategory: null })}
            >
              All Categories
            </li>

            {/* Category List */}
            {visibleCategories.map((category: Category) => (
              <li
                key={category._id}
                className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all duration-200 ${
                  filters.selectedCategory === category._id
                    ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          Price Range
        </h4>

        <PriceRangeSlider
          min={0}
          max={1000}
          value={filters.priceRange}
          onChange={(newRange) =>
            setFilters({ ...filters, priceRange: newRange })
          }
        />
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
          Sort By
        </h4>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-50 bg-white transition-all cursor-pointer"
        >
          <option value="featured"> Featured</option>
          <option value="price_asc"> Price: Low to High</option>
          <option value="price_desc"> Price: High to Low</option>
          <option value="newest"> Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;

import type { FC } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import type { Category } from '../../types/Category';
import PriceRangeSlider from '../common/PriceRangeSlider';
import FilterSelect from '../common/FilterSelect';
import type { RootState } from '../../redux/store';

export interface FilterState {
  selectedCategory: string | null;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: string;
  stockStatus?: string;
}

interface Props {
  filters: FilterState;
  setFilters: (updates: FilterState) => void;
}

const ProductFilters: FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useSelector(
    (state: RootState) => state.category
  );

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

  const visibleCategories = [...(categories || [])]
    .filter((cat: Category) => !cat.isDeleted)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full bg-card rounded-xl shadow-sm border border-border p-6 h-fit sticky top-20">
      <h3 className="font-bold text-text mb-6 text-lg">Filters</h3>

      <div className="mb-8">
        <h4 className="font-semibold text-muted-text mb-4 text-sm uppercase tracking-wide">
          Categories
        </h4>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            <li
              className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all duration-200 ${
                !filters.selectedCategory
                  ? 'bg-primary-light text-primary font-semibold shadow-sm'
                  : 'text-muted-text hover:bg-muted hover:text-text'
              }`}
              onClick={() =>
                setFilters({
                  ...filters,
                  selectedCategory: null,
                })
              }
            >
              All Categories
            </li>

            {visibleCategories.map((category: Category) => (
              <li
                key={category._id}
                className={`cursor-pointer text-sm py-2 px-3 rounded-lg transition-all duration-200 ${
                  filters.selectedCategory === category._id
                    ? 'bg-primary-light text-primary font-semibold shadow-sm'
                    : 'text-muted-text hover:bg-muted hover:text-text'
                }`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h4 className="font-semibold text-muted-text mb-3 text-sm uppercase tracking-wide">
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

      <div>
        <FilterSelect
          label="Sort By"
          value={filters.sortBy}
          onChange={(val: string) => setFilters({ ...filters, sortBy: val })}
          options={[
            { value: 'featured', label: 'Featured' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
            { value: 'newest', label: 'Newest Arrivals' },
          ]}
        />
      </div>
    </div>
  );
};

export default ProductFilters;

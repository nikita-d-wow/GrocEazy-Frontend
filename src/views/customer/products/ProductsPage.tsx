import type { FC } from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Pagination from '../../../components/common/Pagination';

import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters, {
  type FilterState,
} from '../../../components/products/ProductFilters';
import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import {
  fetchProducts,
  searchProductsGlobally,
} from '../../../redux/actions/productActions';
import { fetchWishlist } from '../../../redux/actions/wishlistActions';
import { setSearchQuery } from '../../../redux/reducers/productReducer';

import type { RootState } from '../../../redux/store';

const ProductsPage: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    products,
    loading,
    error,
    pagination,
    searchQuery,
    searchResults,
    searchLoading,
  } = useSelector((state: RootState) => state.product);
  const { user } = useSelector((state: RootState) => state.auth);

  /* ---------------- URL STATE ---------------- */
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedCategory = queryParams.get('category');

  /* ---------------- LOCAL FILTERS ---------------- */
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    sortBy: 'newest',
  });

  const ITEMS_PER_PAGE = 16;
  const page = useMemo(
    () => parseInt(queryParams.get('page') || '1', 10),
    [queryParams]
  );

  const setPage = (p: number) => {
    const params = new URLSearchParams(location.search);
    params.set('page', p.toString());
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  /* ---------------- DATA FETCH ---------------- */
  useEffect(() => {
    dispatch(
      fetchProducts(
        page,
        ITEMS_PER_PAGE,
        undefined, // search no longer passed to backend
        selectedCategory || undefined,
        localFilters.priceRange[0],
        localFilters.priceRange[1],
        localFilters.sortBy
      )
    );
  }, [
    dispatch,
    page,
    selectedCategory,
    localFilters.priceRange,
    localFilters.sortBy,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchProductsGlobally(searchQuery));
    }, 300); // Small debounce for global search
    return () => clearTimeout(timer);
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  /* ---------------- RESET PAGE ON FILTER CHANGE - Handled in handleUpdateFilters ---------------- */

  const totalPages = pagination?.pages || 1;
  const totalResults = pagination?.total || products.length;

  const isSearching = searchQuery.trim().length > 0;
  const displayedProducts = isSearching ? searchResults : products;
  const isDataLoading = isSearching
    ? searchLoading
    : loading && products.length === 0;

  const allFilters = useMemo(
    () => ({
      selectedCategory,
      searchQuery,
      ...localFilters,
    }),
    [selectedCategory, searchQuery, localFilters]
  );

  /* ---------------- HANDLERS ---------------- */
  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    const params = new URLSearchParams(location.search);
    params.set('page', '1'); // Reset to first page on filter change

    if (updates.selectedCategory !== undefined) {
      // Clear global search when category is changed to avoid conflict
      dispatch(setSearchQuery(''));

      if (updates.selectedCategory) {
        params.set('category', updates.selectedCategory);
      } else {
        params.delete('category');
      }
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    if (updates.priceRange || updates.sortBy) {
      setLocalFilters((prev) => ({ ...prev, ...updates }));
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const delay = updates.priceRange ? 1000 : 0;

    scrollTimeoutRef.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollTimeoutRef.current = null;
    }, delay);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 animate-fadeIn">
        {error}
      </div>
    );
  }

  return (
    <div className="relative bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 relative z-10 transition-all duration-300">
        <div className="bg-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Explore Products
              </h1>
              <p className="text-gray-500 mt-1">
                Find the best fresh produce and groceries.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-600 font-medium">
                {isSearching
                  ? `${searchResults.length} matches found globally`
                  : `${totalResults} results found`}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative items-start">
            {/* ---------------- MOBILE CATEGORY SIDEBAR ---------------- */}
            <div className="lg:hidden w-full overflow-x-auto overflow-y-visible py-2 bg-white sticky top-[65px] z-30 border-b border-gray-100 no-scrollbar">
              <MobileCategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={(id) =>
                  handleUpdateFilters({ selectedCategory: id })
                }
              />
            </div>

            {/* ---------------- DESKTOP FILTER SIDEBAR ---------------- */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-[69px]">
              <ProductFilters
                filters={allFilters}
                setFilters={(updates) => handleUpdateFilters(updates)}
              />
            </aside>

            {/* ---------------- PRODUCT GRID ---------------- */}
            <main className="flex-1 w-full">
              {isDataLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <ProductGrid products={displayedProducts} />
                  {!isSearching && totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                          setPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Pagination from '../../../components/common/Pagination';

import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters, {
  type FilterState,
} from '../../../components/products/ProductFilters';
import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import { fetchWishlist } from '../../../redux/actions/wishlistActions';

import type { RootState } from '../../../redux/store';

const ProductsPage: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { user } = useSelector((state: RootState) => state.auth);

  /* ---------------- URL STATE ---------------- */
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedCategory = queryParams.get('category');
  const searchQuery = queryParams.get('search') || '';

  /* ---------------- LOCAL FILTERS ---------------- */
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    sortBy: 'newest',
  });
  const [page, setPage] = useState(1);

  const allFilters = useMemo(
    () => ({
      selectedCategory,
      searchQuery,
      ...localFilters,
    }),
    [selectedCategory, searchQuery, localFilters]
  );

  /* ---------------- DERIVED STATE RESET ---------------- */
  const [prevSearch, setPrevSearch] = useState(searchQuery);
  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  const [prevLocalFilters, setPrevLocalFilters] = useState(localFilters);

  if (
    searchQuery !== prevSearch ||
    selectedCategory !== prevCategory ||
    localFilters !== prevLocalFilters
  ) {
    setPage(1);
    setPrevSearch(searchQuery);
    setPrevCategory(selectedCategory);
    setPrevLocalFilters(localFilters);
  }

  /* ---------------- DATA FETCH ---------------- */
  useEffect(() => {
    // Fetch all products once to allow fast client-side filtering
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  /* ---------------- CLIENT-SIDE FILTER LOGIC ---------------- */
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isActive !== false);

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const words = query.split(/\s+/);

      // Multi-word matching logic (Matches either name OR description)
      result = result.filter((p) => {
        const target = `${p.name} ${p.description || ''}`.toLowerCase();
        return words.every((word) => target.includes(word));
      });
    }

    if (selectedCategory) {
      result = result.filter((p) => {
        const catId =
          typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
        return String(catId) === selectedCategory;
      });
    }

    // Price Filter
    result = result.filter(
      (p) =>
        p.price >= localFilters.priceRange[0] &&
        p.price <= localFilters.priceRange[1]
    );

    // Sorting
    if (localFilters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (localFilters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (localFilters.sortBy === 'newest') {
      result = [...result].reverse(); // Assuming original is chronologically sorted
    }

    return result;
  }, [products, searchQuery, selectedCategory, localFilters]);

  const ITEMS_PER_PAGE = 16;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  /* ---------------- FILTER HANDLER ---------------- */
  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    const params = new URLSearchParams(location.search);

    if (updates.selectedCategory !== undefined) {
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                {filteredProducts.length} results found
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
              {loading && products.length === 0 ? (
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
                  <ProductGrid products={paginatedProducts} />
                  {totalPages > 1 && (
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

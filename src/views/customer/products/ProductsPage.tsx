import type { FC } from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters, {
  type FilterState,
} from '../../../components/products/ProductFilters';
import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';
import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import { fetchWishlist } from '../../../redux/actions/wishlistActions';

import type { Product } from '../../../types/Product';
import type { RootState } from '../../../redux/store';

interface CategoryData {
  _id: string;
  name: string;
}

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
    priceRange: [0, 1000] as [number, number],
    sortBy: 'featured',
  });

  const allFilters = useMemo(
    () => ({
      selectedCategory,
      searchQuery,
      ...localFilters,
    }),
    [selectedCategory, searchQuery, localFilters]
  );

  /* ---------------- PAGINATION ---------------- */
  const [displayCount, setDisplayCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /* ---------------- SAFE DATA FETCH ---------------- */
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {
    if (!loadMoreRef.current || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading]);

  /* ---------------- FILTER LOGIC (UNCHANGED) ---------------- */
  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => p.isActive !== false);

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const words = query.split(/\s+/);

      const nameMatches = result.filter((p) =>
        words.every((w) => p.name.toLowerCase().includes(w))
      );

      result =
        nameMatches.length > 0
          ? nameMatches
          : result.filter((p) =>
              words.every(
                (w) =>
                  p.name.toLowerCase().includes(w) ||
                  p.description?.toLowerCase().includes(w)
              )
            );
    } else if (selectedCategory) {
      result = result.filter((p) => {
        const catId =
          typeof p.categoryId === 'object'
            ? (p.categoryId as CategoryData)._id
            : p.categoryId;
        return String(catId) === selectedCategory;
      });
    }

    result = result.filter(
      (p) =>
        p.price >= localFilters.priceRange[0] &&
        p.price <= localFilters.priceRange[1]
    );

    if (localFilters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (localFilters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (localFilters.sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [products, searchQuery, selectedCategory, localFilters]);

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

    setDisplayCount(20);
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
                  <ProductGrid
                    products={filteredProducts.slice(0, displayCount)}
                  />
                  {displayCount < filteredProducts.length && (
                    <div ref={loadMoreRef} className="py-12 text-center" />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      <FloatingCartBar />
    </div>
  );
};

export default ProductsPage;

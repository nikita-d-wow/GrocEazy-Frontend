import type { FC } from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters from '../../../components/products/ProductFilters';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import { fetchWishlist } from '../../../redux/actions/wishlistActions';
import type { Product } from '../../../types/Product';
import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';
import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';
import { useLocation } from 'react-router-dom';
import type { RootState } from '../../../redux/store';

const ProductsPage: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    return {
      selectedCategory: categoryParam || null,
      searchQuery: searchParam || '',
      priceRange: [0, 1000] as [number, number],
      sortBy: 'featured',
    };
  });

  // Infinite scroll state
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sync state with URL changes (for search/category from Header/Global nav)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || null;
    const searchParam = params.get('search') || '';

    // Only update if state is actually different to avoid cascading renders
    if (
      filters.selectedCategory !== categoryParam ||
      filters.searchQuery !== searchParam
    ) {
      // Use setTimeout to move the state update out of the effect's synchronous execution
      // to avoid react-hooks/set-state-in-effect warnings and cascading renders
      const timer = setTimeout(() => {
        setFilters((prev) => ({
          ...prev,
          selectedCategory: categoryParam,
          searchQuery: searchParam,
        }));
        setDisplayCount(20);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.search, filters.selectedCategory, filters.searchQuery]);

  // Update URL when filters change internally (e.g. Price, Sort)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Only update URL if state is actually different from current URL
    // to avoid infinite loops since we also have a listener above
    let changed = false;

    if (filters.selectedCategory !== (params.get('category') || null)) {
      if (filters.selectedCategory) {
        params.set('category', filters.selectedCategory);
      } else {
        params.delete('category');
      }
      changed = true;
    }

    if (filters.searchQuery !== (params.get('search') || '')) {
      if (filters.searchQuery) {
        params.set('search', filters.searchQuery);
      } else {
        params.delete('search');
      }
      changed = true;
    }

    if (changed) {
      const newUrl = `${location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [
    filters.selectedCategory,
    filters.searchQuery,
    location.pathname,
    location.search,
  ]);

  useEffect(() => {
    dispatch(fetchProducts());
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observerTarget = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setDisplayCount((prev) => prev + 20);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [isLoadingMore, loading]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => p.isActive !== false);

    // Filter by Category
    if (filters.selectedCategory) {
      result = result.filter((p: Product) => {
        const productCategoryId =
          typeof p.categoryId === 'object' && p.categoryId !== null
            ? (p.categoryId as any)._id
            : p.categoryId;
        // Ensure string comparison
        return String(productCategoryId) === String(filters.selectedCategory);
      });
    }

    // Filter by Search Query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((p: Product) => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        return nameMatch || descMatch;
      });
    }

    // Filter by Price
    result = result.filter(
      (p: Product) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    if (filters.sortBy === 'price_asc') {
      result.sort((a: Product, b: Product) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a: Product, b: Product) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.reverse();
    } else if (filters.sortBy === 'deals') {
      // Sort by featured for now (can be enhanced with discount field later)
      result.sort((a: Product, b: Product) => (a.price < b.price ? -1 : 1));
    } else if (filters.sortBy === 'rating') {
      // Sort by rating when available (placeholder for now)
      result.sort((a: Product, b: Product) => (b.price > a.price ? -1 : 1));
    }
    // 'featured' is default/original order

    return result;
  }, [products, filters]);

  // Slice for infinite scroll
  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  // Wrapper to reset display count when filters change
  const handleSetFilters = (newFilters: {
    selectedCategory: string | null;
    searchQuery: string;
    priceRange: [number, number];
    sortBy: string;
  }) => {
    setFilters(newFilters);
    setDisplayCount(20);
  };

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
          <p className="text-gray-500 mt-1">
            Find the best fresh produce and groceries.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-gray-600 font-medium">
            {filteredProducts.length === 0 && filters.searchQuery
              ? 'No products available'
              : `${filteredProducts.length} results found`}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative items-start">
        {/* Mobile Category Sidebar (Horizontal Scroll) */}
        <div className="lg:hidden w-full overflow-x-auto pb-4 bg-white sticky top-[72px] z-30 border-b border-gray-100 no-scrollbar">
          <MobileCategorySidebar
            selectedCategory={filters.selectedCategory}
            onSelectCategory={(id) =>
              handleSetFilters({ ...filters, selectedCategory: id })
            }
          />
        </div>

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <ProductFilters filters={filters} setFilters={handleSetFilters} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full">
          {' '}
          {/* pl-32 for extra sidebar offset */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Reset Filters / Results header for mobile */}
              <div className="lg:hidden mb-4 flex justify-between items-center pr-4">
                <h2 className="text-lg font-bold">
                  {filters.selectedCategory
                    ? (
                        products.find((p: Product) => {
                          const catId =
                            typeof p.categoryId === 'object'
                              ? (p.categoryId as any)._id
                              : p.categoryId;
                          return String(catId) === filters.selectedCategory;
                        })?.categoryId as any
                      )?.name
                    : 'All Products'}
                </h2>
                <span className="text-xs text-gray-500">
                  {filteredProducts.length} items
                </span>
              </div>

              <ProductGrid products={displayedProducts} />

              {/* Infinite Scroll Trigger & Loading Indicator */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-12 text-center">
                  {isLoadingMore && (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500 font-medium text-sm">
                        Discovering more products...
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* End of List Message */}
              {!hasMore && filteredProducts.length > 20 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500 font-medium">
                    ✓ You've reached the end
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <FloatingCartBar />
    </div>
  );
};

export default ProductsPage;

import type { FC } from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters from '../../../components/products/ProductFilters';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import type { Product } from '../../../types/Product';

const ProductsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useSelector(
    (state: any) => state.product
  );

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    return {
      selectedCategory: categoryParam || null,
      priceRange: [0, 1000] as [number, number],
      sortBy: 'featured',
    };
  });

  // Infinite scroll state
  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update URL when category filter changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (filters.selectedCategory) {
      params.set('category', filters.selectedCategory);
    } else {
      params.delete('category');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters.selectedCategory]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
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

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [isLoadingMore, loading]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (filters.selectedCategory) {
      result = result.filter((p: Product) => {
        const productCategoryId =
          typeof p.categoryId === 'object' && p.categoryId !== null
            ? (p.categoryId as any)._id
            : p.categoryId;
        return productCategoryId === filters.selectedCategory;
      });
    }

    // Filter by Price
    result = result.filter(
      (p: Product) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.reverse();
    } else if (filters.sortBy === 'deals') {
      // Sort by featured for now (can be enhanced with discount field later)
      result.sort((a, b) => (a.price < b.price ? -1 : 1));
    } else if (filters.sortBy === 'rating') {
      // Sort by rating when available (placeholder for now)
      result.sort((a, b) => (b.price > a.price ? -1 : 1));
    }
    // 'featured' is default/original order

    return result;
  }, [products, filters]);

  // Slice for infinite scroll
  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  // Wrapper to reset display count when filters change
  const handleSetFilters = (newFilters: any) => {
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
            {filteredProducts.length} results found
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters filters={filters} setFilters={handleSetFilters} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={displayedProducts} />

              {/* Infinite Scroll Trigger & Loading Indicator */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-8 text-center">
                  {isLoadingMore && (
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-6 h-6 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-600 font-medium">
                        Loading more products...
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
    </div>
  );
};

export default ProductsPage;

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
import { useLocation, useNavigate } from 'react-router-dom';
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

  // 1. DERIVE category and search directly from URL (Prevents infinite loops)
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedCategory = queryParams.get('category') || null;
  const searchQuery = queryParams.get('search') || '';

  // 2. Local state for filters NOT in the URL
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    sortBy: 'featured',
  });

  // Combine for children components
  const allFilters = useMemo(
    () => ({
      selectedCategory,
      searchQuery,
      ...localFilters,
    }),
    [selectedCategory, searchQuery, localFilters]
  );

  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observerTarget = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + 20);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
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

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter((w) => w.length > 0);

      // 1. Try matching only in names first (High precision)
      const nameMatches = result.filter((p: Product) => {
        const name = p.name.toLowerCase();
        return queryWords.every((word) => name.includes(word));
      });

      if (nameMatches.length > 0) {
        result = nameMatches;
      } else {
        // 2. If no name matches, fallback to name + description (Broad search)
        // But only for queries that are long enough to be meaningful
        result = result.filter((p: Product) => {
          const name = p.name.toLowerCase();
          const desc = p.description?.toLowerCase() || '';
          return queryWords.every(
            (word) => name.includes(word) || desc.includes(word)
          );
        });
      }

      // Sort: Exact name matches and starts-with first
      result.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aExact = aName === query ? 2 : aName.startsWith(query) ? 1 : 0;
        const bExact = bName === query ? 2 : bName.startsWith(query) ? 1 : 0;

        if (aExact !== bExact) {
          return bExact - aExact;
        }

        // Secondary sort: contains in name
        const aInName = aName.includes(query) ? 1 : 0;
        const bInName = bName.includes(query) ? 1 : 0;
        return bInName - aInName;
      });
    } else if (selectedCategory) {
      result = result.filter((p: Product) => {
        const catId =
          typeof p.categoryId === 'object' && p.categoryId !== null
            ? (p.categoryId as unknown as CategoryData)._id
            : p.categoryId;
        return String(catId) === String(selectedCategory);
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

  // 3. Centralized update handler
  const handleUpdateFilters = (updates: any) => {
    const newParams = new URLSearchParams(location.search);

    // If searching, remove category. If picking category, remove search.
    if (updates.searchQuery !== undefined) {
      if (updates.searchQuery.trim() !== '') {
        newParams.set('search', updates.searchQuery);
        newParams.delete('category');
      } else {
        newParams.delete('search');
      }
    }

    if (updates.selectedCategory !== undefined) {
      if (updates.selectedCategory) {
        newParams.set('category', updates.selectedCategory);
        newParams.delete('search');
      } else {
        newParams.delete('category');
      }
    }

    // Sync to URL
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });

    // Sync Local State
    if (updates.priceRange || updates.sortBy) {
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: updates.priceRange || prev.priceRange,
        sortBy: updates.sortBy || prev.sortBy,
      }));
    }

    setDisplayCount(20);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);

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

      <div className="flex flex-col lg:flex-row gap-8 relative items-start">
        {/* Mobile View Sidebar Re-Added */}
        <div className="lg:hidden w-full overflow-x-auto overflow-y-visible py-2 bg-white border-b border-gray-100 no-scrollbar">
          <MobileCategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(id) =>
              handleUpdateFilters({ selectedCategory: id, searchQuery: '' })
            }
          />
        </div>

        {/* Desktop View Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <ProductFilters
            filters={allFilters}
            setFilters={(updates: any) => handleUpdateFilters(updates)}
          />
        </aside>

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
              <ProductGrid products={displayedProducts} />
              {displayCount < filteredProducts.length && (
                <div ref={loadMoreRef} className="py-12 text-center">
                  {isLoadingMore && (
                    <div className="animate-spin border-4 border-green-600 border-t-transparent rounded-full w-8 h-8 mx-auto" />
                  )}
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

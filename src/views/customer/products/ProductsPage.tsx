// import type { FC } from 'react';
// import { useEffect, useState, useMemo, useRef } from 'react';
// import ProductGrid from '../../../components/products/ProductGrid';
// import ProductFilters from '../../../components/products/ProductFilters';
// import { useSelector } from 'react-redux';
// import { useAppDispatch } from '../../../redux/actions/useDispatch';
// import { fetchProducts } from '../../../redux/actions/productActions';
// import { fetchWishlist } from '../../../redux/actions/wishlistActions';
// import type { Product } from '../../../types/Product';
// import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';
// import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import type { RootState } from '../../../redux/store';

// const ProductsPage: FC = () => {
//   const dispatch = useAppDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { products, loading, error } = useSelector(
//     (state: RootState) => state.product
//   );
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [filters, setFilters] = useState(() => {
//     const params = new URLSearchParams(location.search);
//     return {
//       selectedCategory: params.get('category') || null,
//       searchQuery: params.get('search') || '',
//       priceRange: [0, 1000] as [number, number],
//       sortBy: 'featured',
//     };
//   });

//   const [displayCount, setDisplayCount] = useState(20);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const loadMoreRef = useRef<HTMLDivElement>(null);

//   // 1. Sync state FROM URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const categoryParam = params.get('category') || null;
//     const searchParam = params.get('search') || '';

//     if (
//       filters.selectedCategory !== categoryParam ||
//       filters.searchQuery !== searchParam
//     ) {
//       setFilters((prev) => ({
//         ...prev,
//         selectedCategory: categoryParam,
//         searchQuery: searchParam,
//       }));
//       setDisplayCount(20);
//     }
//   }, [location.search, filters.selectedCategory, filters.searchQuery]);

//   // 2. Sync URL FROM state
//   const updateURL = (newFilters: typeof filters) => {
//     const params = new URLSearchParams();
//     if (newFilters.selectedCategory) params.set('category', newFilters.selectedCategory);
//     if (newFilters.searchQuery) params.set('search', newFilters.searchQuery);

//     const newSearch = params.toString();
//     const currentSearch = new URLSearchParams(location.search).toString();

//     if (newSearch !== currentSearch) {
//       navigate(`${location.pathname}?${newSearch}`, { replace: true });
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchProducts());
//     if (user) dispatch(fetchWishlist());
//   }, [dispatch, user]);

//   // Infinite scroll
//   useEffect(() => {
//     const observerTarget = loadMoreRef.current;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isLoadingMore && !loading) {
//           setIsLoadingMore(true);
//           setTimeout(() => {
//             setDisplayCount((prev) => prev + 20);
//             setIsLoadingMore(false);
//           }, 300);
//         }
//       },
//       { threshold: 0.1, rootMargin: '100px' }
//     );
//     if (observerTarget) observer.observe(observerTarget);
//     return () => { if (observerTarget) observer.unobserve(observerTarget); };
//   }, [isLoadingMore, loading]);

//   const filteredProducts = useMemo(() => {
//     let result = products.filter((p: Product) => p.isActive !== false);

//     // FILTER LOGIC: If there is a search query, we prioritize it over the category
//     // This allows searching across ALL categories when the user types.
//     if (filters.searchQuery) {
//       const query = filters.searchQuery.toLowerCase();
//       result = result.filter((p: Product) => {
//         const nameMatch = p.name.toLowerCase().includes(query);
//         const descMatch = p.description?.toLowerCase().includes(query);
//         return nameMatch || descMatch;
//       });
//     } else if (filters.selectedCategory) {
//       // Only filter by category if NOT searching
//       result = result.filter((p: Product) => {
//         const productCategoryId =
//           typeof p.categoryId === 'object' && p.categoryId !== null
//             ? (p.categoryId as any)._id
//             : p.categoryId;
//         return String(productCategoryId) === String(filters.selectedCategory);
//       });
//     }

//     // Price Filter
//     result = result.filter(
//       (p: Product) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
//     );

//     // Sort Logic
//     if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
//     else if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
//     else if (filters.sortBy === 'newest') result.reverse();

//     return result;
//   }, [products, filters]);

//   const displayedProducts = filteredProducts.slice(0, displayCount);
//   const hasMore = displayCount < filteredProducts.length;

//   const handleSetFilters = (newFilters: typeof filters) => {
//     // FIX: If the user is typing a new search query, clear the category
//     if (newFilters.searchQuery !== filters.searchQuery && newFilters.searchQuery !== '') {
//         newFilters.selectedCategory = null;
//     }

//     setFilters(newFilters);
//     setDisplayCount(20);
//     updateURL(newFilters);
//   };

//   if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
//           <p className="text-gray-500 mt-1">Find the best fresh produce and groceries.</p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <span className="text-gray-600 font-medium">
//             {filteredProducts.length === 0 ? 'No products available' : `${filteredProducts.length} results found`}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8 relative items-start">
//         <div className="lg:hidden w-full overflow-x-auto pb-4 bg-white sticky top-[72px] z-30 border-b border-gray-100 no-scrollbar">
//           <MobileCategorySidebar
//             selectedCategory={filters.selectedCategory}
//             onSelectCategory={(id) => handleSetFilters({ ...filters, selectedCategory: id, searchQuery: '' })}
//           />
//         </div>

//         <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
//           <ProductFilters filters={filters} setFilters={handleSetFilters} />
//         </aside>

//         <main className="flex-1 w-full">
//           {loading && products.length === 0 ? (
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
//               ))}
//             </div>
//           ) : (
//             <>
//               <ProductGrid products={displayedProducts} />
//               {hasMore && <div ref={loadMoreRef} className="py-12 text-center">{isLoadingMore && <div className="animate-spin border-4 border-green-600 border-t-transparent rounded-full w-8 h-8 mx-auto" />}</div>}
//             </>
//           )}
//         </main>
//       </div>
//       <FloatingCartBar />
//     </div>
//   );
// };

// export default ProductsPage;

// import type { FC } from 'react';
// import { useEffect, useState, useMemo, useRef } from 'react';
// import ProductGrid from '../../../components/products/ProductGrid';
// import ProductFilters from '../../../components/products/ProductFilters';
// import { useSelector } from 'react-redux';
// import { useAppDispatch } from '../../../redux/actions/useDispatch';
// import { fetchProducts } from '../../../redux/actions/productActions';
// import { fetchWishlist } from '../../../redux/actions/wishlistActions';
// import type { Product } from '../../../types/Product';
// import MobileCategorySidebar from '../../../components/products/MobileCategorySidebar';
// import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import type { RootState } from '../../../redux/store';

// // Define an interface for the category object to fix the "any" warning
// interface CategoryData {
//   _id: string;
//   name: string;
// }

// const ProductsPage: FC = () => {
//   const dispatch = useAppDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { products, loading, error } = useSelector(
//     (state: RootState) => state.product
//   );
//   const { user } = useSelector((state: RootState) => state.auth);

//   const [filters, setFilters] = useState(() => {
//     const params = new URLSearchParams(location.search);
//     return {
//       selectedCategory: params.get('category') || null,
//       searchQuery: params.get('search') || '',
//       priceRange: [0, 1000] as [number, number],
//       sortBy: 'featured',
//     };
//   });

//   const [displayCount, setDisplayCount] = useState(20);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const loadMoreRef = useRef<HTMLDivElement>(null);

//   // 1. Sync state FROM URL
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const categoryParam = params.get('category') || null;
//     const searchParam = params.get('search') || '';

//     // Only update state if the values are actually different to avoid infinite loops
//     if (
//       filters.selectedCategory !== categoryParam ||
//       filters.searchQuery !== searchParam
//     ) {
//       setFilters((prev) => ({
//         ...prev,
//         selectedCategory: categoryParam,
//         searchQuery: searchParam,
//       }));
//       setDisplayCount(20);
//     }
//     // Added dependency on filters specifically to keep ESLint happy while maintaining logic
//   }, [location.search, filters.selectedCategory, filters.searchQuery]);

//   // 2. Sync URL FROM state
//   const updateURL = (newFilters: typeof filters) => {
//     const params = new URLSearchParams();
//     if (newFilters.selectedCategory) {params.set('category', newFilters.selectedCategory);}
//     if (newFilters.searchQuery) {params.set('search', newFilters.searchQuery);}

//     const newSearch = params.toString();
//     const currentSearch = new URLSearchParams(location.search).toString();

//     if (newSearch !== currentSearch) {
//       navigate(`${location.pathname}?${newSearch}`, { replace: true });
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchProducts());
//     if (user) {dispatch(fetchWishlist());}
//   }, [dispatch, user]);

//   // Infinite scroll
//   useEffect(() => {
//     const observerTarget = loadMoreRef.current;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isLoadingMore && !loading) {
//           setIsLoadingMore(true);
//           setTimeout(() => {
//             setDisplayCount((prev) => prev + 20);
//             setIsLoadingMore(false);
//           }, 300);
//         }
//       },
//       { threshold: 0.1, rootMargin: '100px' }
//     );
//     if (observerTarget) {observer.observe(observerTarget);}
//     return () => { if (observerTarget) {observer.unobserve(observerTarget);} };
//   }, [isLoadingMore, loading]);

//   const filteredProducts = useMemo(() => {
//     let result = products.filter((p: Product) => p.isActive !== false);

//     if (filters.searchQuery) {
//       const query = filters.searchQuery.toLowerCase();
//       result = result.filter((p: Product) => {
//         const nameMatch = p.name.toLowerCase().includes(query);
//         const descMatch = p.description?.toLowerCase().includes(query);
//         return nameMatch || descMatch;
//       });
//     } else if (filters.selectedCategory) {
//       result = result.filter((p: Product) => {
//         // Casting to CategoryData instead of any to fix the warning
//         const productCategoryId =
//           typeof p.categoryId === 'object' && p.categoryId !== null
//             ? (p.categoryId as unknown as CategoryData)._id
//             : p.categoryId;
//         return String(productCategoryId) === String(filters.selectedCategory);
//       });
//     }

//     result = result.filter(
//       (p: Product) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
//     );

//     if (filters.sortBy === 'price_asc') {result.sort((a, b) => a.price - b.price);}
//     else if (filters.sortBy === 'price_desc') {result.sort((a, b) => b.price - a.price);}
//     else if (filters.sortBy === 'newest') {result.reverse();}

//     return result;
//   }, [products, filters]);

//   const displayedProducts = filteredProducts.slice(0, displayCount);
//   const hasMore = displayCount < filteredProducts.length;

//   const handleSetFilters = (newFilters: typeof filters) => {
//     // If the user is typing a new search query, clear the category
//     if (newFilters.searchQuery !== filters.searchQuery && newFilters.searchQuery !== '') {
//         newFilters.selectedCategory = null;
//     }

//     setFilters(newFilters);
//     setDisplayCount(20);
//     updateURL(newFilters);
//   };

//   if (error) {return <div className="text-center text-red-500 py-10">Error: {error}</div>;}

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
//           <p className="text-gray-500 mt-1">Find the best fresh produce and groceries.</p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <span className="text-gray-600 font-medium">
//             {filteredProducts.length === 0 ? 'No products available' : `${filteredProducts.length} results found`}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8 relative items-start">
//         <div className="lg:hidden w-full overflow-x-auto pb-4 bg-white sticky top-[72px] z-30 border-b border-gray-100 no-scrollbar">
//           <MobileCategorySidebar
//             selectedCategory={filters.selectedCategory}
//             onSelectCategory={(id) => handleSetFilters({ ...filters, selectedCategory: id, searchQuery: '' })}
//           />
//         </div>

//         <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
//           <ProductFilters filters={filters} setFilters={handleSetFilters} />
//         </aside>

//         <main className="flex-1 w-full">
//           {loading && products.length === 0 ? (
//             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
//               ))}
//             </div>
//           ) : (
//             <>
//               <ProductGrid products={displayedProducts} />
//               {hasMore && (
//                 <div ref={loadMoreRef} className="py-12 text-center">
//                   {isLoadingMore && (
//                     <div className="animate-spin border-4 border-green-600 border-t-transparent rounded-full w-8 h-8 mx-auto" />
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>
//       <FloatingCartBar />
//     </div>
//   );
// };

// export default ProductsPage;

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

  // 1. DERIVED FILTERS (The URL is the Source of Truth)
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const selectedCategory = queryParams.get('category') || null;
  const searchQuery = queryParams.get('search') || '';

  // 2. LOCAL UI STATE (Only for things NOT in the URL)
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    sortBy: 'featured',
  });

  // Combine them for the child components
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

  // Infinite Scroll Logic
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

    // Search takes priority
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
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

  // 3. Centralized update function
  const handleUpdateFilters = (updates: any) => {
    const newParams = new URLSearchParams(location.search);

    // Handle Search / Category Logic
    if (updates.searchQuery !== undefined) {
      if (updates.searchQuery.trim() !== '') {
        newParams.set('search', updates.searchQuery);
        newParams.delete('category'); // Reset category when searching
      } else {
        newParams.delete('search');
      }
    }

    if (updates.selectedCategory !== undefined) {
      if (updates.selectedCategory) {
        newParams.set('category', updates.selectedCategory);
        newParams.delete('search'); // Reset search when picking category
      } else {
        newParams.delete('category');
      }
    }

    // Update URL
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });

    // Update Local State if price or sort changed
    if (updates.priceRange || updates.sortBy) {
      setLocalFilters((prev) => ({
        ...prev,
        priceRange: updates.priceRange || prev.priceRange,
        sortBy: updates.sortBy || prev.sortBy,
      }));
    }

    setDisplayCount(20);
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-gray-600 font-medium">
            {filteredProducts.length} results found
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <ProductFilters
            filters={allFilters}
            setFilters={(newVal: any) => handleUpdateFilters(newVal)}
          />
        </aside>

        <main className="flex-1 w-full">
          <ProductGrid products={displayedProducts} />
          {displayCount < filteredProducts.length && (
            <div ref={loadMoreRef} className="py-12 text-center">
              {isLoadingMore && (
                <div className="animate-spin border-4 border-green-600 border-t-transparent rounded-full w-8 h-8 mx-auto" />
              )}
            </div>
          )}
        </main>
      </div>
      <FloatingCartBar />
    </div>
  );
};

export default ProductsPage;

import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilters from '../../../components/products/ProductFilters';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import type { Product } from '../../../types/product';

const ProductsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useSelector(
    (state: any) => state.product
  );

  const [filters, setFilters] = useState({
    selectedCategory: null as string | null,
    priceRange: [0, 1000] as [number, number],
    sortBy: 'featured',
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (filters.selectedCategory) {
      result = result.filter(
        (p: Product) => p.categoryId === filters.selectedCategory
      );
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
      // Mock logic for newest
      result.reverse();
    }
    // 'featured' is default/original order for now

    return result;
  }, [products, filters]);

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
          <ProductFilters filters={filters} setFilters={setFilters} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

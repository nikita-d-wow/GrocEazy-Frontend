import * as React from 'react';
import { type FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  fetchManagerProducts,
  fetchAnalyticsProducts,
} from '../../redux/actions/productActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import {
  selectProducts,
  selectProductLoading,
  selectProductPagination,
  selectProductError,
  selectAnalyticsProducts,
} from '../../redux/selectors/productSelectors';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import Pagination from '../../components/common/Pagination';
import DebouncedSearch from '../../components/common/DebouncedSearch';
import FilterSelect from '../../components/common/FilterSelect';
import FilterBar from '../../components/common/FilterBar';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { InventorySkeleton } from '../../components/common/Skeleton';

import { InventoryCharts } from './InventoryCharts';
import { InventoryAlertsModal } from './InventoryAlertsModal';
import type { Product } from '../../types/Product';

const InventoryRow = React.memo(
  ({
    product,
    categoryName,
    index,
  }: {
    product: Product;
    categoryName: string;
    index: number;
  }) => {
    return (
      <tr
        className={`border-b border-gray-100 hover:bg-green-50/30 transition-all duration-200 animate-slideUp ${!product.isActive ? 'opacity-60' : ''}`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-white p-1.5 flex-shrink-0 shadow-sm border border-gray-100/50">
              <img
                className="h-full w-full rounded-xl object-cover"
                src={
                  optimizeCloudinaryUrl(product.images?.[0]) ||
                  `https://ui-avatars.com/api/?name=${product.name}`
                }
                alt={product.name}
                loading="lazy"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {product.name}
              </div>
              {product.size && (
                <div className="text-xs text-gray-500">{product.size}</div>
              )}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm font-medium text-gray-600">
            {categoryName}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm font-bold text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                Number(product.stock) === 0
                  ? 'text-red-600 font-bold'
                  : product.stock <= (product.lowStockThreshold || 5)
                    ? 'text-orange-600'
                    : 'text-gray-900'
              }`}
            >
              {product.stock}
            </span>
            {Number(product.stock) === 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                <AlertTriangle size={12} />
                Out of Stock
              </span>
            ) : product.stock <= (product.lowStockThreshold || 5) ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle size={12} />
                Low Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                <CheckCircle size={12} />
                In Stock
              </span>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          {product.isActive ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200">
              Inactive
            </span>
          )}
        </td>
      </tr>
    );
  }
);

InventoryRow.displayName = 'InventoryRow';

export const Inventory: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const categories = useSelector(selectCategories);
  const pagination = useSelector(selectProductPagination);

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const analyticsProducts = useSelector(selectAnalyticsProducts);

  // 1. Fetch Categories and Analytics Products (for charts) on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAnalyticsProducts());
  }, [dispatch]);

  // 2. Fetch Products when page or search term changes
  // If stock filter is active, fetch more items for client-side filtering
  useEffect(() => {
    const limit = stockFilter ? 1000 : 10;
    const fetchPage = stockFilter ? 1 : page;
    dispatch(
      fetchManagerProducts(
        fetchPage,
        limit,
        search,
        isActive,
        stockFilter,
        categoryId // Pass categoryId
      )
    );
  }, [dispatch, page, search, stockFilter, isActive, categoryId]);

  // 3. Memoized Category Lookup Map for performance
  const categoryMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  const error = useSelector(selectProductError);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch('');
    setStockFilter('');
    setCategoryId('');
    setIsActive(undefined);
    setPage(1);
  }, []);

  const showReset =
    search !== '' ||
    stockFilter !== '' ||
    categoryId !== '' ||
    isActive !== undefined;

  const getCategoryId = (p: Product) => {
    if (typeof p.categoryId === 'object' && p.categoryId !== null) {
      return (p.categoryId as { _id: string })._id;
    }
    if (typeof p.categoryId === 'string' && p.categoryId) {
      return p.categoryId;
    }
    // Fallback for different data structures if they exist
    if (typeof p.category === 'object' && p.category !== null) {
      return (p.category as { _id: string })._id;
    }
    return p.category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InventoryAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">
            Track and monitor product stock levels
          </p>
        </div>
        <button
          onClick={() => setIsAlertsOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <AlertTriangle size={18} className="text-orange-500" />
          Stock Alerts
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <InventoryCharts
        products={analyticsProducts} // Use full list for charts
        categories={categories}
        onStockClick={(status) => {
          setStockFilter(status);
          setPage(1);
          setTimeout(() => {
            document.getElementById('inventory-table')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 100);
        }}
        onCategoryClick={(catId) => {
          setCategoryId(catId);
          setPage(1);
          setTimeout(() => {
            document.getElementById('inventory-table')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 100);
        }}
      />

      <FilterBar
        id="inventory-table"
        searchComponent={
          <DebouncedSearch
            placeholder="Search inventory..."
            initialValue={search}
            onSearch={handleSearch}
            delay={800}
          />
        }
        onReset={handleReset}
        showReset={showReset}
      >
        <FilterSelect
          label="Category"
          value={categoryId}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((c) => ({ value: c._id, label: c.name })),
          ]}
          onChange={(val) => {
            setCategoryId(val);
            setPage(1);
          }}
        />
        <FilterSelect
          label="Stock Status"
          value={stockFilter}
          options={[
            { value: '', label: 'All Items' },
            { value: 'lowStock', label: 'Low Stock' },
            { value: 'outOfStock', label: 'Out of Stock' },
            { value: 'inStock', label: 'In Stock' },
          ]}
          onChange={(val) => {
            setStockFilter(val);
            setPage(1);
            setTimeout(() => {
              const element = document.getElementById('inventory-table');
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
            }, 100);
          }}
        />
        <FilterSelect
          label="Status"
          value={isActive === undefined ? '' : isActive ? 'active' : 'inactive'}
          options={[
            { value: '', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          onChange={(val) => {
            if (val === 'active') {
              setIsActive(true);
            } else if (val === 'inactive') {
              setIsActive(false);
            } else {
              setIsActive(undefined);
            }
            setPage(1);
          }}
        />
      </FilterBar>

      {loading && products.length === 0 ? (
        <InventorySkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            search
              ? `No products match "${search}"`
              : 'Your inventory is currently empty.'
          }
          icon={<Package className="w-12 h-12" />}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          {/* Subtle loading overlay for stale-while-revalidate */}
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity duration-300">
              <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
                <Loader size="sm" />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border-b-2 border-green-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product, index) => {
                  // Try to get category name from populated object first
                  let categoryName = 'N/A';
                  if (
                    typeof product.categoryId === 'object' &&
                    product.categoryId &&
                    'name' in product.categoryId
                  ) {
                    categoryName = (product.categoryId as { name: string })
                      .name;
                  } else if (
                    typeof product.category === 'object' &&
                    product.category &&
                    'name' in product.category
                  ) {
                    categoryName = (product.category as { name: string }).name;
                  } else {
                    // Fallback to ID map
                    const catId = getCategoryId(product);
                    categoryName = (catId && categoryMap[catId]) || 'N/A';
                  }

                  return (
                    <InventoryRow
                      key={product._id}
                      product={product}
                      categoryName={categoryName}
                      index={index}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {!stockFilter && pagination && pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-50">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                isLoading={loading}
                scrollTargetId="inventory-table"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;

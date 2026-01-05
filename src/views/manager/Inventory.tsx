import React, { type FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchManagerProducts } from '../../redux/actions/productActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import {
  selectProducts,
  selectProductLoading,
  selectProductPagination,
} from '../../redux/selectors/productSelectors';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import Pagination from '../../components/common/Pagination';
import DebouncedSearch from '../../components/common/DebouncedSearch';
import FilterSelect from '../../components/common/FilterSelect';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

import { InventoryCharts } from './InventoryCharts';
import { InventoryAlertsModal } from './InventoryAlertsModal';
import type { Product } from '../../types/Product';

interface StockStatus {
  label: string;
  color: string;
  icon: any;
}

const InventoryRow = React.memo(
  ({
    product,
    categoryName,
    status,
  }: {
    product: Product;
    categoryName: string;
    status: StockStatus;
  }) => {
    const StatusIcon = status.icon;
    return (
      <tr
        className={`hover:bg-gray-50/50 transition-opacity ${!product.isActive ? 'opacity-60' : ''}`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-lg bg-gray-100 p-1 flex-shrink-0">
              <img
                className="h-full w-full rounded-md object-cover"
                src={
                  product.images?.[0] ||
                  `https://ui-avatars.com/api/?name=${product.name}`
                }
                alt={product.name}
                loading="lazy"
                width={40}
                height={40}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {product.name}
              </div>
              {product.size && (
                <div className="text-xs text-gray-500">{product.size}</div>
              )}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm text-gray-600">{categoryName}</span>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm font-medium text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className={`text-sm font-bold ${status.color.split(' ')[0]}`}>
            {product.stock}
          </span>
        </td>

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            <StatusIcon size={12} />
            {status.label}
          </span>
        </td>
      </tr>
    );
  }
);

InventoryRow.displayName = 'InventoryRow';

const Inventory: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const categories = useSelector(selectCategories);
  const pagination = useSelector(selectProductPagination);

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [page, setPage] = useState(1);

  // 1. Fetch Categories only once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 2. Fetch Products when page or search term changes
  useEffect(() => {
    dispatch(fetchManagerProducts(page, 10, search, undefined, stockFilter));
  }, [dispatch, page, search, stockFilter]);

  // 3. Memoized Category Lookup Map for performance
  const categoryMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  const getStockStatus = (stock: number, threshold: number = 5) => {
    if (Number(stock) === 0) {
      return {
        label: 'Out of Stock',
        color: 'text-red-600 bg-red-50',
        icon: AlertTriangle,
      };
    }
    if (stock <= threshold) {
      return {
        label: 'Low Stock',
        color: 'text-orange-600 bg-orange-50',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'In Stock',
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle,
    };
  };

  const getCategoryId = (p: Product) => {
    if (typeof p.categoryId === 'object' && p.categoryId !== null) {
      return (p.categoryId as { _id: string })._id;
    }
    if (typeof p.categoryId === 'string' && p.categoryId) {
      return p.categoryId;
    }
    // Fallback for different data structures if they exist
    const prodAsAny = p as any;
    if (typeof prodAsAny.category === 'object' && prodAsAny.category !== null) {
      return (prodAsAny.category as { _id: string })._id;
    }
    return prodAsAny.category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InventoryAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">
            Track and monitor product stock levels
          </p>
        </div>
        <button
          onClick={() => setIsAlertsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <AlertTriangle size={18} className="text-orange-500" />
          Stock Alerts
        </button>
      </div>

      <InventoryCharts products={products} categories={categories} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="max-w-md w-full">
            <DebouncedSearch
              placeholder="Search inventory..."
              initialValue={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FilterSelect
              label="Stock Level"
              value={stockFilter}
              options={[
                { value: '', label: 'All Stock Levels' },
                { value: 'low', label: 'Low Stock' },
                { value: 'out', label: 'Out of Stock' },
                { value: 'in', label: 'In Stock' },
              ]}
              onChange={(val) => {
                setStockFilter(val);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="text-gray-500 mt-4 animate-pulse font-medium">
            Loading inventory...
          </p>
        </div>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
              >
                {products.map((product) => {
                  const status = getStockStatus(
                    product.stock,
                    product.lowStockThreshold
                  );
                  const catId = getCategoryId(product);
                  const categoryName = categoryMap[catId] || 'N/A';

                  return (
                    <InventoryRow
                      key={product._id}
                      product={product}
                      categoryName={categoryName}
                      status={status}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-50">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;

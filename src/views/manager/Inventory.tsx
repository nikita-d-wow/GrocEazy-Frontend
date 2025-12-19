import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Search, Package, AlertTriangle, CheckCircle } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchProducts } from '../../redux/actions/productActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import {
  selectProducts,
  selectProductLoading,
} from '../../redux/selectors/productSelectors';
import { selectCategories } from '../../redux/selectors/categorySelectors';

import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

import { InventoryCharts } from './InventoryCharts';
import { InventoryAlertsModal } from './InventoryAlertsModal';

const Inventory: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectProductLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p && p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  const getStockStatus = (stock: number, threshold: number = 5) => {
    if (stock === 0) {
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

  if (loading && products.length === 0) {
    return <Loader fullScreen />;
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="max-w-md">
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            searchTerm
              ? `No products match "${searchTerm}"`
              : 'Your inventory is currently empty.'
          }
          icon={<Package className="w-12 h-12" />}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const status = getStockStatus(
                    product.stock,
                    product.lowStockThreshold
                  );
                  const StatusIcon = status.icon;

                  // Handle both populated categoryId/category object and string IDs
                  const getCategoryId = (p: typeof product) => {
                    // Check categoryId field first
                    if (
                      typeof p.categoryId === 'object' &&
                      p.categoryId !== null
                    ) {
                      return (p.categoryId as { _id: string })._id;
                    }
                    if (typeof p.categoryId === 'string' && p.categoryId) {
                      return p.categoryId;
                    }
                    // Check category field
                    if (typeof p.category === 'object' && p.category !== null) {
                      return (p.category as { _id: string })._id;
                    }
                    return p.category;
                  };

                  const catId = getCategoryId(product);

                  const categoryName =
                    categories.find((c) => c._id === catId)?.name || 'N/A';

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/50 transition-colors"
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
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </div>
                            {product.size && (
                              <div className="text-xs text-gray-500">
                                {product.size}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {categoryName}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{product.price.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold ${status.color.split(' ')[0]}`}
                        >
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

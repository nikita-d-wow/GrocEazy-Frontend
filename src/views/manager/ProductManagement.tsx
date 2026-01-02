import React, {
  type FC,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDebounce } from '../../customhooks/useDebounce';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  fetchManagerProducts,
  deleteProduct as deleteProductAction,
} from '../../redux/actions/productActions';
import {
  selectProducts,
  selectProductLoading,
} from '../../redux/selectors/productSelectors';

import type { Product } from '../../types/Product';

import ProductForm from '../../components/products/ProductForm';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import FilterSelect from '../../components/common/FilterSelect';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// Memoized Row Component to prevent unnecessary re-renders
const ProductRow = React.memo(
  ({
    product,
    onEdit,
    onDelete,
  }: {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
  }) => {
    return (
      <tr
        className={`hover:bg-gray-50/50 transition-opacity ${!product.isActive ? 'opacity-60' : ''}`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 p-1 flex-shrink-0">
              <img
                className="h-full w-full rounded-lg object-cover"
                src={
                  product.images?.[0] ||
                  `https://ui-avatars.com/api/?name=${product.name}`
                }
                alt={product.name}
                loading="lazy"
                width={48}
                height={48}
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
          <span className="text-sm font-medium text-gray-900">
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
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            ) : product.stock <= (product.lowStockThreshold || 5) ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                Low
              </span>
            ) : null}
          </div>
        </td>

        <td className="px-6 py-4">
          {product.isActive ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Inactive
            </span>
          )}
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

ProductRow.displayName = 'ProductRow';

const ProductManagement: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Incremental Rendering State
  const [visibleCount, setVisibleCount] = useState(20);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchManagerProducts(1, 20, true));
  }, [dispatch]);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (!p || !p.name) {
          return false;
        }

        const matchesSearch = p.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && p.isActive) ||
          (statusFilter === 'inactive' && !p.isActive);

        return matchesSearch && matchesStatus;
      }),
    [products, debouncedSearchTerm, statusFilter]
  );

  // Intersection Observer for Infinite Scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredProducts.length
        ) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [filteredProducts.length, visibleCount]);

  // Reset visible count when search term changes (Adjust state during render to avoid Effect)
  const [lastSearch, setLastSearch] = useState(debouncedSearchTerm);
  if (debouncedSearchTerm !== lastSearch) {
    setLastSearch(debouncedSearchTerm);
    setVisibleCount(20);
  }

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await dispatch(deleteProductAction(id));
          toast.success('Product deleted successfully');
        } catch {
          toast.error('Failed to delete product');
        }
      }
    },
    [dispatch]
  );

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setIsFormOpen(true);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage store inventory</p>
        </div>
        <Button onClick={handleAddNew} leftIcon={<Plus className="w-5 h-5" />}>
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 relative z-30">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex-1 max-w-md w-full">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <FilterSelect
              label="Filter by Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full md:w-48"
            />
          </div>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="text-gray-500 mt-4 animate-pulse font-medium">
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            searchTerm
              ? `No products match "${searchTerm}"`
              : 'Start by adding products to your inventory.'
          }
          icon={<Package className="w-12 h-12" />}
          action={
            !searchTerm
              ? {
                  label: 'Add Product',
                  onClick: handleAddNew,
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Intersection trigger at the bottom */}
          {visibleCount < filteredProducts.length && (
            <div
              ref={loaderRef}
              className="p-4 flex justify-center border-t border-gray-50"
            >
              <Loader size="sm" />
            </div>
          )}

          {loading && products.length > 0 && (
            <div className="p-4 flex justify-center border-t border-gray-50">
              <Loader size="sm" />
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          key={editingProduct?._id ?? 'new'}
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;

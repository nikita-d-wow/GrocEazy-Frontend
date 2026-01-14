import * as React from 'react';
import { type FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DebouncedSearch from '../../components/common/DebouncedSearch';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  fetchManagerProducts,
  deleteProduct as deleteProductAction,
} from '../../redux/actions/productActions';
import {
  selectProducts,
  selectProductLoading,
  selectProductPagination,
} from '../../redux/selectors/productSelectors';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import Pagination from '../../components/common/Pagination';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';

import type { Product } from '../../types/Product';

import ProductForm from '../../components/products/ProductForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import FilterSelect from '../../components/common/FilterSelect';
import { TableSkeleton } from '../../components/common/Skeleton';
import PageHeader from '../../components/common/PageHeader';
import FilterBar from '../../components/common/FilterBar';

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
    index,
  }: {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
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

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-green-200"
              title="Edit product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
              title="Delete product"
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

import ProductMobileCard from '../../components/products/ProductMobileCard';

const ProductManagement: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);
  const pagination = useSelector(selectProductPagination);

  const categories = useSelector(selectCategories);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);

  /* Fetch categories on mount */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const displayProducts = products;

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

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingProduct(null);
    setIsFormOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    const isActive =
      statusFilter === 'all'
        ? undefined
        : statusFilter === 'active'
          ? true
          : false;

    dispatch(
      fetchManagerProducts(page, 10, search, isActive, stockFilter, categoryId)
    );
  }, [dispatch, page, search, statusFilter, stockFilter, categoryId]);

  /* Update fetch effect */
  useEffect(() => {
    const isActive =
      statusFilter === 'all'
        ? undefined
        : statusFilter === 'active'
          ? true
          : false;

    dispatch(
      fetchManagerProducts(page, 10, search, isActive, stockFilter, categoryId)
    );
  }, [dispatch, page, search, statusFilter, stockFilter, categoryId]);

  const handleReset = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setStockFilter('');
    setCategoryId('');
    setPage(1);
  }, []);

  const showReset =
    search !== '' ||
    statusFilter !== 'all' ||
    stockFilter !== '' ||
    categoryId !== '';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-12 lg:px-20 py-6 sm:py-10">
      {/* Decorative Header */}
      <PageHeader
        title="Product Management"
        highlightText="Product"
        subtitle="Manage your store inventory and product catalog"
        icon={Package}
      >
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-full sm:w-auto justify-center shadow-lg shadow-green-200/50"
        >
          Add Product
        </Button>
      </PageHeader>

      {loading && products.length === 0 ? (
        <TableSkeleton rows={5} cols={2} />
      ) : displayProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description={
            search
              ? `No products match "${search}"`
              : 'Start by adding products to your inventory.'
          }
          icon={<Package className="w-12 h-12" />}
          action={
            !search
              ? {
                  label: 'Add Product',
                  onClick: handleAddNew,
                }
              : undefined
          }
        />
      ) : (
        <>
          <FilterBar
            searchComponent={
              <DebouncedSearch
                placeholder="Search products..."
                initialValue={search}
                onSearch={handleSearch}
              />
            }
            onReset={handleReset}
            showReset={showReset}
          >
            <FilterSelect
              label="Category"
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((c) => ({ value: c._id, label: c.name })),
              ]}
              value={categoryId}
              onChange={(val) => {
                setCategoryId(val);
                setPage(1);
              }}
            />

            <FilterSelect
              label="Stock Status"
              options={[
                { value: '', label: 'All Inventory' },
                { value: 'inStock', label: 'In Stock' },
                { value: 'lowStock', label: 'Low Stock' },
                { value: 'outOfStock', label: 'Out of Stock' },
              ]}
              value={stockFilter}
              onChange={(value: string) => {
                setStockFilter(value);
                setPage(1);
              }}
            />

            <FilterSelect
              label="Status"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(value: string) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />
          </FilterBar>

          <div className="relative">
            {loading && (
              <div className="absolute inset-x-0 -top-2 z-20 flex justify-center">
                <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                  <Loader size="sm" />
                  <span className="text-xs font-bold text-gray-500">
                    Updating...
                  </span>
                </div>
              </div>
            )}

            {/* Mobile View: Card List */}
            <div className="block md:hidden">
              {displayProducts.map((product, index) => (
                <ProductMobileCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={index}
                />
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border-b-2 border-green-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Product
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
                      <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayProducts.map((product, index) => (
                      <ProductRow
                        key={product._id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
            isLoading={loading}
            showPageNumbersOnMobile={true}
          />
        </div>
      )}

      {isFormOpen && (
        <ProductForm
          key={editingProduct?._id ?? 'new'}
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ProductManagement;

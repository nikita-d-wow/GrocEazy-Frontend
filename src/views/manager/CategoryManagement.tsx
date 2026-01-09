import * as React from 'react';
import { type FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import DebouncedSearch from '../../components/common/DebouncedSearch';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  fetchPagedCategories,
  deleteCategory,
} from '../../redux/actions/categoryActions';

import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryPagination,
} from '../../redux/selectors/categorySelectors';
import { optimizeCloudinaryUrl } from '../../utils/imageUtils';

import type { Category } from '../../types/Category';

import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';
import CategoryForm from '../../components/categories/CategoryForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import PageHeader from '../../components/common/PageHeader';

const CategoryRow = React.memo(
  ({
    category,
    onEdit,
    onDelete,
    index,
  }: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    index: number;
  }) => {
    return (
      <tr
        className="border-b border-gray-100 hover:bg-green-50/30 transition-all duration-200 animate-slideUp"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-white p-1.5 flex-shrink-0 shadow-sm border border-gray-100/50">
              <img
                className="h-full w-full rounded-xl object-cover"
                src={
                  optimizeCloudinaryUrl(category.image, 48) ||
                  `https://ui-avatars.com/api/?name=${category.name}`
                }
                alt={category.name}
                loading="lazy"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {category.name}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            {category.productCount || 0}{' '}
            {category.productCount === 1 ? 'Product' : 'Products'}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm font-medium text-gray-600">
            {new Date(category.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="p-2.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-green-200"
              title="Edit category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

CategoryRow.displayName = 'CategoryRow';

const CategoryManagement: FC = () => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const pagination = useSelector(selectCategoryPagination);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<string>('newest');

  useEffect(() => {
    dispatch(fetchPagedCategories(page, 10, search, sortOrder));
  }, [dispatch, page, search, sortOrder]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this category?')) {
        try {
          await dispatch(deleteCategory(id));
          toast.success('Category deleted successfully');
        } catch {
          toast.error('Failed to delete category');
        }
      }
    },
    [dispatch]
  );

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    dispatch(fetchPagedCategories(page, 10, search, sortOrder));
  }, [dispatch, page, search, sortOrder]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10">
      {/* Decorative Header */}
      <PageHeader
        title="Category Management"
        highlightText="Category"
        subtitle="Organize your products catalog and categories"
        icon={Layers}
      >
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="w-5 h-5" />}
          variant="primary"
          className="shadow-lg shadow-green-200/50 w-full sm:w-auto justify-center"
        >
          Add Category
        </Button>
      </PageHeader>

      {/* Search & Sort Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 relative z-30">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-md">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                Search
              </span>
              <DebouncedSearch
                placeholder="Search categories..."
                initialValue={search}
                onSearch={handleSearch}
              />
            </div>
            <div className="w-full sm:w-auto self-end">
              <FilterSelect
                label="Sort By"
                value={sortOrder}
                onChange={(val: string) => {
                  setSortOrder(val);
                  setPage(1);
                }}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'name_asc', label: 'Name (A-Z)' },
                  { value: 'name_desc', label: 'Name (Z-A)' },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && categories.length === 0 ? (
        <TableSkeleton rows={5} cols={1} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description={
            search
              ? `No categories match "${search}"`
              : 'Create categories to organize your products.'
          }
          icon={<Layers className="w-12 h-12" />}
          action={
            !search
              ? { label: 'Add Category', onClick: handleAddNew }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity duration-300">
              <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
                <Loader size="sm" />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category, index) => (
                  <CategoryRow
                    key={category._id}
                    category={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            onPageChange={setPage}
            isLoading={loading}
          />
        </div>
      )}

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default CategoryManagement;

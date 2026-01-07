import React, { type FC, useEffect, useState, useCallback } from 'react';
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

const CategoryRow = React.memo(
  ({
    category,
    onEdit,
    onDelete,
  }: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
  }) => {
    return (
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-muted p-1 flex-shrink-0">
              <img
                className="h-full w-full rounded-lg object-cover"
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
              <div className="text-sm font-semibold text-text">
                {category.name}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {category.productCount || 0}{' '}
            {category.productCount === 1 ? 'Product' : 'Products'}
          </span>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm text-muted-text">
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
              className="p-2 text-muted-text hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="p-2 text-muted-text hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Categories</h1>
          <p className="text-muted-text mt-1">Organize your products catalog</p>
        </div>
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="w-5 h-5" />}
          variant="primary"
          className="shadow-xl shadow-primary/20 w-full sm:w-auto justify-center"
        >
          Add Category
        </Button>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border mb-6 relative z-30">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="w-full lg:max-w-md">
              <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest ml-1 mb-1.5 block">
                Search
              </span>
              <DebouncedSearch
                placeholder="Search categories..."
                initialValue={search}
                onSearch={handleSearch}
              />
            </div>
            <div className="w-full lg:w-auto">
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
                className="w-full md:w-56"
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
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col relative">
          {loading && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 flex items-center justify-center transition-opacity duration-300">
              <div className="bg-card p-3 rounded-full shadow-lg border border-border">
                <Loader size="sm" />
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <CategoryRow
                    key={category._id}
                    category={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="p-4 border-t border-border">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                isLoading={loading}
              />
            </div>
          )}
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

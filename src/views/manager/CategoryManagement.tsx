import React, { type FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDebounce } from '../../customhooks/useDebounce';

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

import type { Category } from '../../types/Category';

import CategoryForm from '../../components/categories/CategoryForm';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

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
      <tr className="hover:bg-gray-50/50">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 p-1 flex-shrink-0">
              <img
                className="h-full w-full rounded-lg object-cover"
                src={
                  category.image ||
                  `https://ui-avatars.com/api/?name=${category.name}`
                }
                alt={category.name}
                loading="lazy"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {category.name}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span className="text-sm text-gray-600">
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
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category._id)}
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

CategoryRow.displayName = 'CategoryRow';

const CategoryManagement: FC = () => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const pagination = useSelector(selectCategoryPagination);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPagedCategories(page, 10, debouncedSearchTerm));
  }, [dispatch, page, debouncedSearchTerm]);

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

  const handleAddNew = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your products catalog</p>
        </div>
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="w-5 h-5" />}
          variant="primary"
          className="shadow-xl shadow-green-200"
        >
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="max-w-md">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {loading && categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="text-gray-500 mt-4 animate-pulse font-medium">
            Loading categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description={
            searchTerm
              ? `No categories match "${searchTerm}"`
              : 'Create categories to organize your products.'
          }
          icon={<Layers className="w-12 h-12" />}
          action={
            !searchTerm
              ? { label: 'Add Category', onClick: handleAddNew }
              : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
              >
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

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoryManagement;

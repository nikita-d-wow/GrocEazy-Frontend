import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Layers } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { deleteCategory } from '../../redux/reducers/categoryReducer';

import {
  selectCategories,
  selectCategoryLoading,
} from '../../redux/selectors/categorySelectors';

import type { Category } from '../../types/Category';

import CategoryForm from '../../components/manager/CategoryForm';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const CategoryManagement: FC = () => {
  const dispatch = useAppDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  if (loading && categories.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Search + Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="max-w-md">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-xl bg-gray-100 p-1">
                          <img
                            className="h-full w-full rounded-lg object-contain"
                            src={
                              category.image ||
                              `https://ui-avatars.com/api/?name=${category.name}`
                            }
                            alt={category.name}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {category.name}
                          </div>
                          {category.parentId && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Subcategory
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded border">
                        {category.slug}
                      </code>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

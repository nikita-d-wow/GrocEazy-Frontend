import type { FC } from 'react';
import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  addCategory,
  updateCategory,
} from '../../redux/reducers/categoryReducer';
import { selectCategories } from '../../redux/selectors/categorySelectors';

import type { Category } from '../../types/category';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  category?: Category | null;
  onClose: () => void;
}

const createInitialState = (category?: Category | null): Partial<Category> => {
  if (category) {
    return { ...category };
  }

  return {
    name: '',
    slug: '',
    image: '',
    description: '',
    parentId: undefined,
  };
};

const CategoryForm: FC<Props> = ({ category, onClose }) => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  const [formData, setFormData] = useState<Partial<Category>>(() =>
    createInitialState(category)
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev: Partial<Category>) => {
      const updated = { ...prev, [name]: value || undefined };

      // ✅ slug generation WITHOUT effect
      if (name === 'name' && !category) {
        updated.slug = value
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Category = {
      id: category?.id ?? crypto.randomUUID(),
      name: formData.name?.trim() || 'Untitled',
      slug: formData.slug || '',
      image: formData.image,
      description: formData.description,
      parentId: formData.parentId,
    };

    if (category) {
      dispatch(updateCategory(payload));
    } else {
      dispatch(addCategory(payload));
    }

    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />

        {/* Parent Category */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Parent Category (Optional)
          </label>
          <select
            name="parentId"
            value={formData.parentId || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 bg-white"
          >
            <option value="">None (Top Level)</option>
            {categories
              .filter((c) => c.id !== category?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <Input
          label="Slug"
          name="slug"
          value={formData.slug || ''}
          disabled={!!category}
        />

        <Input
          label="Image URL"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50"
          />
        </div>

        <div className="pt-6 flex justify-end space-x-3 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;

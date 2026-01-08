import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  createCategory,
  updateCategory,
} from '../../redux/actions/categoryActions';

import type { Category, CategoryFormData } from '../../types/Category';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const CategoryForm: FC<Props> = ({ category, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    image: category?.image,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    category?.image
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData: CategoryFormData = {
        ...formData,
        image: imageFile || formData.image,
      };

      if (category) {
        await dispatch(updateCategory(category._id, submitData));
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(submitData));
        toast.success('Category created successfully');
      }

      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create New Category'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {/* Section Title */}
          <div className="border-b border-gray-100 pb-2 mb-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Basic Information
            </h4>
          </div>

          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100 placeholder:text-gray-400 font-medium transition-all"
            required
            placeholder="e.g. Fresh Fruits"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 ml-1">
            Category Image
          </label>

          <div className="p-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-green-50/30 hover:border-green-200 transition-all duration-300 group">
            <label className="cursor-pointer block relative">
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-8 h-8 text-green-500 opacity-60 group-hover:opacity-100" />
                  </div>
                )}

                {!imagePreview && (
                  <>
                    <span className="text-sm font-bold text-gray-700 mt-2 block group-hover:text-green-700">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-400 mt-1 block">
                      SVG, PNG, JPG (max. 2MB)
                    </span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 font-bold px-8"
          >
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;

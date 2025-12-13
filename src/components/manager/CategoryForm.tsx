import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Upload } from 'lucide-react';
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
}

const CategoryForm: FC<Props> = ({ category, onClose }) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    image: category?.image,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    category?.image
  );

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

      onClose();
    } catch {
      toast.error('Failed to save category');
    }
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
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Category Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
              />
            )}
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors bg-white">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'Choose image file'}
                </span>
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

        {/* Image URL fallback */}
        <Input
          label="Or enter Image URL"
          name="image"
          value={typeof formData.image === 'string' ? formData.image : ''}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />

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

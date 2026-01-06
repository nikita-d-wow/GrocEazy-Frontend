import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  createProduct,
  updateProduct as updateProductAction,
} from '../../redux/actions/productActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';

import type { Product, ProductFormData } from '../../types/Product';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import FilterSelect from '../common/FilterSelect';

interface Props {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm: FC<Props> = ({ product, onClose }) => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    size: product?.size,
    dietary: product?.dietary,
    stock: product?.stock || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
    price: product?.price || 0,
    isActive: product?.isActive ?? true,
    categoryId:
      typeof product?.categoryId === 'object' && product?.categoryId !== null
        ? (product.categoryId as { _id: string })._id
        : (product?.categoryId as string) || '',
    images: product?.images || [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images || []
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? ''
            : Number(value)
          : type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleImageFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const submitData: ProductFormData = {
        ...formData,
        images: imageFiles.length > 0 ? imageFiles : formData.images,
      };

      if (product) {
        await dispatch(updateProductAction(product._id, submitData));
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(submitData));
        toast.success('Product created successfully');
      }

      onClose();
    } catch {
      toast.error('Failed to save product');
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Price (₹)"
            type="number"
            name="price"
            value={formData.price ?? ''}
            placeholder="Enter price"
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          <Input
            label="Stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />

          <Input
            label="Low Stock Threshold"
            type="number"
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            min="0"
          />

          <Input
            label="Size (optional)"
            name="size"
            value={formData.size || ''}
            onChange={handleChange}
            placeholder="e.g., 500g, 1kg, 1L"
          />

          <Input
            label="Dietary Info (optional)"
            name="dietary"
            value={formData.dietary || ''}
            onChange={handleChange}
            placeholder="e.g., Vegan, Gluten-Free"
          />

          {/* Category Dropdown */}
          <div className="md:col-span-2">
            <FilterSelect
              label="Category"
              options={[
                { value: '', label: 'Select category' },
                ...categories
                  .filter((cat) => !cat.isDeleted)
                  .map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  })),
              ]}
              value={formData.categoryId}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-50"
            required
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Product is active (visible to customers)
          </label>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Images
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <label className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Upload product images (multiple files)
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFilesChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;

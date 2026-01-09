import type { FC, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Trash2, Upload, Box, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  onSuccess?: () => void;
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  size: z.string().optional(),
  dietary: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z
    .number()
    .min(0, 'Threshold cannot be negative')
    .optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.union([z.instanceof(File), z.string()])).optional(),
});

const ProductForm: FC<Props> = ({ product, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.images || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      size: product?.size || '',
      dietary: product?.dietary || '',
      stock: product?.stock || 0,
      lowStockThreshold: product?.lowStockThreshold || 5,
      price: product?.price || 0,
      isActive: product?.isActive ?? true,
      categoryId:
        typeof product?.categoryId === 'object' && product?.categoryId !== null
          ? (product.categoryId as { _id: string })._id
          : (product?.categoryId as string) || '',
      images: product?.images || [],
    },
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

  const onSubmit = async (data: ProductFormData) => {
    try {
      const submitData: ProductFormData = {
        ...data,
        images: imageFiles.length > 0 ? imageFiles : data.images,
      };

      if (product) {
        await dispatch(updateProductAction(product._id, submitData));
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(submitData));
        toast.success('Product created successfully');
      }

      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const categoryId = watch('categoryId');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-1">
        {/* Core Info Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2 flex items-center gap-2">
            <Box className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Product Details
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                {...register('name')}
                defaultValue={watch('name')}
                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100 placeholder:text-gray-400 font-bold text-lg"
                placeholder="e.g. Organic Bananas"
                error={errors.name?.message}
              />
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl hover:border-green-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 bg-white transition-all font-medium text-gray-600"
                  placeholder="Describe your product..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <FilterSelect
                label="Category"
                searchable
                options={[
                  { value: '', label: 'Select category' },
                  ...categories
                    .filter((cat) => !cat.isDeleted)
                    .map((cat) => ({
                      value: cat._id,
                      label: cat.name,
                    })),
                ]}
                value={categoryId}
                onChange={(value: string) => setValue('categoryId', value)}
                className="w-full"
              />
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="-mt-2">
              <Input
                label="Dietary Info"
                {...register('dietary')}
                placeholder="e.g., Vegan, Gluten-Free"
                className="w-full px-4 py-[10.5px] rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100"
                error={errors.dietary?.message}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2 mt-2">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Pricing & Inventory
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100 font-bold"
              error={errors.price?.message}
            />

            <Input
              label="Size/Unit"
              {...register('size')}
              placeholder="e.g. 1kg"
              className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100"
              error={errors.size?.message}
            />

            <Input
              label="Current Stock"
              type="number"
              {...register('stock', { valueAsNumber: true })}
              min="0"
              className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100"
              error={errors.stock?.message}
            />

            <Input
              label="Low Stock Alert"
              type="number"
              {...register('lowStockThreshold', { valueAsNumber: true })}
              min="0"
              className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-100"
              error={errors.lowStockThreshold?.message}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-2 mt-2">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Product Imagery
            </h4>
          </div>

          <div className="bg-gray-50/50 rounded-2xl p-4 border border-dashed border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex flex-col items-center">
              {/* Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 w-full mb-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl shadow-sm border border-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Tiny Add Button in Grid */}
                  <label className="cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-white hover:bg-green-50 transition-colors aspect-square text-green-600">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {imagePreviews.length === 0 && (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full py-8 text-center group">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-green-400 group-hover:text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-green-700">
                    Click to upload product images
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Supports multi-upload (JPG, PNG)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Visible to customers
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-gray-100 text-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200/50 font-bold px-8"
            >
              {product ? 'Update Details' : 'Publish Product'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;

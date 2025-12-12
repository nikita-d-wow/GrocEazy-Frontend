import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { addProduct, updateProduct } from '../../redux/reducers/productReducer';
import { selectCategories } from '../../redux/selectors/categorySelectors';

import type { Product, ProductVariant } from '../../types/Product';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  product?: Product | null;
  onClose: () => void;
}

const createInitialState = (product?: Product | null): Partial<Product> => {
  if (product) {
    return { ...product };
  }

  return {
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    images: [''],
    variants: [],
  };
};

const ProductForm: FC<Props> = ({ product, onClose }) => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  const [formData, setFormData] = useState<Partial<Product>>(() =>
    createInitialState(product)
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: Partial<Product>) => {
      const updated: Partial<Product> = {
        ...prev,
        [name]: name === 'price' || name === 'stock' ? Number(value) : value,
      };

      // ✅ Auto-generate slug
      if (name === 'name' && !product) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }

      return updated;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev: Partial<Product>) => {
      const images = [...(prev.images ?? [])];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const addImageField = () => {
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      images: [...(prev.images ?? []), ''],
    }));
  };

  const addVariantGroup = () => {
    setFormData((prev: Partial<Product>) => ({
      ...prev,
      variants: [
        ...(prev.variants ?? []),
        {
          id: crypto.randomUUID(),
          name: '',
          options: [],
        },
      ],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name: formData.name || 'Untitled',
      slug: formData.slug || '',
      description: formData.description || '',
      price: formData.price || 0,
      stock: formData.stock || 0,
      categoryId: formData.categoryId || '',
      images: formData.images ?? [],
      variants: formData.variants as ProductVariant[],
    };

    if (product) {
      dispatch(updateProduct(payload));
    } else {
      dispatch(addProduct(payload));
    }

    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug || ''}
            disabled
          />

          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price ?? 0}
            onChange={handleChange}
          />

          <Input
            label="Stock"
            type="number"
            name="stock"
            value={formData.stock ?? 0}
            onChange={handleChange}
          />

          {/* ✅ Category Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-50"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full mt-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-50"
          />
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="font-medium text-sm">Images</label>
          {formData.images?.map((img: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => handleImageChange(idx, e.target.value)}
              />

              {(formData.images?.length ?? 0) > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev: Partial<Product>) => ({
                      ...prev,
                      images: prev.images?.filter(
                        (_: string, i: number) => i !== idx
                      ),
                    }))
                  }
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={addImageField}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Image
          </Button>
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

import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import { fetchCategories } from '../../../redux/actions/categoryActions';

import type {
  Product,
  ProductVariant,
  VariantOption,
} from '../../../types/product';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { products, loading } = useSelector((state: any) => state.product);

  const product = products.find((p: Product) => p.id === id);

  const [quantity, setQuantity] = useState(1);

  /* ✅ Fetching is a SIDE EFFECT → useEffect is correct */
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, products.length]);

  /* ✅ Derived state — NO EFFECT */
  const selectedImage = useMemo<string | null>(() => {
    if (!product || product.images.length === 0) {
      return null;
    }
    return product.images[0];
  }, [product]);

  const selectedVariants = useMemo<Record<string, string>>(() => {
    if (!product?.variants) {
      return {};
    }

    const defaults: Record<string, string> = {};
    product.variants.forEach((v: ProductVariant) => {
      if (v.options.length > 0) {
        defaults[v.id] = v.options[0].value;
      }
    });

    return defaults;
  }, [product]);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  let effectivePrice = product.price;
  product.variants?.forEach((v: ProductVariant) => {
    const option = v.options.find(
      (o: VariantOption) => o.value === selectedVariants[v.id]
    );
    if (option?.priceModifier) {
      effectivePrice += option.priceModifier;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-gray-500">
        <Link to="/products" className="hover:text-green-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={selectedImage ?? 'https://via.placeholder.com/600'}
            alt={product.name}
            className="rounded-2xl bg-gray-100 p-4"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl mt-4 font-bold">
            ₹{effectivePrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

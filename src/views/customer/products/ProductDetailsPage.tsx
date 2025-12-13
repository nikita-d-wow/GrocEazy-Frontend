import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Clock,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  Bike,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import { fetchCategories } from '../../../redux/actions/categoryActions';

import type { Product } from '../../../types/Product';
import ProductCard from '../../../components/products/ProductCard';
import {
  getSimilarProducts,
  getTopProducts,
} from '../../../services/productApi';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state: any) => state.product);
  const { categories } = useSelector((state: any) => state.category);

  // Local state for fetched lists
  const [fetchedSimilar, setFetchedSimilar] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  const product = products.find((p: Product) => p._id === id);
  const category = categories.find((c: any) => c._id === product?.categoryId);

  // Local state for quantity (placeholder)
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, products.length]);

  // Fetch additional data
  useEffect(() => {
    if (id) {
      getSimilarProducts(id)
        .then(setFetchedSimilar)
        .catch(() => toast.error('Failed to load similar products'));
    }
  }, [id]);

  useEffect(() => {
    getTopProducts(10)
      .then(setTopProducts)
      .catch(() => toast.error('Failed to load top products'));
  }, []);

  const handleAddToCart = () => {
    setQuantity(1);
    toast.success('Added to cart');
  };

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      setQuantity(0);
      toast.success('Removed from cart');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">
          The product you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-6 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // No fake MRP logic needed if we don't assume markup
  // ... or keep it if desired. The user requested "Deals" removal so maybe discounts too?
  // But user said "dont keep deals... remove deals and reviews and ratings". "Discount" badge on image is ok?
  // User didn't explicitly say remove discount badge, just "Deals" sort and "reviews and ratings".
  // Keeping discount logic for visual appeal unless asked to remove.
  const fakeMrp = Math.round(product.price * 1.2);
  const discount = Math.round(((fakeMrp - product.price) / fakeMrp) * 100);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link
            to="/products"
            className="hover:text-green-600 transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {category && (
            <>
              <Link
                to={`/products?category=${category._id}`}
                className="hover:text-green-600 transition-colors"
              >
                {category.name}
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
              <div className="relative aspect-square flex items-center justify-center">
                <img
                  src={
                    product.images[0] ||
                    `https://ui-avatars.com/api/?name=${product.name}`
                  }
                  alt={product.name}
                  className="w-full h-full object-contain max-h-[500px]"
                />
                {discount > 0 && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-6 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {category?.name || 'Groceries'}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                  <Clock className="w-3 h-3" />
                  10 MINS
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {product.size && (
                <div className="mt-4 inline-block bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700">
                  {product.size}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Price & Action */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  MRP <span className="line-through">₹{fakeMrp}</span>
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  ₹{product.price}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  (Inclusive of all taxes)
                </p>
              </div>

              {/* Add Button */}
              <div className="w-32">
                {quantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-50 border border-green-600 text-green-700 hover:bg-green-600 hover:text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
                  >
                    ADD
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-green-600 text-white rounded-xl py-2 px-3 shadow-lg shadow-green-200">
                    <button
                      onClick={decrement}
                      className="p-1 hover:bg-green-700 rounded active:scale-90 transition-all"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increment}
                      className="p-1 hover:bg-green-700 rounded active:scale-90 transition-all"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Value Props */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-sm mb-3">
                Why shop from GrocEazy?
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-full text-purple-600 mt-1">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Superfast Delivery
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get your order delivered to your doorstep in minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Best Prices & Offers
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Best price destination with offers directly from
                    manufacturers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-full text-orange-600 mt-1">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Wide Assortment
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose from 5000+ products across food, personal care, and
                    more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Sourced directly from local farmers and verified
                      suppliers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Undergoes strict quality checks before dispatch.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Packed hygienically to ensure freshness and safety.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shelf Life</h3>
                <p className="text-gray-600">3 days from delivery</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Storage Instructions
                </h3>
                <p className="text-gray-600">
                  Store in a cool and dry place. Keep away from direct sunlight.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Disclaimer</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every effort is made to maintain the accuracy of all
                  information. However, actual product packaging and materials
                  may contain more and/or different information. It is
                  recommended not to solely rely on the information presented.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Carousel */}
        {fetchedSimilar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Products
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide">
              {fetchedSimilar.map((p) => (
                <div key={p._id} className="min-w-[240px] w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 10 Products Carousel */}
        {topProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Top 10 Products in this category
            </h2>
            <div className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide">
              {topProducts.map((p) => (
                <div key={p._id} className="min-w-[240px] w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

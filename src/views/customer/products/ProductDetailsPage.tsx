import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { CartItem } from '../../../redux/types/cartTypes';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, Minus, Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import {
  fetchProducts,
  fetchSimilarProducts,
  fetchTopProducts,
} from '../../../redux/actions/productActions';
import {
  addToCart,
  updateCartQty,
  removeCartItem,
  fetchCart,
} from '../../../redux/actions/cartActions';

import {
  selectProducts,
  selectSimilarProducts,
  selectTopProducts,
} from '../../../redux/selectors/productSelectors';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';

import ProductCard from '../../../components/customer/ProductCard';
import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';
import type { RootState } from '../../../redux/store';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const products = useSelector(selectProducts);
  const similarProducts = useSelector(selectSimilarProducts);
  const topProducts = useSelector(selectTopProducts);
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    if (id) {
      dispatch(fetchSimilarProducts(id));
    }
    dispatch(fetchTopProducts());
    if (user) {
      dispatch(fetchCart());
    }
    window.scrollTo(0, 0);
  }, [dispatch, id, user]);

  const product = products.find((p) => p._id === id);

  // Cart Logic
  const cartItem = (cartItems || []).find(
    (item: CartItem) => (item.product?._id || item.product) === product?._id
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    try {
      await dispatch(addToCart(product._id, 1));
      toast.success(`Item added to cart`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const incrementCart = () => {
    if (cartItem && product) {
      if (cartQuantity < product.stock) {
        dispatch(updateCartQty(cartItem._id, cartQuantity + 1));
      } else {
        toast.error('Maximum available stock reached');
      }
    } else if (product) {
      if (product.stock > 0) {
        dispatch(addToCart(product._id, 1));
      } else {
        toast.error('Product is out of stock');
      }
    }
  };

  const decrementCart = () => {
    if (cartItem) {
      if (cartQuantity === 1) {
        dispatch(removeCartItem(cartItem._id));
      } else {
        dispatch(updateCartQty(cartItem._id, cartQuantity - 1));
      }
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  const categoryName =
    typeof product.categoryId === 'object'
      ? (product.categoryId as any).name
      : 'Groceries';

  const categoryId =
    typeof product.categoryId === 'object'
      ? (product.categoryId as any)._id
      : product.categoryId;

  // Recommendations Logic is now handled by Redux / API fetch
  // const similarProducts and const topProducts are selected from store above

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans text-gray-900">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b sticky top-[64px] sm:top-[72px] z-30 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link to="/" className="hover:text-green-600 shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <Link
            to={`/products?category=${categoryId}`}
            className="hover:text-green-600 shrink-0"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-start">
          {/* LEFT: Image Gallery */}
          <div className="bg-white rounded-3xl p-6 border-b md:border border-gray-100 shadow-sm md:sticky md:top-32">
            <div className="relative mb-6 flex justify-center h-[350px] md:h-[450px]">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="h-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 transition-all ${
                      idx === selectedImage
                        ? 'border-green-600 scale-110'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-contain rounded-lg"
                      alt="thumbnail"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="pt-6 md:pt-0">
            {/* Title Block */}
            <div className="mb-6">
              <Link
                to={`/products?category=${categoryId}`}
                className="text-sm font-bold text-gray-500 hover:text-green-600 mb-1 block"
              >
                View all by {categoryName}
              </Link>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* 10 MINS TAG */}
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg w-fit mb-4">
                <Clock className="w-4 h-4 text-gray-700" />
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                  10 MINS
                </span>
              </div>

              <div className="text-lg font-medium text-gray-500 mb-6">
                {product.size}
              </div>

              {/* Price & Add to Cart Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 border-b pb-8 border-gray-100">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                  <span className="text-sm font-normal text-gray-400 ml-2 block sm:inline">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Add to Cart Button Logic - BLINKIT STYLE */}
                <div className="w-full sm:w-40">
                  {cartQuantity === 0 ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {product.stock > 0 ? 'ADD' : 'Out of Stock'}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-green-700 text-white rounded-xl shadow-lg font-bold">
                      <button
                        onClick={decrementCart}
                        className="p-3 hover:bg-green-800 rounded-l-xl transition"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg">{cartQuantity}</span>
                      <button
                        onClick={incrementCart}
                        disabled={cartQuantity >= product.stock}
                        className="p-3 hover:bg-green-800 rounded-r-xl transition disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8 border-b pb-8 border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Product Details
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Why Shop From Us - Optimized Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Why shop from GrocEazy?
                </h3>
                <div className="space-y-6">
                  {/* Delivery */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0 shadow-sm border border-emerald-100/50">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Superfast Delivery
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                        Get your order delivered to your doorstep at the
                        earliest from dark stores near you.
                      </p>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0 shadow-sm border border-amber-100/50">
                      🏷️
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Best Prices & Offers
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                        Best price destination with offers directly from the
                        manufacturers.
                      </p>
                    </div>
                  </div>

                  {/* Curated */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shrink-0 shadow-sm border border-purple-100/50">
                      ✨
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Curated for Every Occasion
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                        Whether it’s your morning coffee, a midday snack, or
                        your nightly skincare routine, find an exhaustive range
                        of products tailored to your lifestyle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Similar Products
              </h2>
              {similarProducts.length > 6 && (
                <span className="text-xs text-green-600 font-semibold md:hidden">
                  Scroll right →
                </span>
              )}
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
              {similarProducts.map((p, idx) => (
                <div key={p._id} className="min-w-[160px] sm:min-w-0">
                  <ProductCard
                    _id={p._id}
                    name={p.name}
                    image={p.images[0]}
                    price={p.price}
                    stock={p.stock}
                    index={idx}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 10 Products (People Also Bought) */}
        {topProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Top 10 Products
              </h2>
              {topProducts.length > 5 && (
                <span className="text-xs text-green-600 font-semibold md:hidden">
                  Scroll right →
                </span>
              )}
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
              {topProducts.slice(0, 10).map((p, idx) => (
                <div key={p._id} className="min-w-[160px] sm:min-w-0">
                  <ProductCard
                    _id={p._id}
                    name={p.name}
                    image={p.images[0]}
                    price={p.price}
                    stock={p.stock}
                    index={idx}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FloatingCartBar />
    </div>
  );
};

export default ProductDetailsPage;

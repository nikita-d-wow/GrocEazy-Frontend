import type { FC } from 'react';
// Force re-index
import { useEffect, useState, useMemo } from 'react';
import type { CartItem } from '../../../redux/types/cartTypes';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ChevronRight,
  Minus,
  Plus,
  Clock,
  Heart,
  Zap,
  Tag,
  Sparkles,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Percent,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import {
  fetchSimilarProducts,
  fetchTopProducts,
  fetchProductById,
} from '../../../redux/actions/productActions';
import { fetchCoupons } from '../../../redux/actions/couponActions';
import {
  addToCart,
  updateCartQty,
  removeCartItem,
  fetchCart,
} from '../../../redux/actions/cartActions';
import {
  addToWishlist,
  removeWishlistItem,
} from '../../../redux/actions/wishlistActions';

import {
  selectProducts,
  selectSimilarProducts,
  selectTopProducts,
} from '../../../redux/selectors/productSelectors';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';

import ProductCard from '../../../components/customer/ProductCard';
import { getOptimizedImage } from '../../../utils/imageUtils';
import type { RootState } from '../../../redux/store';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const products = useSelector(selectProducts);
  const similarProducts = useSelector(selectSimilarProducts);
  const topProducts = useSelector(selectTopProducts);
  const cartItems = useSelector(selectCartItems);
  const { user } = useSelector((state: RootState) => state.auth);
  const { idMap: wishlistIdMap } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { activeOffers } = useSelector((state: RootState) => state.offer);
  const { coupons } = useSelector((state: RootState) => state.coupon);
  const productDetails = useSelector(
    (state: RootState) => state.product.productDetails
  );

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchSimilarProducts(id));
    }
    dispatch(fetchTopProducts());
    dispatch(fetchCoupons());
    if (user) {
      dispatch(fetchCart());
    }
    window.scrollTo(0, 0);
  }, [dispatch, id, user]);

  const product = useMemo(() => {
    if (productDetails?._id === id) {
      return productDetails;
    }
    return products.find((p) => p._id === id);
  }, [productDetails, products, id]);

  const categoryId = useMemo(() => {
    if (!product) {
      return undefined;
    }
    return typeof product.categoryId === 'object'
      ? (product.categoryId as { _id: string })._id
      : product.categoryId;
  }, [product]);

  // Find best offer for this product
  const bestOffer = useMemo(() => {
    if (!product || !activeOffers || activeOffers.length === 0) {
      return null;
    }

    const _id = product._id;

    const applicableOffers = activeOffers.filter((offer) => {
      // 1. Check Exclusions
      const isExcluded = offer.excludedProducts?.some(
        (id) =>
          id === _id || (typeof id === 'object' && (id as any)._id === _id)
      );
      if (isExcluded) {
        return false;
      }

      // 2. Check Direct Product Match
      const isDirectProduct = offer.applicableProducts?.some(
        (id) =>
          id === _id || (typeof id === 'object' && (id as any)._id === _id)
      );
      if (isDirectProduct) {
        return true;
      }

      // 3. Check Category Match
      const isDirectCategory = offer.applicableCategories?.some(
        (id) =>
          id === categoryId ||
          (typeof id === 'object' && (id as any)._id === categoryId)
      );
      if (isDirectCategory) {
        return true;
      }

      return false;
    });

    if (applicableOffers.length === 0) {
      return null;
    }

    // Sort by highest discount
    return [...applicableOffers].sort((a, b) => {
      const aVal =
        a.offerType === 'percentage'
          ? a.discountValue || 0
          : ((a.discountValue || 0) / product.price) * 100;
      const bVal =
        b.offerType === 'percentage'
          ? b.discountValue || 0
          : ((b.discountValue || 0) / product.price) * 100;
      return bVal - aVal;
    })[0];
  }, [activeOffers, product, categoryId]);

  const discountAmount = useMemo(() => {
    if (!bestOffer || !product) {
      return 0;
    }
    const dVal = bestOffer.discountValue || 0;
    if (bestOffer.offerType === 'percentage') {
      return (product.price * dVal) / 100;
    }
    if (bestOffer.offerType === 'fixed') {
      return dVal;
    }
    return 0;
  }, [bestOffer, product]);

  const discountPercentage = useMemo(() => {
    if (!bestOffer || !product) {
      return 0;
    }
    if (bestOffer.offerType === 'percentage') {
      return bestOffer.discountValue || 0;
    }
    const dAmt = discountAmount || 0;
    return Math.round((dAmt / product.price) * 100);
  }, [bestOffer, product, discountAmount]);

  const discountedPrice = product
    ? Number((product.price - (discountAmount || 0)).toFixed(2))
    : 0;

  // Cart Logic
  const cartItem = (cartItems || []).find(
    (item: CartItem) => (item.product?._id || item.product) === product?._id
  );
  const cartQuantity = cartItem?.quantity ?? 0;

  const wishlistId = wishlistIdMap[product?._id || ''];
  const isInWishlist = !!wishlistId;

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }
    if (!product) {
      return;
    }

    if (isInWishlist) {
      await dispatch(removeWishlistItem(wishlistId));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(
        addToWishlist(product._id, {
          _id: product._id,
          name: product.name,
          price: discountedPrice,
          images: product.images,
          stock: product.stock,
          description: product.description,
        })
      );
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    try {
      // Use discounted price for unitPrice in cart
      await dispatch(
        addToCart(product._id, 1, {
          _id: product._id,
          name: product.name,
          price: discountedPrice,
          images: product.images,
          stock: product.stock,
        })
      );
      toast.success('Item added to cart');
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
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  const categoryName =
    typeof product.categoryId === 'object'
      ? (product.categoryId as { name: string }).name
      : 'Groceries';

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      {/* Breadcrumb Header */}
      <div className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link
            to="/"
            className="hover:text-green-600 shrink-0 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <Link
            to={`/products?category=${categoryId}`}
            className="hover:text-green-600 shrink-0 transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="text-gray-900 font-bold truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 items-start">
          {/* LEFT: Image Gallery */}
          <div className="bg-white rounded-3xl p-6 border-b md:border border-gray-100 shadow-sm relative">
            {discountPercentage > 0 && (
              <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-2xl font-black text-sm z-30 shadow-xl shadow-red-200 animate-bounce flex items-center gap-2">
                <Percent size={16} fill="white" />
                {discountPercentage}% OFF
              </div>
            )}

            <div className="relative mb-6 flex justify-center h-[350px] md:h-[450px]">
              <img
                src={getOptimizedImage(
                  product.images[selectedImage] || product.images[0],
                  1000
                )}
                alt={product.name}
                className="h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 justify-center overflow-x-auto py-3 no-scrollbar relative">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl transition-all duration-300 flex-shrink-0 relative p-1 ${
                      idx === selectedImage
                        ? 'ring-4 ring-green-600 ring-offset-2 scale-110 shadow-xl z-20'
                        : 'bg-white hover:ring-2 hover:ring-green-300 z-0'
                    }`}
                  >
                    <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                      <img
                        src={getOptimizedImage(img, 200)}
                        className="w-full h-full object-contain"
                        alt="thumbnail"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="pt-6 md:pt-0">
            <div className="mb-6">
              <Link
                to={`/products?category=${categoryId}`}
                className="text-sm font-bold text-gray-500 hover:text-green-600 mb-1 block transition-colors"
              >
                View all by {categoryName}
              </Link>
              <h1 className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg w-fit">
                    <Clock className="w-4 h-4 text-gray-700" />
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      10 MINS
                    </span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg w-fit border border-red-100">
                      <Zap className="w-4 h-4 text-red-600 fill-red-600" />
                      <span className="text-xs font-black text-red-600 uppercase tracking-tighter">
                        DEAL OF THE DAY
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard');
                      }
                    }}
                    className="p-2.5 rounded-xl bg-white text-gray-400 border border-gray-100 hover:text-blue-500 transition-all shadow-sm cursor-pointer"
                    title="Share product"
                  >
                    <Share2 size={20} />
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                      isInWishlist
                        ? 'bg-red-50 text-red-500 border border-red-100'
                        : 'bg-white text-gray-400 border border-gray-100 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      size={22}
                      fill={isInWishlist ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>

              <div className="text-base sm:text-lg font-medium text-gray-500 mb-6 font-bold">
                {product.size}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8">
                <div className="flex flex-col">
                  {discountPercentage > 0 && (
                    <span className="text-gray-400 line-through text-sm font-bold decoration-red-400/50">
                      ₹{product.price}
                    </span>
                  )}
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                    ₹{discountedPrice}
                    <span className="text-[10px] sm:text-sm font-normal text-gray-400 ml-2 block sm:inline">
                      (Inclusive of all taxes)
                    </span>
                  </div>
                </div>

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
                    <div className="flex items-center justify-between w-full bg-green-700 text-white rounded-xl shadow-lg font-bold overflow-hidden">
                      <button
                        onClick={decrementCart}
                        className="p-3 hover:bg-green-800 transition-colors flex-1 flex justify-center"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg px-2">{cartQuantity}</span>
                      <button
                        onClick={incrementCart}
                        disabled={cartQuantity >= product.stock}
                        className="p-3 hover:bg-green-800 transition-colors flex-1 flex justify-center disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 shadow-sm">
                  <Truck size={12} strokeWidth={3} />
                  FLASH DELIVERY
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 shadow-sm">
                  <ShieldCheck size={12} strokeWidth={3} />
                  100% QUALITY
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100 shadow-sm">
                  <RotateCcw size={12} strokeWidth={3} />
                  EASY RETURNS
                </div>
              </div>

              {/* Best Coupon Display */}
              {(() => {
                if (!product) {
                  return null;
                }
                const relevantCoupons = coupons.filter(
                  (c) =>
                    c.isActive &&
                    // Check direct product match
                    (c.applicableProducts?.includes(product._id) ||
                      // Check category match
                      c.applicableCategories?.includes(
                        typeof product.categoryId === 'string'
                          ? product.categoryId
                          : product.categoryId._id
                      ))
                );

                if (relevantCoupons.length === 0) {
                  return null;
                }

                // Simple best coupon logic: highest discount value or percentage
                const bestCoupon = relevantCoupons.reduce((prev, current) => {
                  const getVal = (c: any) =>
                    c.discountType === 'percentage'
                      ? c.discountValue
                      : (c.discountValue / product.price) * 100;
                  return getVal(current) > getVal(prev) ? current : prev;
                });

                return (
                  <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-900">
                        {bestCoupon.discountType === 'percentage'
                          ? `Get extra ${bestCoupon.discountValue}% OFF`
                          : `Save ₹${bestCoupon.discountValue}`}{' '}
                        with code
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(bestCoupon.code);
                          toast.success('Coupon code copied!');
                        }}
                        className="text-xs font-black text-indigo-600 border border-indigo-200 bg-white px-2 py-1 rounded mt-1 hover:bg-indigo-50 transition-colors uppercase tracking-wider flex items-center gap-1 w-fit"
                      >
                        {bestCoupon.code}{' '}
                        <span className="opacity-50">| COPY</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {product.description && (
                <div className="mb-8 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Product Details
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Why shop from GrocEazy?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm border border-emerald-100/50">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
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

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 shadow-sm border border-amber-100/50">
                      <Tag className="w-5 h-5 sm:w-6 sm:h-6" />
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

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 shadow-sm border border-purple-100/50">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        Curated for Every Occasion
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed">
                        Find an exhaustive range of products tailored to your
                        lifestyle and needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Similar Products
              </h2>
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
                    categoryId={
                      typeof p.categoryId === 'object'
                        ? p.categoryId._id
                        : p.categoryId
                    }
                    index={idx}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 10 Products Section with Fallback */}
        {(() => {
          const baseList = topProducts.length > 0 ? topProducts : products;
          const displayTop = baseList.filter((p) => p._id !== id).slice(0, 10);

          if (displayTop.length === 0) {
            return null;
          }

          return (
            <div className="mt-12 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Top 10 Products
                </h2>
                <span className="text-xs text-green-600 font-semibold md:hidden">
                  Scroll right →
                </span>
              </div>
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
                {displayTop.map((p, idx) => (
                  <div key={p._id} className="min-w-[160px] sm:min-w-0">
                    <ProductCard
                      _id={p._id}
                      name={p.name}
                      image={p.images[0]}
                      price={p.price}
                      stock={p.stock}
                      categoryId={
                        typeof p.categoryId === 'object'
                          ? p.categoryId._id
                          : p.categoryId
                      }
                      index={idx}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ProductDetailsPage;

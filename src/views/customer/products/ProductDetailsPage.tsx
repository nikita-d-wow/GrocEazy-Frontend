import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { CartItem } from '../../../redux/types/cartTypes';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, Minus, Plus, Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchProducts } from '../../../redux/actions/productActions';
import {
  addToWishlist,
  removeWishlistItem,
} from '../../../redux/actions/wishlistActions';
import { addToCart, updateCartQty } from '../../../redux/actions/cartActions';

import { selectProducts } from '../../../redux/selectors/productSelectors';
import { selectWishlistItems } from '../../../redux/selectors/wishlistSelectors';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';

import ProductCard from '../../../components/products/ProductCard';
import FloatingCartBar from '../../../components/customer/cart/FloatingCartBar';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const products = useSelector(selectProducts);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const product = products.find((p) => p._id === id);

  // Cart Logic
  const cartItem = cartItems.find(
    (item: CartItem) => item.product._id === product?._id
  );
  const cartQuantity = cartItem?.quantity ?? 0;
  const [localQuantity, setLocalQuantity] = useState(1);

  const wishlistItem = wishlistItems?.find(
    (item: any) => item.product?._id === product?._id
  );
  const isWishlisted = Boolean(wishlistItem);

  const toggleWishlist = () => {
    if (!product) {
      return;
    }

    if (isWishlisted && wishlistItem) {
      dispatch(removeWishlistItem(wishlistItem._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    try {
      await dispatch(addToCart(product._id, localQuantity));
      toast.success(`Added ${localQuantity} ${product.name} to cart`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const incrementCart = () => {
    if (product) {
      dispatch(updateCartQty(product._id, cartQuantity + 1));
    }
  };

  const decrementCart = () => {
    if (product) {
      dispatch(updateCartQty(product._id, cartQuantity - 1));
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const similarProducts = products
    .filter((p) => p.categoryId === product.categoryId && p._id !== product._id)
    .slice(0, 4);

  const peopleAlsoBought = products
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* Left Column: Image */}
          <div>
            <div className="bg-white rounded-2xl p-4 mb-4 relative">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />

              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:scale-105 transition"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mb-6">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      idx === selectedImage
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info Section */}
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {product.size && (
                <p className="text-gray-500 mb-4">{product.size}</p>
              )}

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
              </div>

              {product.stock === 0 && (
                <p className="text-red-600 font-medium mb-6">Out of stock</p>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>

                {cartQuantity > 0 ? (
                  <div className="flex items-center gap-3 bg-green-50 w-full md:w-fit px-4 py-3 rounded-lg border border-green-200">
                    <button
                      onClick={decrementCart}
                      className="p-2 rounded bg-white text-green-700 hover:bg-green-100 shadow-sm transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-xl min-w-[30px] text-center text-green-800">
                      {cartQuantity}
                    </span>
                    <button
                      onClick={incrementCart}
                      disabled={cartQuantity >= product.stock}
                      className="p-2 rounded bg-white text-green-700 hover:bg-green-100 shadow-sm transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 w-full md:w-fit px-4 py-3 rounded-lg">
                    <button
                      onClick={() =>
                        setLocalQuantity(Math.max(1, localQuantity - 1))
                      }
                      className="hover:bg-gray-200 p-2 rounded transition-colors"
                      disabled={localQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg min-w-[30px] text-center">
                      {localQuantity}
                    </span>
                    <button
                      onClick={() =>
                        setLocalQuantity(
                          Math.min(product.stock, localQuantity + 1)
                        )
                      }
                      className="hover:bg-gray-200 p-2 rounded transition-colors"
                      disabled={localQuantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {cartQuantity === 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              )}

              {product.description && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.dietary && (
                <div className="mt-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {product.dietary}
                  </span>
                </div>
              )}
            </div>

            {/* Why Shop From Us Section */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Why Shop From Us?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="text-2xl">🚚</div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">
                      Superfast Delivery
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Get it delivered in 10 minutes from your local store to
                      your doorstep.
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <h4 className="font-bold text-green-900 text-sm">
                      Farm Fresh Quality
                    </h4>
                    <p className="text-xs text-green-700 mt-1">
                      100% fresh produce sourced directly from farmers and
                      trusted suppliers.
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="text-2xl">↩️</div>
                  <div>
                    <h4 className="font-bold text-purple-900 text-sm">
                      Easy Returns
                    </h4>
                    <p className="text-xs text-purple-700 mt-1">
                      Not satisfied? Return within 24 hours for a full refund,
                      no questions asked.
                    </p>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h4 className="font-bold text-orange-900 text-sm">
                      Best Prices
                    </h4>
                    <p className="text-xs text-orange-700 mt-1">
                      Competitive pricing with daily deals and exclusive offers
                      for members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {peopleAlsoBought.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              People Also Bought
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {peopleAlsoBought.map((p) => (
                <ProductCard key={p._id} product={p} />
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

import { useNavigate } from 'react-router-dom';
// Force re-index
import { getOptimizedImage } from '../../utils/imageUtils';
import type { RootState } from '../../redux/store';
import * as React from 'react';
import { motion } from 'framer-motion';
// import { categoryBgVariants } from '../../utils/colors';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  addToCart,
  updateCartQty,
  removeCartItem,
} from '../../redux/actions/cartActions';
import {
  addToWishlist,
  removeWishlistItem,
} from '../../redux/actions/wishlistActions';
import { useSelector } from 'react-redux';
import { Plus, Minus, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import type { CustomerProductCardProps } from '../../types/Product';

interface Props extends CustomerProductCardProps {
  index?: number;
}

export default function ProductCard({
  _id,
  name,
  image,
  price,
  stock,
  index = 0,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { itemMap } = useSelector((state: RootState) => state.cart);
  const { idMap: wishlistIdMap } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const cartItem = itemMap[_id];
  const quantity = cartItem ? cartItem.quantity : 0;

  const wishlistId = wishlistIdMap[_id];
  const isInWishlist = !!wishlistId;

  const handleWishlistFn = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    if (isInWishlist) {
      await dispatch(removeWishlistItem(wishlistId));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(
        addToWishlist(_id, {
          _id,
          name,
          price,
          images: [image],
          stock: stock || 0,
          description: '', // Optional or empty for now
        })
      );
      toast.success('Added to wishlist');
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  } as any;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/products/${_id}`)}
      className="bg-white rounded-[20px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group h-full flex flex-col border border-gray-100/50 hover:border-green-100"
    >
      <div
        className={`relative bg-gray-50/50 group-hover:bg-gradient-to-tr group-hover:from-green-50/50 group-hover:to-emerald-50/50 rounded-2xl p-4 mb-3 overflow-hidden h-44 flex items-center justify-center transition-colors duration-500`}
      >
        <img
          src={getOptimizedImage(image, 400)} // Request 400px for card
          alt={name}
          loading={index > 4 ? 'lazy' : 'eager'}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-sm"
        />

        {stock !== undefined && stock < 10 && stock > 0 && (
          <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm border border-amber-100 text-amber-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider z-20 shadow-sm">
            Low Stock
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-50/90 backdrop-blur-sm border border-red-100 text-red-600 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider z-20 shadow-sm">
            Sold Out
          </span>
        )}
        <button
          onClick={handleWishlistFn}
          className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-300 cursor-pointer z-20 ${
            isInWishlist
              ? 'bg-red-50 text-red-500 shadow-sm'
              : 'bg-white/60 hover:bg-white text-gray-400 hover:text-red-500 hover:shadow-sm'
          }`}
        >
          <Heart
            size={16}
            fill={isInWishlist ? 'currentColor' : 'none'}
            className="transition-transform active:scale-90"
          />
        </button>
      </div>

      <div className="flex flex-col flex-grow text-left px-1">
        <p className="text-gray-900 font-bold text-[15px] mb-1 line-clamp-2 leading-tight group-hover:text-green-800 transition-colors">
          {name}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <p className="text-gray-900 font-bold text-lg">₹{price}</p>
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if ((stock ?? 1) > 0) {
                  dispatch(
                    addToCart(_id, 1, {
                      _id,
                      name,
                      price,
                      images: [image],
                      stock: stock ?? 0,
                    })
                  );
                }
              }}
              disabled={stock === 0}
              className={`px-3 sm:px-4 py-1.5 rounded-lg border font-bold text-[10px] sm:text-xs uppercase transition-all whitespace-nowrap flex items-center justify-center ${
                stock === 0
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'border-green-600 text-green-600 hover:bg-green-50 cursor-pointer min-w-[80px]'
              }`}
            >
              {stock === 0 ? 'SOLD OUT' : 'ADD'}
            </button>
          ) : (
            <div
              className="flex items-center gap-2 bg-green-50 rounded-lg px-2 py-1 border border-green-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity > 0 && cartItem) {
                    if (quantity === 1) {
                      dispatch(removeCartItem(cartItem._id));
                    } else {
                      dispatch(updateCartQty(cartItem._id, quantity - 1));
                    }
                  }
                }}
                className="w-6 h-6 flex items-center justify-center bg-white rounded text-green-700 shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-sm font-bold text-green-700 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (stock !== undefined && quantity < stock) {
                    if (cartItem) {
                      dispatch(updateCartQty(cartItem._id, quantity + 1));
                    }
                  } else if (stock !== undefined && quantity >= stock) {
                    toast.error('Maximum available stock reached');
                  }
                }}
                disabled={stock !== undefined && quantity >= stock}
                className={`w-6 h-6 flex items-center justify-center rounded text-white shadow-sm transition-colors ${
                  stock !== undefined && quantity >= stock
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-700 hover:bg-green-800 cursor-pointer'
                }`}
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

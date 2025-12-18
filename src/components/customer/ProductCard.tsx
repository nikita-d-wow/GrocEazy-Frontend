import { useNavigate } from 'react-router-dom';
import React from 'react';
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
import { selectWishlistItems } from '../../redux/selectors/wishlistSelectors';
import { useSelector } from 'react-redux';
import { Plus, Minus, Heart } from 'lucide-react';
import type { RootState } from '../../redux/rootReducer';
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
  // index = 0,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const wishlistItems = useSelector(selectWishlistItems);
  const { user } = useSelector((state: RootState) => state.auth);

  const cartItem = items.find(
    (item: any) => item.product?._id === _id || item.product === _id
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const wishlistItem = wishlistItems.find((item) => item.product._id === _id);
  const isInWishlist = !!wishlistItem;

  const handleWishlistFn = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to use wishlist');
      return;
    }

    if (isInWishlist) {
      await dispatch(removeWishlistItem(wishlistItem!._id));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(_id));
      toast.success('Added to wishlist');
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col"
    >
      <div
        className={`relative bg-gray-50 rounded-xl p-4 mb-3 overflow-hidden h-40 flex items-center justify-center`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform mix-blend-multiply"
        />
        {stock !== undefined && stock < 10 && stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Low
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Sold Out
          </span>
        )}
        <button
          onClick={handleWishlistFn}
          className={`absolute top-2 left-2 p-1.5 rounded-full transition-colors ${
            isInWishlist
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/50 hover:bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col flex-grow text-left">
        <p className="text-gray-900 font-bold text-sm mb-1 line-clamp-2 leading-tight">
          {name}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="text-green-600 font-bold text-base">₹{price}</p>
          {quantity === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(addToCart(_id, 1));
              }}
              className="px-6 py-1.5 rounded-lg border border-green-600 text-green-600 font-bold text-sm hover:bg-green-50 uppercase transition-colors"
            >
              ADD
            </button>
          ) : (
            <div
              className="flex items-center gap-2 bg-green-50 rounded-lg px-2 py-1 border border-green-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (quantity === 1) {
                    dispatch(removeCartItem(cartItem!._id));
                  } else {
                    dispatch(updateCartQty(cartItem!._id, quantity - 1));
                  }
                }}
                className="w-6 h-6 flex items-center justify-center bg-white rounded text-green-700 shadow-sm hover:bg-gray-50"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-sm font-bold text-green-700 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(updateCartQty(cartItem!._id, quantity + 1));
                }}
                className="w-6 h-6 flex items-center justify-center bg-green-700 rounded text-white shadow-sm hover:bg-green-800"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

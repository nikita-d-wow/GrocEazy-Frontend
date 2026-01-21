import React, { useState } from 'react';
import { Minus, Plus, Trash2, Heart, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CartItemProps } from '../../../types/Cart';

interface ExtraProps {
  isInWishlist?: boolean;
  moveToWishlist: (cartId: string, productId: string) => void;
}

export default function CartItem({
  item,
  isInWishlist,
  updateQty,
  removeItem,
  moveToWishlist,
}: CartItemProps & ExtraProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<'inc' | 'dec' | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);

  const handleMoveToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || isInWishlist || isMovingToWishlist) {
      return;
    }
    setIsMovingToWishlist(true);
    try {
      await moveToWishlist(item._id, item.productId);
      toast.success('Moved to wishlist ❤️');
    } finally {
      setIsMovingToWishlist(false);
    }
  };

  const isIncrementDisabled = item.quantity >= item.stock || loading !== null;
  const isDecrementDisabled = item.quantity <= 1 || loading !== null;

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isIncrementDisabled) {
      toast.error(
        item.stock === 0
          ? 'Out of stock'
          : `Only ${item.stock} item(s) available`
      );
      return;
    }

    setLoading('inc');
    try {
      await updateQty(item._id, 'inc');
    } finally {
      setLoading(null);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDecrementDisabled) {
      return;
    }

    setLoading('dec');
    try {
      await updateQty(item._id, 'dec');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRemoving) {
      return;
    }
    setIsRemoving(true);
    try {
      await removeItem(item._id);
    } catch {
      setIsRemoving(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${item.productId}`)}
      className="
        bg-white p-4 sm:p-6
        rounded-2xl sm:rounded-3xl
        border border-gray-200
        shadow-sm
        transition
        flex flex-col sm:flex-row gap-4 sm:gap-6
        cursor-pointer
      "
    >
      {/* LEFT */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
        <img
          src={item.image}
          alt={item.name}
          className="
            w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28
            rounded-xl object-cover
            border border-gray-100
            shrink-0
          "
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2">
            {item.name}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Price:{' '}
            <span className="text-primary font-semibold">
              ₹{item.unitPrice}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
                item.stock > 0
                  ? 'bg-green-50/50 border-green-100 text-green-700'
                  : 'bg-red-50/50 border-red-100 text-red-700'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}
              />
              {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
            </div>

            {item.quantity > item.stock && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                <AlertCircle size={10} className="text-orange-600" />
                Insufficient Stock
              </div>
            )}
          </div>

          {/* QUANTITY */}
          <div className="mt-3 flex items-center gap-4 justify-start">
            <button
              onClick={handleDecrement}
              disabled={isDecrementDisabled}
              className={`
                p-2 rounded-lg border transition-all active:scale-95
                ${
                  isDecrementDisabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 cursor-pointer shadow-sm'
                }
              `}
            >
              {loading === 'dec' ? (
                <Loader2 size={16} className="animate-spin text-red-600" />
              ) : (
                <Minus size={16} />
              )}
            </button>

            <span className="font-semibold text-gray-900 tabular-nums">
              {item.quantity}
            </span>

            {/* INCREMENT */}
            <button
              onClick={handleIncrement}
              disabled={isIncrementDisabled}
              className={`
                p-2 rounded-lg border transition-all active:scale-95
                ${
                  isIncrementDisabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700 cursor-pointer shadow-sm'
                }
              `}
            >
              {loading === 'inc' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          w-full sm:w-auto
          flex flex-row sm:flex-col
          justify-between sm:justify-start
          items-center sm:items-end
          gap-3 sm:gap-4
          pt-2 sm:pt-0
          border-t sm:border-t-0 border-gray-100
        "
      >
        <button
          onClick={handleMoveToWishlist}
          disabled={isInWishlist || isMovingToWishlist}
          className={`
            inline-flex items-center gap-2
            px-3 py-1.5 rounded-xl
            text-xs font-bold uppercase tracking-wide transition-all duration-300
            ${
              isInWishlist
                ? 'bg-red-50 text-red-500 border border-red-100 shadow-sm cursor-default'
                : 'bg-white text-gray-400 border border-gray-100 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 hover:shadow-md cursor-pointer'
            }
          `}
        >
          {isMovingToWishlist ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Heart
              size={14}
              fill={isInWishlist ? 'currentColor' : 'none'}
              className={
                isInWishlist
                  ? 'animate-bounce'
                  : 'group-hover:scale-110 transition-transform'
              }
            />
          )}
          {isMovingToWishlist
            ? 'Moving...'
            : isInWishlist
              ? 'In Wishlist'
              : 'Add to Wishlist'}
        </button>

        <div className="flex items-center gap-3">
          <p className="font-bold text-gray-900">
            ₹
            {item.lineTotal?.toFixed(2) ??
              (item.unitPrice * item.quantity).toFixed(2)}
          </p>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isRemoving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

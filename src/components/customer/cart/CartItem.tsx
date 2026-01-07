import React, { useState } from 'react';
import { Minus, Plus, Trash2, Heart, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { CartItemProps } from '../../../types/Cart';

interface ExtraProps {
  isInWishlist?: boolean;
  // eslint-disable-next-line no-unused-vars
  moveToWishlist: (_cartId: string, _productId: string) => void;
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

  const handleMoveToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || isInWishlist) {
      return;
    }
    moveToWishlist(item._id, item.productId);
    toast.success('Moved to wishlist ❤️');
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
        bg-card p-4 sm:p-6
        rounded-2xl sm:rounded-3xl
        border border-border
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
            border border-border
            shrink-0
          "
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text text-base sm:text-lg line-clamp-2">
            {item.name}
          </p>

          <p className="text-sm text-muted-text mt-1">
            Price:{' '}
            <span className="text-primary font-semibold">
              ₹{item.unitPrice}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
                item.stock > 0
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-500'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
              />
              {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
            </div>

            {item.quantity > item.stock && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                <AlertCircle size={10} className="text-amber-500" />
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
                    ? 'bg-muted border-border text-muted-text cursor-not-allowed opacity-50'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20 cursor-pointer shadow-sm'
                }
              `}
            >
              {loading === 'dec' ? (
                <Loader2 size={16} className="animate-spin text-rose-500" />
              ) : (
                <Minus size={16} />
              )}
            </button>

            <span className="font-semibold text-text tabular-nums">
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
                    ? 'bg-muted border-border text-muted-text cursor-not-allowed opacity-50'
                    : 'bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary cursor-pointer shadow-sm'
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
          border-t sm:border-t-0 border-border
        "
      >
        <button
          onClick={handleMoveToWishlist}
          disabled={isInWishlist}
          className={`
            inline-flex items-center gap-2
            px-3 py-1.5 rounded-xl
            text-xs font-bold uppercase tracking-wide transition-all duration-300
            ${
              isInWishlist
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-sm cursor-default'
                : 'bg-card text-muted-text border border-border hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/10 hover:shadow-md cursor-pointer'
            }
          `}
        >
          <Heart
            size={14}
            fill={isInWishlist ? 'currentColor' : 'none'}
            className={
              isInWishlist
                ? 'animate-bounce'
                : 'group-hover:scale-110 transition-transform'
            }
          />
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </button>

        <div className="flex items-center gap-3">
          <p className="font-bold text-text">
            ₹{item.unitPrice * item.quantity}
          </p>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-rose-500 hover:text-rose-600 cursor-pointer disabled:opacity-50 transition-all"
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

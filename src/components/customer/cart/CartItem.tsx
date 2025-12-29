import { Minus, Plus, Trash2, Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { CartItemProps } from '../../../types/Cart';

interface ExtraProps {
  isInWishlist?: boolean;
  moveToWishlist: (_cartId: string, _productId: string) => void;
}

export default function CartItem({
  item,
  isInWishlist,
  updateQty,
  removeItem,
  moveToWishlist,
}: CartItemProps & ExtraProps) {
  const [loading, setLoading] = useState<'inc' | 'dec' | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleMoveToWishlist = () => {
    if (loading || isInWishlist) {
      return;
    }
    moveToWishlist(item._id, item.productId);
    toast.success('Moved to wishlist ❤️');
  };

  const isIncrementDisabled = item.quantity >= item.stock || loading !== null;

  const handleIncrement = async () => {
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

  const handleDecrement = async () => {
    if (item.quantity <= 1 || loading !== null) {
      return;
    }

    setLoading('dec');
    try {
      await updateQty(item._id, 'dec');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) {
      return;
    }
    setIsRemoving(true);
    try {
      await removeItem(item._id);
    } catch (error) {
      setIsRemoving(false);
    }
  };

  return (
    <div
      className="
        bg-white p-4 sm:p-6
        rounded-2xl sm:rounded-3xl
        border border-gray-200
        shadow-sm
        transition
        flex flex-col sm:flex-row gap-4 sm:gap-6
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

          {/* QUANTITY */}
          <div className="mt-3 flex items-center gap-4 justify-start">
            {item.quantity > 1 && (
              <button
                onClick={handleDecrement}
                className="
                  p-2 rounded-lg cursor-pointer
                  bg-red-50 border border-red-200
                  hover:bg-red-100
                "
              >
                {loading === 'dec' ? (
                  <Loader2 size={16} className="animate-spin text-red-600" />
                ) : (
                  <Minus size={16} className="text-red-600" />
                )}
              </button>
            )}

            <span className="font-semibold text-gray-900">{item.quantity}</span>

            {/* INCREMENT */}
            <button
              onClick={handleIncrement}
              className={`
                p-2 rounded-lg border cursor-pointer transition-colors
                ${
                  isIncrementDisabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400'
                    : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700'
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
          disabled={isInWishlist}
          className={`
            inline-flex items-center gap-2
            text-sm font-medium transition-colors
            ${
              isInWishlist
                ? 'text-pink-500 cursor-default'
                : 'text-primary hover:underline cursor-pointer'
            }
          `}
        >
          <Heart
            size={14}
            className={isInWishlist ? 'fill-pink-500 text-pink-500' : ''}
          />
          {isInWishlist ? 'In Wishlist' : 'Wishlist'}
        </button>

        <div className="flex items-center gap-3">
          <p className="font-bold text-gray-900">
            ₹{item.unitPrice * item.quantity}
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

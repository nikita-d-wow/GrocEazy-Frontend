import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CartItemProps } from '../../../types/Cart.jsx';

interface ExtraProps {
  moveToWishlist: (_cartId: string, _productId: string) => void;
}

export default function CartItem({
  item,
  updateQty,
  removeItem,
  moveToWishlist,
}: CartItemProps & ExtraProps) {
  const handleMoveToWishlist = () => {
    moveToWishlist(item._id, item.productId);
    toast.success('Moved to wishlist ❤️');
  };

  const isIncrementDisabled = item.quantity >= item.stock;

  const handleIncrement = () => {
    // 🔒 HARD STOP — API WILL NOT BE CALLED
    if (isIncrementDisabled) {
      toast.error(
        item.stock === 0
          ? 'Out of stock'
          : `Only ${item.stock} item(s) available`
      );
      return;
    }

    updateQty(item._id, 'inc');
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
                onClick={() => updateQty(item._id, 'dec')}
                className="
                  p-2 rounded-lg cursor-pointer
                  bg-red-50 border border-red-200
                  hover:bg-red-100
                "
              >
                <Minus size={16} className="text-red-600" />
              </button>
            )}

            <span className="font-semibold text-gray-900">{item.quantity}</span>

            {/* INCREMENT */}
            <button
              onClick={handleIncrement}
              disabled={isIncrementDisabled}
              className={`
                p-2 rounded-lg border transition-colors
                ${
                  isIncrementDisabled
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400'
                    : 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700 cursor-pointer'
                }
              `}
            >
              <Plus size={16} />
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
          className="
            inline-flex items-center gap-2
            text-primary text-sm font-medium
            hover:underline cursor-pointer
          "
        >
          <Heart size={14} />
          Wishlist
        </button>

        <div className="flex items-center gap-3">
          <p className="font-bold text-gray-900">
            ₹{item.unitPrice * item.quantity}
          </p>

          <button
            onClick={() => removeItem(item._id)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

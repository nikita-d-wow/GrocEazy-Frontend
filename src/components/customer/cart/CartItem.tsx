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

    toast.success('Moved to wishlist ❤️', {
      style: {
        borderRadius: '12px',
        background: '#fff',
        color: '#111',
      },
    });
  };

  return (
    <div
      className="
        bg-white p-4 sm:p-6
        rounded-2xl sm:rounded-3xl
        border border-gray-200
        shadow-[0_4px_14px_rgba(0,0,0,0.07)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]
        transition-all duration-300 hover:-translate-y-1
        flex flex-col sm:flex-row gap-4 sm:gap-6
        items-start sm:items-center
        animate-fadeSlide
      "
    >
      {/* IMAGE */}
      <img
        src={item.image}
        alt={item.name}
        className="
          w-20 h-20
          sm:w-24 sm:h-24
          lg:w-28 lg:h-28
          rounded-xl sm:rounded-2xl
          object-cover
          shadow-md
          border border-gray-100
          shrink-0
        "
      />

      {/* PRODUCT INFO */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-base sm:text-lg lg:text-xl break-words">
          {item.name}
        </p>

        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Price:{' '}
          <span className="text-primary font-semibold">₹{item.unitPrice}</span>
        </p>

        {/* ✅ Wishlist — PRIMARY COLOR */}
        <button
          type="button"
          onClick={handleMoveToWishlist}
          className="
            mt-2 inline-flex items-center gap-2
            px-3 py-1.5
            rounded-full
            bg-primary/10 text-primary
            text-xs sm:text-sm font-semibold
            hover:bg-primary/20
            active:scale-95
            transition
          "
        >
          <Heart size={14} />
          Move to wishlist
        </button>

        {/* QUANTITY */}
        <div className="mt-4 flex items-center gap-3 sm:gap-4">
          {item.quantity > 1 && (
            <button
              type="button"
              onClick={() => updateQty(item._id, 'dec')}
              className="
                p-2 rounded-lg sm:rounded-xl
                bg-red-50 border border-red-200
                hover:bg-red-100
                active:scale-90
                transition shadow-sm
              "
            >
              <Minus size={16} className="text-red-600" />
            </button>
          )}

          <span className="font-semibold text-gray-900 text-sm sm:text-lg px-2">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => updateQty(item._id, 'inc')}
            className="
              p-2 rounded-lg sm:rounded-xl
              bg-green-50 border border-green-200
              hover:bg-green-100
              active:scale-90
              transition shadow-sm
            "
          >
            <Plus size={16} className="text-green-700" />
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          w-full sm:w-auto
          flex sm:flex-col
          justify-between sm:justify-center
          items-center sm:items-end
          gap-2 sm:gap-4
          text-right
        "
      >
        <p className="text-lg sm:text-xl font-bold text-gray-900">
          ₹{item.unitPrice * item.quantity}
        </p>

        <button
          type="button"
          onClick={() => removeItem(item._id)}
          className="
            text-red-500 hover:text-red-700
            active:scale-95
            transition
          "
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

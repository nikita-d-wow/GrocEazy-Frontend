import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItemProps } from '../../../types/Cart.jsx';

export default function CartItem({
  item,
  updateQty,
  removeItem,
}: CartItemProps) {
  return (
    <div
      className="
        bg-white p-6 rounded-3xl border border-gray-200
        shadow-[0_4px_14px_rgba(0,0,0,0.07)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]
        transition-all duration-300 hover:-translate-y-1
        flex gap-6 items-center animate-fadeSlide
      "
    >
      {/* IMAGE */}
      <img
        src={item.image}
        alt={item.name}
        className="w-28 h-28 rounded-2xl object-cover shadow-md border border-gray-100"
      />

      {/* PRODUCT INFO */}
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-xl">{item.name}</p>

        <p className="text-gray-500 mt-1">
          Price:{' '}
          <span className="text-primary font-semibold">₹{item.unitPrice}</span>
        </p>

        {/* QUANTITY */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => updateQty(item._id, 'dec')}
            className="
              p-2 rounded-xl bg-red-50 border border-red-200 
              hover:bg-red-100 active:scale-90 transition shadow-sm
            "
          >
            <Minus size={16} className="text-red-600" />
          </button>

          <span className="font-semibold text-gray-900 text-lg px-2">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQty(item._id, 'inc')}
            className="
              p-2 rounded-xl bg-green-50 border border-green-200 
              hover:bg-green-100 active:scale-90 transition shadow-sm
            "
          >
            <Plus size={16} className="text-green-700" />
          </button>
        </div>
      </div>

      {/* TOTAL + REMOVE */}
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">
          ₹{item.unitPrice * item.quantity}
        </p>

        <button
          onClick={() => removeItem(item._id)}
          className="text-red-500 hover:text-red-700 mt-4 active:scale-95 transition"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}

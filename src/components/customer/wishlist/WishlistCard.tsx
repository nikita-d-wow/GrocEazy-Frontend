import { useDispatch } from 'react-redux';
import { Trash2, ShoppingCart } from 'lucide-react';

import {
  removeWishlistItem,
  moveWishlistToCart,
} from '../../../redux/actions/wishlistActions';

import type { AppDispatch } from '../../../redux/store';

type Props = {
  item: any;
};

export default function WishlistCard({ item }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="
        bg-white/70 backdrop-blur-xl
        border border-gray-200
        rounded-3xl p-5
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="w-full h-44 object-contain bg-gray-50 rounded-2xl p-2"
      />

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-lg">{item.product.name}</h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {item.product.description}
        </p>

        <p className="text-primary font-bold text-lg">₹{item.product.price}</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => dispatch(moveWishlistToCart(item._id))}
          className="
            flex-1 flex items-center justify-center gap-2
            bg-primary text-white
            py-2 rounded-xl
            hover:bg-primary-dark
            active:scale-95 transition
          "
        >
          <ShoppingCart size={18} />
          Move to Cart
        </button>

        <button
          onClick={() => dispatch(removeWishlistItem(item._id))}
          className="
            p-3 rounded-xl
            bg-red-50 text-red-600
            hover:bg-red-100
            active:scale-95 transition
          "
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

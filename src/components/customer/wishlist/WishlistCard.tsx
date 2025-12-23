import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(removeWishlistItem(item._id));
    } catch (e) {
      // console.error(e);
      // Only reset if it fails, otherwise item gets removed
      setIsDeleting(false);
    }
  };

  const isOutOfStock = item.product.stock < 1;

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

        {/* OUT OF STOCK LABEL */}
        {isOutOfStock && (
          <p className="text-sm text-red-500 font-medium">Out of stock</p>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          disabled={isOutOfStock}
          onClick={() =>
            dispatch(
              moveWishlistToCart(item._id, {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                images: item.product.images,
                stock: item.product.stock,
                description: item.product.description,
              })
            )
          }
          className={`
            flex-1 flex items-center justify-center gap-2
            py-2 rounded-xl transition
            ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark active:scale-95 cursor-pointer'
            }
          `}
        >
          <ShoppingCart size={18} />
          {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="
            p-3 rounded-xl cursor-pointer
            bg-red-50 text-red-600
            hover:bg-red-100
            active:scale-95 transition
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {isDeleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

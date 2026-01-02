import { ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { useSelector } from 'react-redux';
import { clearCart } from '../../../redux/actions/cartActions';
import type { RootState } from '../../../redux/rootReducer';
import toast from 'react-hot-toast';

export default function CartHeader() {
  const dispatch = useAppDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const isEmpty = items.length === 0;

  const handleClear = () => {
    if (isEmpty) {
      return;
    }
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-2 animate-fadeDown">
          <ShoppingCart size={32} className="text-primary" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Cart
          </h1>
        </div>
        <p className="text-gray-600 animate-fadeDown">
          Review items before checkout
        </p>
      </div>

      <button
        onClick={handleClear}
        disabled={isEmpty}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all w-fit border shadow-sm ${
          isEmpty
            ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
            : 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100 cursor-pointer active:scale-95'
        }`}
      >
        <Trash2 size={16} />
        Clear Cart
      </button>
    </div>
  );
}

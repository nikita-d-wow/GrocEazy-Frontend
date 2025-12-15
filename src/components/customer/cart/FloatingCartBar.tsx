import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';

export default function FloatingCartBar() {
  const items = useSelector(selectCartItems);

  if (!items || items.length === 0) {
    return null;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <Link
        to="/cart"
        className="flex items-center justify-between bg-green-600 text-white p-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors animate-fade-in-up"
      >
        <div className="flex items-center gap-3">
          <div className="bg-green-700 p-2 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
            <span className="text-xs font-medium text-green-100">
              ₹{totalPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold text-sm">
          View Cart <ChevronRight className="w-4 h-4" />
        </div>
      </Link>
    </div>
  );
}

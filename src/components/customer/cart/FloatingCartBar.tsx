import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';

export default function FloatingCartBar() {
  const items = useSelector(selectCartItems);

  if (!items || items.length === 0) {
    return <AnimatePresence>{null}</AnimatePresence>;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.8 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-auto min-w-[280px] max-w-[340px]"
      >
        <Link
          to="/cart"
          className="flex items-center justify-between bg-green-600 text-white p-3.5 rounded-2xl shadow-2xl border border-green-500/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-green-700/50 p-2 rounded-xl border border-white/10">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <motion.span
                key={totalItems}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 bg-yellow-400 text-green-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white"
              >
                {totalItems}
              </motion.span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-tight">
                {totalItems} Item{totalItems !== 1 ? 's' : ''}
              </span>
              <span className="text-[11px] font-semibold text-green-100 flex items-center">
                ₹{totalPrice.toLocaleString()}{' '}
                <span className="mx-1 opacity-50">•</span>{' '}
                <span className="text-yellow-300">View Cart</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white/20 p-2 rounded-xl">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectCartItems,
  selectCartPagination,
} from '../../../redux/selectors/cartSelectors';
import { fetchCart } from '../../../redux/actions/cartActions';
import type { AppDispatch } from '../../../redux/store';

export default function FloatingCartBar() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const items = useSelector(selectCartItems);
  const { limit, total } = useSelector(selectCartPagination);

  // Sync logic: Restore full cart view when leaving /cart if we have a partial page
  // We use a reasonably high limit (e.g. 100) to ensure we get "most" items for the count
  // This prevents the "5 items" issue when returning from the paginated cart page
  useEffect(() => {
    if (location.pathname === '/cart') {
      return;
    }

    // If we have fewer items loaded than the total known items, and limit is small (was likely set by CartPage)
    // we fetch more to populate the accurate count.
    if (limit < 100 && total > items.length) {
      dispatch(fetchCart(1, 100));
    }
  }, [location.pathname, limit, total, items.length, dispatch]);

  if (location.pathname === '/cart') {
    return null;
  }

  if (!items || items.length === 0) {
    return <AnimatePresence>{null}</AnimatePresence>;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Get unique product images (up to 2)
  const productImages = items
    .map((item) => item.product?.images?.[0])
    .filter(Boolean)
    .slice(0, 2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, x: '-50%', opacity: 0 }}
        animate={{ y: 0, x: '-50%', opacity: 1 }}
        exit={{ y: 100, x: '-50%', opacity: 0 }}
        className="fixed bottom-8 left-1/2 z-50 md:hidden w-auto min-w-[280px] max-w-[90%]"
      >
        <Link
          to="/cart"
          className="flex items-center justify-between bg-green-600 text-white p-2.5 md:p-3 rounded-full shadow-[0_12px_40px_rgb(0,0,0,0.3)] border border-white/20 backdrop-blur-md transition-transform active:scale-95 mx-auto"
        >
          <div className="flex items-center gap-3 pr-4">
            {/* Overlapping Images */}
            <div className="flex -space-x-4 pl-1">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full border-2 border-white bg-white overflow-hidden shadow-md flex-shrink-0"
                  style={{ zIndex: idx }}
                >
                  <img
                    src={img}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {productImages.length === 0 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[15px] leading-tight text-white tracking-tight">
                View cart
              </span>
              <span className="text-[11px] font-semibold text-green-100/90">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Right Icon */}
          <div className="pr-3 flex items-center border-l border-white/20 pl-3">
            <ChevronRight className="w-5 h-5 text-white stroke-[3px]" />
          </div>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}

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
          className="flex items-center justify-between bg-primary text-white p-2.5 md:p-3 rounded-full shadow-[0_12px_40px_rgb(0,0,0,0.3)] border border-white/20 backdrop-blur-md transition-transform active:scale-95 mx-auto"
        >
          <div className="flex items-center gap-3 pr-4">
            {/* Overlapping Images */}
            <div className="flex -space-x-4 pl-1">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full border-2 border-card bg-card overflow-hidden shadow-md flex-shrink-0"
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
                <div className="w-10 h-10 rounded-full border-2 border-card bg-card flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
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

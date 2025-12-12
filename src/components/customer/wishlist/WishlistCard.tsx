import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import type { Product } from '../../../types/Product';

interface CardProps {
  item: Product;
  processing: boolean;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
}

const WishlistCard: React.FC<CardProps> = ({
  item,
  processing,
  onRemove,
  onAdd,
}) => {
  const imageUrl = item.images?.[0] || '/placeholder.png';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative rounded-3xl p-4 bg-white shadow-md border border-slate-100 hover:shadow-xl transition-all"
    >
      {/* IMAGE */}
      <div className="h-36 w-full overflow-hidden rounded-2xl">
        <motion.img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h4 className="font-semibold text-slate-900 text-sm truncate">
          {item.name}
        </h4>

        <p className="text-xs text-slate-500 truncate mb-1">
          {item.description}
        </p>

        <p className="text-[11px] text-primary truncate mb-2">
          {item.size} • {item.dietary}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>

          {item.stock <= item.lowStockThreshold && (
            <span className="text-xs text-red-500 font-semibold">
              Low Stock
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdd(item._id)}
            disabled={processing}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 
                     rounded-xl bg-primary text-white text-xs shadow-md 
                     hover:opacity-90 transition"
          >
            <ShoppingCart size={14} /> Add
          </button>

          <button
            onClick={() => onRemove(item._id)}
            disabled={processing}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 
                       text-slate-600 text-xs hover:bg-slate-200 transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* PROCESSING BAR */}
      {processing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
        />
      )}
    </motion.div>
  );
};

export default WishlistCard;

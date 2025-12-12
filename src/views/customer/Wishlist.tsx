import React, { useState } from 'react';
import { MotionConfig, AnimatePresence } from 'framer-motion';

import type { Product } from '../../types/Product';
import { wishlistData } from '../../data/wishlistdata';

import WishlistHeader from '../../components/customer/wishlist/WishlistHeader';
import WishlistCard from '../../components/customer/wishlist/WishlistCard';
import EmptyState from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

const Wishlist: React.FC<{ initial?: Product[] }> = ({
  initial = wishlistData,
}) => {
  const [items, setItems] = useState<Product[]>(initial);
  const [processing, setProcessing] = useState<string | null>(null);

  const removeItem = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item._id !== id));
      setProcessing(null);
    }, 280);
  };

  const addToCart = (id: string) => {
    setProcessing(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item._id !== id));
      setProcessing(null);
    }, 420);
  };

  return (
    <MotionConfig transition={{ ease: 'easeOut', duration: 0.32 }}>
      <div className="max-w-4xl mx-auto p-6">
        <WishlistHeader count={items.length} onClear={() => setItems([])} />

        <AnimatePresence initial={false} mode="popLayout">
          {items.length === 0 ? (
            <EmptyState
              title="No favourites yet"
              description="Tap the heart on any product to add it to your wishlist."
              icon={<Heart className="w-8 h-8 text-primary" />}
              action={{
                label: 'Browse popular',
                onClick: () => setItems(initial),
              }}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {items.map((product) => (
                <WishlistCard
                  key={product._id}
                  item={product}
                  processing={processing === product._id}
                  onRemove={removeItem}
                  onAdd={addToCart}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default Wishlist;

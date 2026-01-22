import type { FC } from 'react';
import ProductCard from '../customer/ProductCard';
import type { Product } from '../../types/Product';

import { motion } from 'framer-motion';

interface Props {
  products: Product[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ProductGrid: FC<Props> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={products.length > 0 ? products[0]._id : 'empty'}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          _id={product._id}
          name={product.name}
          price={product.price}
          image={product.images[0]}
          stock={product.stock}
          categoryId={
            typeof product.categoryId === 'object'
              ? product.categoryId._id
              : product.categoryId
          }
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default ProductGrid;

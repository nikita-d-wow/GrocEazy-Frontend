import type { FC } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../types/Product';

interface Props {
  products: Product[];
}

const ProductGrid: FC<Props> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

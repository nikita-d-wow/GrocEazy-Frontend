import type { FC } from 'react';
import type { Product } from '../../types/product';
interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    //console.log("Added to cart:", product.name);
  };

  return (
    <div className="group bg-white rounded-2xl p-4 border border-transparent hover:border-green-100 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full relative overflow-hidden">
      {/* Discount Badge */}
      {product.discountPrice && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          SALE
        </span>
      )}

      {/* Image Container */}
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Quick Action Overlay (scales up on hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col flex-grow">
        {/* Category Tag */}
        <span className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wider">
          {product.slug?.split('-')[0] || 'Groceries'}
        </span>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating (Static for now) */}
        <div className="flex items-center space-x-1 mb-3">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs text-gray-500 font-medium">
            {product.rating || 4.5} ({product.reviewsCount || 0})
          </span>
        </div>

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.price}
                </span>
                <span className="text-xl font-extrabold text-gray-900">
                  ₹{product.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-gray-900">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg shadow-green-200 active:scale-95 transition-all"
            aria-label="Add to cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  // Using local state as placeholder since cart reducer must not be touched
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(1);
    toast.success('Added ' + product.name + ' to cart');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      setQuantity(0);
      toast.success('Removed from cart');
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-4 border border-transparent hover:border-green-100 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full relative overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-white flex items-center justify-center">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col flex-grow">
        {/* Category Tag */}
        <span className="text-xs text-green-600 font-medium mb-1 uppercase tracking-wider">
          {product.size || 'Groceries'}
        </span>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900">
              ₹{product.price}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-2 rounded-lg font-semibold text-sm active:scale-95 transition-all shadow-sm"
              aria-label="Add to cart"
            >
              ADD
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-green-600 text-white px-2 py-2 rounded-lg shadow-md"
            >
              <button
                onClick={handleDecrement}
                className="hover:bg-green-700 p-1 rounded active:scale-90 transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="hover:bg-green-700 p-1 rounded active:scale-90 transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

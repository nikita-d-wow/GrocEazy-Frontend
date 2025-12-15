import { useNavigate } from 'react-router-dom';
import React from 'react';

import type { CustomerProductCardProps } from '../../types/Product';

export default function ProductCard({
  _id,
  name,
  image,
  price,
  stock,
}: CustomerProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-green-200 transition-all cursor-pointer group"
    >
      <div className="relative bg-gray-50 rounded-xl p-4 mb-3 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-contain group-hover:scale-110 transition-transform"
        />
        {stock !== undefined && stock < 10 && stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
            Low Stock
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
            Out of Stock
          </span>
        )}
      </div>
      <p className="text-gray-900 font-semibold text-sm mb-1">{name}</p>
      <p className="text-green-600 font-bold text-lg">₹{price}</p>
    </div>
  );
}

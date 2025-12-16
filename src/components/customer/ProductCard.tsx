import { useNavigate } from 'react-router-dom';
import React from 'react';
import { categoryBgVariants } from '../../utils/colors';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { addToCart } from '../../redux/actions/cartActions';

import type { CustomerProductCardProps } from '../../types/Product';

interface Props extends CustomerProductCardProps {
  index?: number;
}

export default function ProductCard({
  _id,
  name,
  image,
  price,
  stock,
  index = 0,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Extract just the background color class from the variant string
  const variant = categoryBgVariants[index % categoryBgVariants.length];
  const bgClass = variant.split(' ')[0];

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer group h-full flex flex-col"
    >
      <div
        className={`relative ${bgClass} rounded-xl p-4 mb-3 overflow-hidden h-40 flex items-center justify-center`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform mix-blend-multiply"
        />
        {stock !== undefined && stock < 10 && stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Low
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>
      <div className="flex flex-col flex-grow text-left">
        <p className="text-gray-900 font-bold text-sm mb-1 line-clamp-2 leading-tight">
          {name}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="text-[#77dd77] font-bold text-base">₹{price}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(_id, 1));
            }}
            className="text-green-700 font-bold bg-green-50 px-3 py-1 rounded-lg text-xs hover:bg-green-100 transition-colors uppercase border border-green-200"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}

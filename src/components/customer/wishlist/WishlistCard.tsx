import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  removeWishlistItem,
  moveWishlistToCart,
} from '../../../redux/actions/wishlistActions';

import type { AppDispatch } from '../../../redux/store';
import type { WishlistItem } from '../../../redux/types/wishlistTypes';

type Props = {
  item: WishlistItem;
  isInCart?: boolean;
};

export default function WishlistCard({ item, isInCart }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await dispatch(removeWishlistItem(item._id));
    } catch {
      setIsDeleting(false);
    }
  };

  const isOutOfStock = item.product.stock < 1;
  const isMoveDisabled = isOutOfStock || isInCart || isMoving;

  return (
    <div
      onClick={() => navigate(`/products/${item.product._id}`)}
      className="
        group relative
        bg-white/40 backdrop-blur-2xl
        border border-white/40
        rounded-2xl p-4
        shadow-xl shadow-gray-200/50
        hover:shadow-2xl hover:shadow-red-500/10
        transition-all duration-500
        hover:-translate-y-2
        flex flex-col h-full
        cursor-pointer
      "
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50/50 border border-white/20 group-hover:shadow-inner transition-all duration-500">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-white/90 px-3 py-1 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 animate-pulse">
              <AlertCircle size={12} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {item.product.name}
          </h3>
        </div>

        <p className="text-gray-500 text-[10px] line-clamp-2 mb-3 font-medium">
          {item.product.description}
        </p>

        <div className="mt-auto pt-2 border-t border-white/20 flex items-center justify-between">
          <p className="text-primary font-black text-lg tracking-tight">
            <span className="text-xs font-bold mr-0.5">₹</span>
            {item.product.price}
          </p>

          {isInCart && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100 shadow-sm animate-fade">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold uppercase">In Cart</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          disabled={isMoveDisabled}
          onClick={async (e) => {
            e.stopPropagation();
            setIsMoving(true);
            try {
              await dispatch(
                moveWishlistToCart(item._id, {
                  _id: item.product._id,
                  name: item.product.name,
                  price: item.product.price,
                  images: item.product.images,
                  stock: item.product.stock,
                  description: item.product.description,
                })
              );
            } catch {
              setIsMoving(false);
            }
          }}
          className={`
            flex-1 flex items-center justify-center gap-1.5
            py-2.5 rounded-xl font-bold text-xs transition-all duration-300
            ${
              isMoveDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50'
                : 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-dark active:scale-95 cursor-pointer border border-primary/20'
            }
          `}
        >
          {isMoving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart size={18} />
              {isInCart ? 'In Your Cart' : 'Move to Cart'}
            </>
          )}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="
            p-2.5 rounded-xl cursor-pointer
            bg-red-50 text-red-600 border border-red-100
            hover:bg-red-600 hover:text-white
            active:scale-95 transition-all duration-300
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md
          "
          title="Remove from wishlist"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

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
  const isMoveDisabled = isOutOfStock || isInCart;

  return (
    <div
      onClick={() => navigate(`/products/${item.product._id}`)}
      className="
        group relative
        bg-card/70 backdrop-blur-2xl
        border border-border
        rounded-[2rem] p-5
        shadow-sm
        hover:shadow-2xl hover:shadow-primary/5
        transition-all duration-500
        hover:-translate-y-2
        flex flex-col h-full
        cursor-pointer
      "
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-muted border border-border group-hover:shadow-inner transition-all duration-500">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-muted/30 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-card/90 px-4 py-1.5 rounded-full shadow-lg border border-rose-500/20 flex items-center gap-2 animate-pulse">
              <AlertCircle size={14} className="text-rose-500" />
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-text text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {item.product.name}
          </h3>
        </div>

        <p className="text-muted-text text-xs line-clamp-2 mb-3 font-medium">
          {item.product.description}
        </p>

        <div className="mt-auto pt-2 border-t border-border flex items-center justify-between">
          <p className="text-primary font-black text-2xl tracking-tight">
            <span className="text-sm font-bold mr-0.5">₹</span>
            {item.product.price}
          </p>

          {isInCart && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary-light text-primary border border-primary/20 shadow-sm animate-fade">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase">In Cart</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          disabled={isMoveDisabled}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              moveWishlistToCart(item._id, {
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                images: item.product.images,
                stock: item.product.stock,
                description: item.product.description,
              })
            );
          }}
          className={`
            flex-1 flex items-center justify-center gap-2
            py-3 rounded-2xl font-bold text-sm transition-all duration-300
            ${
              isMoveDisabled
                ? 'bg-muted text-muted-text cursor-not-allowed border border-border'
                : 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-dark active:scale-95 cursor-pointer border border-primary/20'
            }
          `}
        >
          {isOutOfStock ? (
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
            p-3.5 rounded-2xl cursor-pointer
            bg-rose-500/10 text-rose-500 border border-rose-500/20
            hover:bg-rose-500 hover:text-white
            active:scale-95 transition-all duration-300
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md
          "
          title="Remove from wishlist"
        >
          {isDeleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

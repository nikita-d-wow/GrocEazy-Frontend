import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import type { Product } from '../../types/Product';
import type { AppDispatch } from '../../redux/store';
import {
  updateCartQty,
  addToCart,
  removeCartItem,
} from '../../redux/actions/cartActions';
import { selectCartItems } from '../../redux/selectors/cartSelectors';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);

  const cartItem = cartItems.find((item) => item.product._id === product._id);

  // ✅ FIX: derived state (no useEffect / useState)
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const toastId = toast.loading('Adding to cart…');

    try {
      await dispatch(addToCart(product._id, 1));
      toast.success(`${product.name} added to cart`, {
        id: toastId,
        icon: <ShoppingCart size={16} />,
      });
    } catch {
      toast.error('Failed to add to cart', { id: toastId });
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) {
      return;
    }

    await dispatch(updateCartQty(cartItem._id, cartItem.quantity + 1));

    toast.success('Quantity updated', {
      icon: '➕',
    });
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cartItem) {
      return;
    }

    if (cartItem.quantity > 1) {
      await dispatch(updateCartQty(cartItem._id, cartItem.quantity - 1));
      toast.success('Quantity updated', { icon: '➖' });
    } else {
      await dispatch(removeCartItem(cartItem._id));
      toast('Removed from cart', {
        icon: '🗑️',
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-4 hover:shadow-xl transition cursor-pointer"
    >
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-48 w-full object-cover rounded-xl"
      />

      <h3 className="font-bold mt-3">{product.name}</h3>
      <p className="text-xl font-extrabold mt-2">₹{product.price}</p>

      {quantity === 0 ? (
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full text-green-700 font-bold bg-green-50 py-2 rounded-lg hover:bg-green-100 transition-colors uppercase border border-green-200"
        >
          ADD
        </button>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex items-center justify-between bg-green-50 rounded-lg px-2 py-1 border border-green-200"
        >
          <button
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center bg-white rounded text-green-700 shadow-sm hover:bg-gray-50"
          >
            <Minus size={16} strokeWidth={3} />
          </button>

          <span className="font-bold text-green-700">{quantity}</span>

          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center bg-green-600 rounded text-white shadow-sm hover:bg-green-700"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

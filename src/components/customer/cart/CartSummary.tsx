import { useNavigate } from 'react-router-dom';
import { ArrowRight, Ticket, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import {
  validateCoupon,
  clearCouponValidation,
} from '../../../redux/actions/couponActions';
import type { RootState } from '../../../redux/rootReducer';

interface CartSummaryProps {
  total: number;
}

export default function CartSummary({ total }: CartSummaryProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { validation, loading: couponLoading } = useSelector(
    (state: RootState) => state.coupon
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    return () => {
      // Clear validation when leaving cart if needed, or keep it for checkout
      // For now let's keep it so checkout can use it
    };
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode.trim() || couponLoading) {
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId,
      categoryId: item.product?.categoryId,
      price: item.product?.price,
      quantity: item.quantity,
    }));

    dispatch(
      validateCoupon({
        code: couponCode,
        cartTotal: total,
        items,
        platform: 'web',
      })
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    dispatch(clearCouponValidation());
  };

  const discount = validation?.valid ? validation.discountAmount : 0;
  const finalTotal = total - discount;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 h-fit sticky top-24 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-5 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        {validation?.valid && (
          <div className="flex justify-between text-green-600 font-medium animate-slideDown">
            <span className="flex items-center gap-1">
              <Ticket size={14} />
              Discount ({validation.message || 'Coupon Applied'})
            </span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="text-primary font-semibold">Free</span>
        </div>

        {/* Coupon Input */}
        {!validation?.valid ? (
          <div className="pt-2">
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none transition-all uppercase placeholder:text-gray-400 font-medium"
                onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <Ticket
                className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors"
                size={16}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || couponLoading}
                className="absolute right-2 top-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {couponLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
            {validation?.valid === false && (
              <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold italic animate-pulse">
                {validation.message}
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 tracking-wide">
                  {couponCode}
                </p>
                <p className="text-[10px] text-green-600 font-bold tracking-tight">
                  Applied successfully!
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <hr className="my-4 border-gray-100" />

        <div className="flex justify-between text-2xl font-bold text-gray-900">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Compact Checkout Button */}
      <button
        onClick={() => navigate('/checkout')}
        disabled={total <= 0}
        className="
          mt-8 w-full inline-flex items-center justify-center gap-2
          px-6 py-4
          bg-primary text-white
          text-base font-bold
          rounded-2xl
          shadow-xl shadow-green-200/50
          hover:bg-primary/90
          hover:shadow-green-200/80
          active:scale-[0.98]
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>

      <p className="mt-4 text-[10px] text-center text-gray-400 font-medium">
        Securely checkout with your favorite payment methods
      </p>
    </div>
  );
}

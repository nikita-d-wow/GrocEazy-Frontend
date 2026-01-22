import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Wallet,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';
import PageHeader from '../../components/common/PageHeader';
import { calculateProductPrice } from '../../utils/offerUtils';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  const { activeOffers } = useSelector((state: RootState) => state.offer);
  const { validation } = useSelector((state: RootState) => state.coupon);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-gray-50 rounded-full">
          <ChevronLeft
            size={48}
            className="text-gray-300 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/cart')}
          />
        </div>
        <p className="text-gray-500 font-medium text-lg">Your cart is empty</p>
        <Link to="/cart" className="text-primary hover:underline font-semibold">
          Go to Cart
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { discountedPrice } = calculateProductPrice(
      item.product as any,
      activeOffers
    );
    return sum + discountedPrice * item.quantity;
  }, 0);
  const discount = validation?.valid ? validation.discountAmount : 0;
  const delivery = subtotal > 499 ? 0 : 40;
  const total = subtotal + delivery - discount;

  const isStockValid = items.every(
    (item) => item.quantity <= (item.product.stock ?? 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <PageHeader
        title="Order Checkout"
        highlightText="Order"
        subtitle="Review and confirm your order items before payment"
        icon={ShoppingBag}
        onBack={() => navigate('/cart')}
      />

      {!isStockValid && (
        <div className="mb-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl group-hover:opacity-100 opacity-60 transition-opacity" />
          <div className="relative p-5 glass-card border-red-200/50 bg-red-50/80 backdrop-blur-md rounded-3xl flex items-start gap-4 text-red-700 shadow-xl shadow-red-500/5 animate-fadeDown">
            <div className="p-2.5 bg-red-100 rounded-2xl text-red-600 shadow-inner">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight mb-1">
                Stock Availability Issue
              </p>
              <p className="text-sm text-red-600/80 font-medium">
                Some items in your cart are no longer available in the
                quantities you've selected. Please return to your cart to make
                adjustments before you can complete this purchase.
              </p>
              <button
                onClick={() => navigate('/cart')}
                className="mt-3 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all text-red-700 cursor-pointer hover:underline"
              >
                Return to Cart <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          {items.map((item) => {
            const hasStockIssue = item.quantity > (item.product.stock ?? 0);
            return (
              <div
                key={item.product._id}
                className={`flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 ${
                  hasStockIssue ? 'bg-red-50/50 -mx-4 px-4 rounded-lg' : ''
                }`}
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                />

                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    {hasStockIssue && (
                      <span className="text-xs font-bold text-red-600 uppercase">
                        Insufficient Stock: {item.product.stock ?? 0} left
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    ₹
                    {(
                      calculateProductPrice(item.product as any, activeOffers)
                        .discountedPrice * item.quantity
                    ).toFixed(2)}
                  </p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {calculateProductPrice(item.product as any, activeOffers)
                    .discountedPrice < item.product.price && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-300 ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/10 text-primary-dark shadow-sm'
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <Wallet size={18} /> Cash on Delivery
            </button>
          </div>

          <div className="mt-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span>
            </div>
            {validation?.valid && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base mt-4 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() =>
              navigate('/checkout/address', {
                state: {
                  paymentMethod,
                  total,
                  couponCode: validation?.valid ? validation.code : undefined,
                },
              })
            }
            disabled={!isStockValid}
            className={`mt-6 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-lg transition-all active:scale-[0.98] ${
              !isStockValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:shadow-primary/40 cursor-pointer'
            }`}
          >
            {isStockValid ? (
              <>
                Continue <ArrowRight size={18} />
              </>
            ) : (
              'Adjust Stock to Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

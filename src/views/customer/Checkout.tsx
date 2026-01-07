import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Wallet, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-muted rounded-full">
          <ChevronLeft
            size={48}
            className="text-muted-text/30 cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/cart')}
          />
        </div>
        <p className="text-muted-text font-medium text-lg">
          Your cart is empty
        </p>
        <Link to="/cart" className="text-primary hover:underline font-semibold">
          Go to Cart
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal > 499 ? 0 : 40;
  const total = subtotal + delivery;

  const isStockValid = items.every(
    (item) => item.quantity <= (item.product.stock ?? 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="p-2.5 rounded-xl bg-card border border-border text-muted-text hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all active:scale-95 group cursor-pointer"
          title="Back to Cart"
        >
          <ChevronLeft
            size={22}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            Checkout
          </h1>
          <p className="text-muted-text text-sm">
            Review and confirm your order items
          </p>
        </div>
      </div>

      {!isStockValid && (
        <div className="mb-8 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl group-hover:opacity-100 opacity-60 transition-opacity" />
          <div className="relative p-5 glass-card border-rose-500/20 bg-rose-500/5 backdrop-blur-md rounded-3xl flex items-start gap-4 text-rose-500 shadow-xl shadow-rose-500/5 animate-fadeDown">
            <div className="p-2.5 bg-rose-500/10 rounded-2xl text-rose-500 shadow-inner">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight mb-1 font-extrabold">
                Stock Availability Issue
              </p>
              <p className="text-sm text-rose-500/90 font-medium">
                Some items in your cart are no longer available in the
                quantities you've selected. Please return to your cart to make
                adjustments before you can complete this purchase.
              </p>
              <button
                onClick={() => navigate('/cart')}
                className="mt-3 text-sm font-extrabold flex items-center gap-1 hover:gap-2 transition-all text-rose-500 cursor-pointer hover:underline"
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
          <h2 className="text-xl font-bold text-text mb-6">Order Summary</h2>

          {items.map((item) => {
            const hasStockIssue = item.quantity > (item.product.stock ?? 0);
            return (
              <div
                key={item.product._id}
                className={`flex items-center gap-4 py-4 border-b border-border last:border-0 ${
                  hasStockIssue ? 'bg-rose-500/10 -mx-4 px-4 rounded-lg' : ''
                }`}
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                />

                <div className="flex-1">
                  <p className="font-medium text-text">{item.product.name}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-text">
                      Qty: {item.quantity}
                    </p>
                    {hasStockIssue && (
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                        Insufficient Stock: {item.product.stock ?? 0} left
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-semibold text-text">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="glass-card p-6 h-fit">
          <h3 className="text-lg font-bold text-text mb-4">Payment Method</h3>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-300 ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/10 text-primary-dark shadow-sm'
                  : 'border-transparent bg-muted hover:bg-muted/80'
              }`}
            >
              <Wallet size={18} /> Cash on Delivery
            </button>
          </div>

          <div className="mt-6 text-sm space-y-2 text-muted-text">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-text">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-text">
                {delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-base mt-4 pt-4 border-t border-border text-text">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() =>
              navigate('/checkout/address', {
                state: { paymentMethod, total },
              })
            }
            disabled={!isStockValid}
            className={`mt-6 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-lg transition-all active:scale-[0.98] ${
              !isStockValid
                ? 'bg-muted text-muted-text opacity-50 cursor-not-allowed shadow-none border border-border'
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

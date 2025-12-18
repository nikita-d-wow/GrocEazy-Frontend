import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal > 499 ? 0 : 40;
  const total = subtotal + delivery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-4 py-4 border-b border-gray-100"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold text-gray-900">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary-light text-primary-dark'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Wallet size={18} /> Cash on Delivery
            </button>

            <button
              onClick={() => setPaymentMethod('online')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left ${
                paymentMethod === 'online'
                  ? 'border-primary bg-primary-light text-primary-dark'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <CreditCard size={18} /> Online Payment
            </button>
          </div>

          <div className="mt-6 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={() =>
              navigate('/checkout/address', {
                state: { paymentMethod, total },
              })
            }
            className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

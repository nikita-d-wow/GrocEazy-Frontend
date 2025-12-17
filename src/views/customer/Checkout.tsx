import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleContinue = () => {
    navigate('/checkout/address', {
      state: { paymentMethod },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 sm:p-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ITEMS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-semibold text-xl flex items-center gap-2 mb-6">
              <Truck /> Items
            </h3>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-4 border-b border-white/40 pb-4 last:border-none"
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PAYMENT */}
          <div className="rounded-3xl shadow-xl p-6">
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <CreditCard /> Payment Method
            </h3>

            <label className="flex items-center gap-3 mb-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
              />
              Online (Pay Later)
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className=" rounded-3xl shadow-xl p-6 h-fit">
          <h3 className="font-semibold text-xl mb-6">Order Summary</h3>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
          </div>

          <div className="h-px bg-white/50 my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleContinue}
            className="mt-8 w-full bg-primary text-white py-3 rounded-2xl font-medium shadow-lg shadow-primary/40 hover:opacity-95 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

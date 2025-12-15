import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, ShoppingBag, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';
import type { OrderActionTypes } from '../../redux/types/orderTypes';
import { createOrder } from '../../redux/actions/orderActions';
import type { ThunkDispatch } from 'redux-thunk';

const Checkout = () => {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, any, OrderActionTypes>>();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.order);
  const { user } = useSelector((state: RootState) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  // Local state for address (in a real app, this would come from user profile or saved addresses)
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.phone
    ) {
      alert('Please fill in all address details');
      return;
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      shippingAddress: address,
      paymentMethod,
    };

    dispatch(createOrder(orderPayload, navigate));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-gray-500">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-primary hover:underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary text-white shadow-md">
          <ShoppingBag />
        </div>
        <h2 className="text-2xl font-semibold">Checkout</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">
          {/* ADDRESS FORM */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-md border"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-primary" />
              <h3 className="font-semibold text-lg">Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="line1"
                  value={address.line1}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="10001"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </motion.div>

          {/* CART ITEMS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-md border space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Truck className="text-primary" />
              <h3 className="font-semibold text-lg">Your Items</h3>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border-b pb-4 last:border-none"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">{item.product.size}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-primary text-lg">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </motion.div>

          {/* PAYMENT METHODS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-md border"
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="text-primary" />
              <h3 className="font-semibold text-lg">Payment Method</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <span>Online Payment</span>
              </label>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-md border h-fit sticky top-6"
        >
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-5 w-full bg-primary text-white py-3 rounded-xl shadow-md text-sm font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

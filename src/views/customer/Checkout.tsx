import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, ShoppingBag } from 'lucide-react';

import type { Product } from '../../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

const dummyAddress = {
  fullName: 'John Doe',
  line1: '12, MG Road',
  city: 'Bangalore',
  state: 'Karnataka',
  postalCode: '560001',
  phone: '9876543210',
};

const dummyCart: CartItem[] = [
  {
    product: {
      _id: 'prod_1',
      name: 'Organic Avocado (2 pcs)',
      description: 'Fresh avocados rich in nutrients',
      size: '2 pcs pack',
      dietary: 'Vegan',
      stock: 40,
      lowStockThreshold: 5,
      price: 249,
      images: ['https://picsum.photos/seed/avocado/400/300'],
      isActive: true,
      categoryId: 'cat_fruits',
    },
    quantity: 1,
  },
  {
    product: {
      _id: 'prod_3',
      name: 'Multigrain Bread',
      description: 'Freshly baked multigrain bread',
      size: '400g loaf',
      dietary: 'High Fiber',
      stock: 25,
      lowStockThreshold: 5,
      price: 119,
      images: ['https://picsum.photos/seed/bread/400/300'],
      isActive: true,
      categoryId: 'cat_bakery',
    },
    quantity: 2,
  },
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = dummyCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          {/* ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl shadow-md border"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-primary" />
              <h3 className="font-semibold text-lg">Delivery Address</h3>
            </div>

            <p className="text-sm text-gray-900 font-medium">
              {dummyAddress.fullName}
            </p>

            <p className="text-sm text-gray-600">
              {dummyAddress.line1}, {dummyAddress.city}, {dummyAddress.state} -{' '}
              {dummyAddress.postalCode}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Phone: {dummyAddress.phone}
            </p>

            <button className="mt-3 text-primary text-sm font-medium hover:underline">
              Change Address
            </button>
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

            {dummyCart.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 border-b pb-4 last:border-none"
              >
                <img
                  src={item.product.images[0]}
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

          <button className="mt-5 w-full bg-primary text-white py-3 rounded-xl shadow-md text-sm font-medium hover:opacity-90 transition">
            Place Order
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';
import type { IAddress } from '../../redux/types/authTypes';
import { createOrder } from '../../redux/actions/orderActions';
import type { AppDispatch } from '../../redux/store';
import type { Address } from '../../redux/types/orderTypes';
import PageHeader from '../../components/common/PageHeader';
// import AddressManager from '../../components/customer/profile/AddressManager';

const EMPTY_ADDRESSES: IAddress[] = [];

const CheckoutAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const { items: cartItems } = useSelector((state: RootState) => state.cart);

  /* ---------------- SAFE NORMALIZATION ---------------- */
  const addresses: IAddress[] = user?.addresses ?? EMPTY_ADDRESSES;

  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isDefault)?._id ?? null,
    [addresses]
  );

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddressId
  );

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  /* ---------------- STOCK VALIDATION ---------------- */
  const isStockValid = useMemo(
    () =>
      cartItems.every((item) => item.quantity <= (item.product?.stock ?? 0)),
    [cartItems]
  );

  if (!user) {
    return null;
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress || !user) {
      return;
    }

    if (!user.phone || user.phone.trim() === '') {
      alert('Please add your phone number in profile to place an order.');
      navigate('/profile');
      return;
    }

    if (!user.name) {
      throw new Error('User name is required to place an order');
    }

    const address: Address = {
      fullName: user.name,
      phone: user.phone,
      line1: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.zipCode,
    };

    dispatch(
      createOrder(
        {
          items: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
          address, // ✅ value, correctly typed
          paymentMethod: 'cod',
        },
        navigate
      )
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <PageHeader
        title="Delivery Address"
        highlightText="Delivery"
        subtitle="Select the address where you want your order delivered"
        icon={MapPin}
        onBack={() => navigate('/checkout')}
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
                Items in your cart have changed availability. Please return to
                your cart to review and update quantities.
              </p>
              <button
                onClick={() => navigate('/cart')}
                className="mt-3 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all text-red-700"
              >
                Return to Cart <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ================= LEFT ================= */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/profile?tab=address')}
              className="inline-flex items-center gap-2 px-4 py-2
                         bg-primary text-white text-sm font-medium
                         rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] cursor-pointer"
            >
              <Plus size={16} />
              Add New Address
            </button>
          </div>

          {addresses.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center glass-card">
              <MapPin size={36} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                You don’t have any saved addresses yet.
              </p>
            </div>
          )}

          {addresses.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address._id;

                return (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddressId(address._id ?? null)}
                    className={`cursor-pointer rounded-xl border p-5 transition-all duration-300
                      ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-2xl'
                          : 'border-transparent bg-white/60 hover:bg-white/80 shadow-lg hover:shadow-2xl'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-800 font-medium">
                          {address.street}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.country}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Phone: {user?.phone || 'N/A'}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle size={20} className="text-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= RIGHT ================= */}
        <aside className="glass-card p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <div className="flex justify-between">
              <span>Total Items</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
          </div>

          <button
            disabled={
              !selectedAddressId || cartItems.length === 0 || !isStockValid
            }
            onClick={handlePlaceOrder}
            className={`mt-6 w-full py-3 rounded-xl font-medium transition active:scale-[0.98] shadow-lg ${
              !selectedAddressId || cartItems.length === 0 || !isStockValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:shadow-primary/40 cursor-pointer'
            }`}
          >
            {isStockValid ? 'Place Order' : 'Adjust Stock to Order'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutAddress;

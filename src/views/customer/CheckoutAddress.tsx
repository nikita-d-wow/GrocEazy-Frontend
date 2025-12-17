import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { MapPin, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../../redux/rootReducer';
import type { IAddress } from '../../redux/types/authTypes';

const EMPTY_ADDRESSES: IAddress[] = [];

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  /* ---------------- SAFE NORMALIZATION ---------------- */
  // Use a stable empty array to prevent dependency changes on every render
  const addresses: IAddress[] = user?.addresses ?? EMPTY_ADDRESSES;

  const defaultAddressId = useMemo(
    () => addresses.find((a) => a.isDefault)?._id ?? null,
    [addresses]
  );

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddressId
  );

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  if (!user) {
    return null;
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* PAGE HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Address</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Select the address where you want your order delivered. You can manage
          your saved addresses from your profile.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ================= LEFT: ADDRESS LIST ================= */}
        <section className="lg:col-span-2 space-y-6">
          {/* ADD ADDRESS CTA */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/profile?tab=address')}
              className="inline-flex items-center gap-2 px-4 py-2
                         bg-primary text-white text-sm font-medium
                         rounded-lg hover:bg-primary-dark transition"
            >
              <Plus size={16} />
              Add New Address
            </button>
          </div>

          {/* EMPTY STATE */}
          {addresses.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center bg-white">
              <MapPin size={36} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                You don’t have any saved addresses yet.
              </p>
              <button
                onClick={() => navigate('/profile?tab=address')}
                className="inline-flex items-center gap-2 px-4 py-2
                           bg-primary text-white rounded-lg"
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>
          )}

          {/* ADDRESS CARDS */}
          {addresses.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address._id;

                return (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddressId(address._id ?? null)}
                    className={`cursor-pointer rounded-xl border p-5 transition
                      ${
                        isSelected
                          ? 'border-primary bg-primary-light'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-800">
                          {address.street}
                        </p>

                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state}
                        </p>

                        {address.isDefault && (
                          <span
                            className="inline-block mt-2 text-xs
                                           bg-primary-light text-primary-dark
                                           px-2.5 py-1 rounded-full"
                          >
                            Default Address
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <CheckCircle
                          size={20}
                          className="text-primary shrink-0"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= RIGHT: SUMMARY ================= */}
        <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Type</span>
              <span className="font-medium">Standard Delivery</span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 mb-1">Delivering to</p>

            {selectedAddress ? (
              <p className="text-sm text-gray-800">
                {selectedAddress.street}, {selectedAddress.city},{' '}
                {selectedAddress.state}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No address selected</p>
            )}
          </div>

          <button
            disabled={!selectedAddressId}
            onClick={() =>
              navigate('/order/place', {
                state: { addressId: selectedAddressId },
              })
            }
            className="mt-6 w-full bg-primary text-white
                       py-3 rounded-lg font-medium
                       hover:bg-primary-dark transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutAddress;

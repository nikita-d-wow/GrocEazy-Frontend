import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Home, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import type { RootState } from '../../redux/rootReducer';
import type { OrderActionTypes, Address } from '../../redux/types/orderTypes';
import { createOrder } from '../../redux/actions/orderActions';
import type { ThunkDispatch } from 'redux-thunk';

const CheckoutAddress = () => {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, any, OrderActionTypes>>();
  const navigate = useNavigate();
  const location = useLocation();

  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.order);

  const paymentMethod: 'cod' | 'online' =
    location.state?.paymentMethod || 'cod';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>();

  const onSubmit = (address: Address) => {
    dispatch(
      createOrder(
        {
          items: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
          address,
          paymentMethod,
        },
        navigate
      )
    );
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 rounded-2xl bg-primary/90 text-white shadow-xl backdrop-blur">
            <MapPin />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Add Delivery Address
          </h2>
        </div>

        {/* GLASS CARD */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="backdrop-blur-2xl bg-white/40 rounded-3xl shadow-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User size={15} /> Full Name
              </label>
              <input
                {...register('fullName', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  Full name is required
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone size={15} /> Phone Number
              </label>
              <input
                {...register('phone', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  Phone number is required
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Home size={15} /> Address
              </label>
              <input
                {...register('line1', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
                placeholder="House no, Street, Area"
              />
            </div>

            {/* CITY */}
            <input
              {...register('city', { required: true })}
              className="px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
              placeholder="City"
            />

            {/* STATE */}
            <input
              {...register('state', { required: true })}
              className="px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
              placeholder="State"
            />

            {/* PIN */}
            <input
              {...register('postalCode', { required: true })}
              className="px-4 py-3 rounded-xl bg-white/60 backdrop-blur focus:ring-2 focus:ring-primary/40 outline-none"
              placeholder="Postal Code"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-semibold shadow-xl shadow-primary/40 hover:opacity-95 transition flex items-center justify-center gap-3"
            >
              {loading && <Loader2 className="animate-spin" />}
              Add This Address
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-white/60 backdrop-blur text-gray-700 py-4 rounded-2xl font-medium hover:bg-white/80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutAddress;

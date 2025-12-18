import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, PackageX } from 'lucide-react';
import OrderCard from '../../components/customer/orders/OrderCard';
import { getMyOrders } from '../../redux/actions/orderActions';
import type { RootState } from '../../redux/rootReducer';
import type { OrderActionTypes } from '../../redux/types/orderTypes';
import type { ThunkDispatch } from 'redux-thunk';

export default function OrdersPage() {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, any, OrderActionTypes>>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <PackageX className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Oops!</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={() => dispatch(getMyOrders())}
          className="mt-4 text-primary font-medium hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="text-gray-600 mb-8">Track all your orders with ease.</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No orders found.</p>
          <p className="text-gray-400 text-sm mt-1">
            Start shopping to see your orders here!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

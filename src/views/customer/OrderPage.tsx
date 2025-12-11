import { MOCK_ORDERS } from '../../data/ordersData';
import OrderCard from '../../components/customer/orders/OrderCard';

export default function OrdersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      <p className="text-gray-600 mb-8">Track all your orders with ease.</p>

      <div className="space-y-10">
        {MOCK_ORDERS.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';

import OrderCard from '../../components/manager/orders/OrderCard';
import OrderPagination from '../../components/manager/orders/OrderPagination';

const PAGE_SIZE = 5;

const OrdersManagement = () => {
  const dispatch = useDispatch<any>();
  const { orders, loading } = useSelector((state: RootState) => state.order);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOrders(page, PAGE_SIZE));
  }, [dispatch, page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-14">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
          <span className="text-sm text-gray-500">Page {page}</span>
        </div>

        <div className="space-y-12">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={(id, status) =>
                dispatch(changeOrderStatus(id, status))
              }
            />
          ))}
        </div>

        <OrderPagination page={page} onChange={setPage} />
      </div>
    </div>
  );
};

export default OrdersManagement;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';

import OrderCard from '../../components/manager/orders/OrderCard';
import OrderPagination from '../../components/manager/orders/OrderPagination';
import Loader from '../../components/common/Loader';

const PAGE_SIZE = 5;

const OrdersManagement = () => {
  const dispatch = useDispatch<any>();
  const { orders, loading, pagination } = useSelector(
    (state: RootState) => state.order
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOrders(page, PAGE_SIZE));
  }, [dispatch, page]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Orders
          </h1>

          {pagination && (
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-8">
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
          )}
        </div>

        {/* Pagination (uses YOUR component exactly) */}
        {pagination && (
          <OrderPagination
            page={page}
            onChange={(nextPage) => {
              if (!loading && pagination && nextPage <= pagination.pages) {
                setPage(nextPage);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;

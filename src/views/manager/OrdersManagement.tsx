import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';

import OrderCard from '../../components/manager/orders/OrderCard';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import { Package } from 'lucide-react';

const PAGE_SIZE = 5;

const OrdersManagement = () => {
  const dispatch = useDispatch<any>();
  const { orders, loading, pagination } = useSelector(
    (state: RootState) => state.order
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllOrders(page, PAGE_SIZE));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, page]);

  return (
    <div className="min-h-screen bg-transparent px-8 sm:px-16 lg:px-24 py-10 animate-fadeIn">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-sm text-primary border border-gray-100">
              <Package size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Order Management
              </h1>
              <p className="text-gray-500 font-medium">
                Review and update customer orders efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px] space-y-6">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader />
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8">
                {orders.map((order, index) => (
                  <div
                    key={order._id}
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OrderCard
                      order={order}
                      onStatusChange={(id, status) =>
                        dispatch(changeOrderStatus(id, status))
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Standard Pagination Component */}
              {pagination && pagination.pages > 1 && (
                <div className="pt-10 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={pagination.pages}
                    onPageChange={(nextPage) => setPage(nextPage)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-white/40 backdrop-blur-md border border-dashed border-gray-300 rounded-3xl">
              <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                <Package size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  No orders found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  When customers place orders, they will appear here for you to
                  manage.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';

import OrderCard from '../../components/manager/orders/OrderCard';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';
import { Package, SearchX } from 'lucide-react';
import { ORDER_STATUS_META } from '../../utils/orderStatus';

const PAGE_SIZE = 5;

const OrdersManagement = () => {
  const dispatch = useDispatch<any>();
  const { orders, loading, pagination } = useSelector(
    (state: RootState) => state.order
  );

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAllOrders(page, PAGE_SIZE, statusFilter));
  }, [dispatch, page, statusFilter]);

  // Client-side filtering
  const filteredOrders = orders;

  const filterOptions = useMemo(() => {
    const options = Object.keys(ORDER_STATUS_META).map((status) => ({
      value: status,
      label: status,
    }));
    return [{ value: 'all', label: 'All Statuses' }, ...options];
  }, []);

  return (
    <div className="min-h-screen bg-transparent px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Header Section */}
        <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

          <FilterSelect
            label="Filter by Status"
            value={statusFilter}
            options={filterOptions}
            onChange={setStatusFilter}
            className="md:w-64"
          />
        </div>

        {/* Content Area */}
        <div className="min-h-[500px] space-y-6">
          {loading && orders.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader />
            </div>
          ) : filteredOrders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8">
                {filteredOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
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
                    isLoading={loading}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-white/40 backdrop-blur-md border border-dashed border-gray-300 rounded-3xl">
              <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                {statusFilter === 'all' ? (
                  <Package size={48} />
                ) : (
                  <SearchX size={48} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {statusFilter === 'all'
                    ? 'No orders found'
                    : 'No matches found'}
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  {statusFilter === 'all'
                    ? 'When customers place orders, they will appear here for you to manage.'
                    : `No orders currently match the "${statusFilter}" status on this page.`}
                </p>
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="mt-4 text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;

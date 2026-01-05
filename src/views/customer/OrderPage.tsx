import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PackageX, SearchX } from 'lucide-react';
import OrderCard from '../../components/customer/orders/OrderCard';
import { getMyOrders } from '../../redux/actions/orderActions';
import { fetchProducts } from '../../redux/actions/productActions';
import FilterSelect from '../../components/common/FilterSelect';
import { ORDER_STATUS_META } from '../../utils/orderStatus';
import Loader from '../../components/common/Loader';
import type { RootState } from '../../redux/rootReducer';
import type { OrderActionTypes } from '../../redux/types/orderTypes';
import type { ThunkDispatch } from 'redux-thunk';

export default function OrdersPage() {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, any, OrderActionTypes>>();
  const { orders, pagination, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getMyOrders(currentPage, 5, statusFilter));
    dispatch(fetchProducts());
  }, [dispatch, currentPage, statusFilter]);

  const filterOptions = useMemo(() => {
    const options = Object.keys(ORDER_STATUS_META).map((status) => ({
      value: status,
      label: status,
    }));
    return [{ value: 'all', label: 'All Statuses' }, ...options];
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
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
          className="mt-4 text-primary font-medium hover:underline cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track all your orders with ease.</p>
        </div>

        <FilterSelect
          label="Filter by Status"
          value={statusFilter}
          options={filterOptions}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          className="md:w-64"
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto text-gray-400 mb-3">
            {statusFilter === 'all' ? (
              <PackageX className="w-12 h-12" />
            ) : (
              <SearchX className="w-12 h-12" />
            )}
          </div>
          <p className="text-gray-500 text-lg">
            {statusFilter === 'all' ? 'No orders found.' : 'No matches found.'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {statusFilter === 'all'
              ? 'Start shopping to see your orders here!'
              : `No orders currently match the "${statusFilter}" status.`}
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
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={currentPage === pagination.pages}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                  currentPage === pagination.pages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-green-600'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

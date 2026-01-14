import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';

import OrderCard from '../../components/manager/orders/OrderCard';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';
import {
  Package,
  SearchX,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
} from 'lucide-react';
import { ORDER_STATUS_META } from '../../utils/orderStatus';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import FilterBar from '../../components/common/FilterBar';
import DebouncedSearch from '../../components/common/DebouncedSearch';

const PAGE_SIZE = 10;

const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const OrdersManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    orders,
    loading,
    pagination,
    stats: serverStats,
  } = useSelector((state: RootState) => state.order);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  // Calculate dateFrom based on dateFilter
  const getDateFrom = (filter: string): string | undefined => {
    if (filter === 'all') {
      return undefined;
    }

    const now = new Date();
    let cutoffDate: Date;

    switch (filter) {
      case 'today':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return undefined;
    }

    return cutoffDate.toISOString();
  };

  useEffect(() => {
    dispatch(
      getAllOrders(
        page,
        PAGE_SIZE,
        statusFilter,
        getDateFrom(dateFilter),
        sortOrder,
        search
      )
    );
  }, [dispatch, page, statusFilter, dateFilter, sortOrder, search]);

  // Filter options for status
  const filterOptions = useMemo(() => {
    const options = Object.keys(ORDER_STATUS_META).map((status) => ({
      value: status,
      label: status,
    }));
    return [{ value: 'all', label: 'All Statuses' }, ...options];
  }, []);

  // Orders come pre-filtered and sorted from server
  const filteredOrders = orders;

  // Use server stats if available, otherwise fallback
  const stats = useMemo(() => {
    if (serverStats) {
      return {
        total: serverStats.total,
        pending: serverStats.Pending,
        processing: serverStats.Processing,
        delivered: serverStats.Delivered,
        shipped: serverStats.Shipped,
        cancelled: serverStats.Cancelled,
      };
    }
    return {
      total: 0,
      pending: 0,
      processing: 0,
      delivered: 0,
      shipped: 0,
      cancelled: 0,
    };
  }, [serverStats]);

  // Check if any filter is active
  const showReset =
    statusFilter !== 'all' || dateFilter !== 'all' || search !== '';

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setSortOrder('newest');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-transparent px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn space-y-8">
      <div className="w-full space-y-8">
        {/* Header Section */}
        <PageHeader
          title="Order Management"
          highlightText="Order"
          subtitle="Review and update customer orders efficiently"
          icon={Package}
        />

        {/* Stats Cards */}
        {/* {!loading && orders.length > 0 && ( */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-slideUp">
          <div
            onClick={() => {
              setStatusFilter('all');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'all'
                ? 'border-green-500 ring-2 ring-green-100 shadow-md'
                : 'border-green-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                  Total
                </p>
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Package className="w-4 h-4 text-green-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setStatusFilter('Pending');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'Pending'
                ? 'border-amber-500 ring-2 ring-amber-100 shadow-md'
                : 'border-amber-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Pending
                </p>
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setStatusFilter('Processing');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'Processing'
                ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
                : 'border-blue-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Processing
                </p>
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Truck className="w-4 h-4 text-blue-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.processing}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setStatusFilter('Shipped');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-50 to-purple-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'Shipped'
                ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md'
                : 'border-indigo-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Shipped
                </p>
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Send className="w-4 h-4 text-indigo-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.shipped}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setStatusFilter('Delivered');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'Delivered'
                ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md'
                : 'border-emerald-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Delivered
                </p>
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.delivered}
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setStatusFilter('Cancelled');
              setPage(1);
            }}
            className={`cursor-pointer transition-all duration-300 bg-gradient-to-br from-red-50 to-rose-50/50 border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 ${
              statusFilter === 'Cancelled'
                ? 'border-red-500 ring-2 ring-red-100 shadow-md'
                : 'border-red-100'
            }`}
          >
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Cancelled
                </p>
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-700" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {stats.cancelled}
              </p>
            </div>
          </div>
        </div>
        {/* )} */}

        <FilterBar
          searchComponent={
            <DebouncedSearch
              placeholder="Search orders..."
              initialValue={search}
              onSearch={handleSearch}
            />
          }
          onReset={handleReset}
          showReset={showReset}
        >
          <FilterSelect
            label="Status"
            value={statusFilter}
            options={filterOptions}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            className="w-40"
          />
          <FilterSelect
            label="Date"
            value={dateFilter}
            options={DATE_FILTER_OPTIONS}
            onChange={setDateFilter}
            className="w-40"
          />
          <FilterSelect
            label="Sort"
            value={sortOrder}
            options={SORT_OPTIONS}
            onChange={(val) => setSortOrder(val as 'newest' | 'oldest')}
            className="w-40"
          />
        </FilterBar>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {loading && orders.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm border border-gray-100 rounded-3xl">
              <Loader />
              <p className="mt-4 text-gray-500 font-medium animate-pulse">
                Loading orders...
              </p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-bold text-gray-700">
                    {filteredOrders.length}
                  </span>{' '}
                  orders
                  {showReset && (
                    <span className="text-gray-400"> (filtered)</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
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

              {/* Pagination */}
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
            <EmptyState
              title={showReset ? 'No matches found' : 'No orders found'}
              description={
                showReset
                  ? 'No orders match your current filters. Try adjusting your filter criteria.'
                  : 'When customers place orders, they will appear here for you to manage.'
              }
              icon={
                showReset ? (
                  <SearchX className="w-12 h-12" />
                ) : (
                  <Package className="w-12 h-12" />
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;

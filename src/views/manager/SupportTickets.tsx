import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Ticket,
  SearchX,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import {
  fetchAllSupportTickets,
  updateSupportTicketStatus,
} from '../../redux/actions/supportActions';

import {
  selectSupportTickets,
  selectSupportLoading,
  selectSupportStats,
} from '../../redux/selectors/supportSelectors';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import FilterSelect from '../../components/common/FilterSelect';
import PageHeader from '../../components/common/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import DebouncedSearch from '../../components/common/DebouncedSearch';

import Pagination from '../../components/common/Pagination';
import { selectSupportPagination } from '../../redux/selectors/supportSelectors';
import TicketCard from '../../components/manager/tickets/TicketCard';
import type { AppDispatch } from '../../redux/store';
import type {
  TicketStatus,
  SupportStats,
} from '../../redux/types/support.types';

const PAGE_LIMIT = 10;

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

export default function ManagerSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectSupportTickets);
  const loading = useSelector(selectSupportLoading);
  const { page, totalPages } = useSelector(selectSupportPagination);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
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
    const dateFrom = getDateFrom(dateFilter);
    dispatch(
      fetchAllSupportTickets(
        page,
        PAGE_LIMIT,
        statusFilter,
        undefined,
        dateFrom,
        sortOrder,
        search
      )
    );
  }, [dispatch, page, statusFilter, dateFilter, sortOrder, search]);

  const updateStatus = async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    try {
      await dispatch(updateSupportTicketStatus(id, status));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const serverStats = useSelector(selectSupportStats) as SupportStats | null;

  // Stats calculation
  const stats = useMemo(() => {
    if (serverStats) {
      return {
        total: serverStats.total,
        open: serverStats.open,
        in_progress: serverStats.in_progress,
        resolved: serverStats.resolved,
        closed: serverStats.closed,
      };
    }
    return { total: 0, open: 0, in_progress: 0, resolved: 0, closed: 0 };
  }, [serverStats]);

  const showReset =
    statusFilter !== 'all' || dateFilter !== 'all' || search !== '';

  const handleSearch = (val: string) => {
    setSearch(val);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setSortOrder('newest');
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-transparent px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <PageHeader
          title=" Tickets"
          highlightText="Assigned"
          subtitle="Manage and resolve your customer support requests"
          icon={Ticket}
        />

        {/* Stats Cards */}
        {/* {!loading && tickets.length > 0 && ( */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-slideUp">
          <div className="bg-gradient-to-br from-violet-50 to-purple-50/50 border border-violet-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
                  Total
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-violet-100 rounded-xl">
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-violet-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Open
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stats.open}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-amber-100 rounded-xl">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  In Progress
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stats.in_progress}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-blue-100 rounded-xl">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Resolved
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stats.resolved}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-slate-50/50 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Closed
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {stats.closed}
                </p>
              </div>
              <div className="p-2.5 sm:p-3 bg-gray-100 rounded-xl">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        {/* )} */}

        <FilterBar
          searchComponent={
            <DebouncedSearch
              placeholder="Search tickets..."
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
          {loading && tickets.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm border border-gray-100 rounded-3xl">
              <Loader />
              <p className="mt-4 text-gray-500 font-medium animate-pulse">
                Loading tickets...
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              title={showReset ? 'No matches found' : 'No assigned tickets'}
              description={
                showReset
                  ? 'No tickets match your current filters. Try adjusting your filter criteria.'
                  : 'Sit back and relax — nothing to resolve right now ✨'
              }
              icon={
                showReset ? (
                  <SearchX className="w-12 h-12" />
                ) : (
                  <Ticket className="w-12 h-12 text-green-200" />
                )
              }
            />
          ) : (
            <>
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-bold text-gray-700">
                    {tickets.length}
                  </span>{' '}
                  tickets
                  {showReset && (
                    <span className="text-gray-400"> (filtered)</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {tickets.map((ticket, index) => (
                  <div
                    key={ticket._id}
                    className="animate-slideUp"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TicketCard
                      ticket={ticket}
                      updating={updatingId === ticket._id}
                      onStatusChange={(status) =>
                        updateStatus(ticket._id, status)
                      }
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pt-10 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      const dateFrom = getDateFrom(dateFilter);
                      dispatch(
                        fetchAllSupportTickets(
                          p,
                          PAGE_LIMIT,
                          statusFilter,
                          undefined,
                          dateFrom,
                          sortOrder
                        )
                      );
                    }}
                    isLoading={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

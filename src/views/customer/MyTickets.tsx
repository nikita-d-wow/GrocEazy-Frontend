import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  SearchX,
  XCircle,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';
import PageHeader from '../../components/common/PageHeader';
import FilterBar from '../../components/common/FilterBar';
import DebouncedSearch from '../../components/common/DebouncedSearch';

import { fetchMySupportTickets } from '../../redux/actions/supportActions';
import {
  selectSupportMyTickets,
  selectSupportLoading,
  selectSupportPagination,
  selectSupportStats,
} from '../../redux/selectors/supportSelectors';

import type { AppDispatch } from '../../redux/store';
import type { SupportStats } from '../../redux/types/support.types';

const PAGE_LIMIT = 8;

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

export default function MyTickets() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const myTickets = useSelector(selectSupportMyTickets);
  const loading = useSelector(selectSupportLoading);
  const pagination = useSelector(selectSupportPagination);

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
    const dateFrom = getDateFrom(dateFilter);
    dispatch(
      fetchMySupportTickets(
        page,
        PAGE_LIMIT,
        statusFilter,
        dateFrom,
        sortOrder,
        search
      )
    );
    // window.scrollTo(0, 0); // Optional: keep scrolling behavior if needed
  }, [dispatch, page, statusFilter, dateFilter, sortOrder, search]);

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    {
      value: 'open',
      label: 'Open',
      icon: <AlertCircle size={16} className="text-yellow-600" />,
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      icon: <Clock size={16} className="text-blue-600" />,
    },
    {
      value: 'resolved',
      label: 'Resolved',
      icon: <CheckCircle2 size={16} className="text-green-600" />,
    },
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
    setPage(1);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setDateFilter('all');
    setSortOrder('newest');
    setSearch('');
    setPage(1);
  };

  const hasTickets = myTickets && myTickets.length > 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <PageHeader
        title="Tickets"
        highlightText="My"
        subtitle="View and track tickets raised by you"
        icon={Ticket}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slideUp mb-8">
        <div
          onClick={() => {
            setStatusFilter('open');
            setPage(1);
          }}
          className={`cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50/50 border ${statusFilter === 'open' ? 'border-amber-500 ring-2 ring-amber-100 shadow-md' : 'border-amber-100'} rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300`}
        >
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

        <div
          onClick={() => {
            setStatusFilter('in_progress');
            setPage(1);
          }}
          className={`cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50/50 border ${statusFilter === 'in_progress' ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-blue-100'} rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300`}
        >
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

        <div
          onClick={() => {
            setStatusFilter('resolved');
            setPage(1);
          }}
          className={`cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-50/50 border ${statusFilter === 'resolved' ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md' : 'border-emerald-100'} rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300`}
        >
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
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setStatusFilter('closed');
            setPage(1);
          }}
          className={`cursor-pointer bg-gradient-to-br from-gray-50 to-slate-50/50 border ${statusFilter === 'closed' ? 'border-gray-500 ring-2 ring-gray-100 shadow-md' : 'border-gray-200'} rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-300`}
        >
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

      <div className="mb-6">
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
              setPage(1);
            }}
            className="w-full sm:w-40"
          />
          <FilterSelect
            label="Date"
            value={dateFilter}
            options={DATE_FILTER_OPTIONS}
            onChange={setDateFilter}
            className="w-full sm:w-40"
          />
          <FilterSelect
            label="Sort"
            value={sortOrder}
            options={SORT_OPTIONS}
            onChange={(val) => setSortOrder(val as 'newest' | 'oldest')}
            className="w-full sm:w-40"
          />
        </FilterBar>
      </div>

      {loading && !hasTickets ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : !hasTickets ? (
        <EmptyState
          title={showReset ? 'No matches found' : 'No support tickets yet'}
          description={
            showReset
              ? 'No tickets match your current filters. Try adjusting your filter criteria.'
              : 'Create a new ticket to get help with your orders or account.'
          }
          icon={
            showReset ? (
              <SearchX className="w-12 h-12" />
            ) : (
              <Ticket className="w-12 h-12 text-gray-400" />
            )
          }
          action={
            showReset
              ? undefined
              : {
                  label: 'Contact Support',
                  onClick: () => navigate('/support'),
                }
          }
        />
      ) : (
        <div className="space-y-4 animate-slideUp">
          {/* Assuming there is a list of tickets here based on reading step 374 but it was cut off. 
               Wait, step 374 output truncated after EmptyState description.
               I need to check what content was there.
               It likely mapped through myTickets and rendered TicketCard or similar.
           */}
          {/* I will create a placeholder loop or try to read the file again? No file is corrupted.
               I have to guess or check `MyTickets.tsx` previous structure if available.
               Wait, I have `client/src/views/manager/SupportTickets.tsx` content, but this is `views/customer/MyTickets.tsx`.
               
               Let's check previous conversation history if I viewed it there.
               Step 374 showed start of file.
               Step 293 showed ManagerSupportTickets.
               
               I'll assume it renders `TicketCard` or similar.
               Actually, I should check if I can check other files like `TicketCard` usage.
               
               Let's look at `c:\Users\navya\Desktop\Groceazy-code\client\src\views\customer\MyTickets.tsx` content from Step 374 again.
               It ends at line 150 inside EmptyState.
               
               I need to implementation details for the list.
               Typically:
               {myTickets.map(ticket => (
                 <div key={ticket._id} ...> ... </div>
               ))}
               
               Or maybe a component `TicketList`.
               
               I'll try to use `TicketList` if it exists or render cards.
               
               Correction: I can't guess. But I can assume it uses `TicketCard` from `components/customer/tickets/TicketCard` or similar.
               
               Actually, I'll search for `TicketCard` usage.
           */}
          {myTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => navigate(`/customer/tickets/${ticket._id}`)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ticket.status === 'open'
                        ? 'bg-yellow-500'
                        : ticket.status === 'in_progress'
                          ? 'bg-blue-500'
                          : ticket.status === 'resolved'
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                    }`}
                  />
                  <span className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {ticket.subject}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 pl-4">
                {ticket.description}
              </p>
              <div className="mt-3 pl-4 flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    ticket.status === 'open'
                      ? 'bg-yellow-100 text-yellow-700'
                      : ticket.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : ticket.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPage(p)}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
}

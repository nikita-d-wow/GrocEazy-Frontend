import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, User, SearchX } from 'lucide-react';

import {
  fetchAllSupportTickets,
  fetchManagersForSupport,
  fetchSupportStats,
} from '../../redux/actions/supportActions';

import {
  selectSupportTickets,
  selectSupportLoading,
  selectSupportPagination,
  selectSupportManagers,
  selectSupportRefreshing,
  selectSupportStatsTickets,
} from '../../redux/selectors/supportSelectors';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';
import TicketAssignSelect from '../../components/admin/tickets/TicketAssignSelect';
import ManagerTicketStats from '../../components/admin/analytics/ManagerTicketStats';

import type { AppDispatch } from '../../redux/store';
import type { SupportTicket } from '../../redux/types/support.types';

import { STATUS_MAP } from '../../utils/ticketStatus';

const PAGE_LIMIT = 10;

export default function AdminSupportTickets() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportTickets);
  const managers = useSelector(selectSupportManagers);
  const loading = useSelector(selectSupportLoading);
  const refreshing = useSelector(selectSupportRefreshing);
  const statsTickets = useSelector(selectSupportStatsTickets);
  const { page, totalPages, total } = useSelector(selectSupportPagination);

  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllSupportTickets(page, PAGE_LIMIT));

    if (managers.length === 0) {
      dispatch(fetchManagersForSupport());
    }

    dispatch(fetchSupportStats());
  }, [dispatch, page, managers.length]);

  const filterOptions = useMemo(() => {
    const options = Object.keys(STATUS_MAP).map((status) => ({
      value: status,
      label: STATUS_MAP[status as keyof typeof STATUS_MAP].label,
      icon: STATUS_MAP[status as keyof typeof STATUS_MAP].icon,
    }));
    return [{ value: 'all', label: 'All Statuses' }, ...options];
  }, []);

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'all') {
      return tickets;
    }
    return tickets.filter((ticket) => ticket.status === statusFilter);
  }, [tickets, statusFilter]);

  return (
    <div className="min-h-screen relative">
      {/* SILENT REFRESH INDICATOR */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-100 z-50 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-progress origin-left" />
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10">
        {/* HEADER */}
        <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" size={28} />
            <h1 className="text-3xl font-semibold text-gray-800">
              Support Tickets
            </h1>
          </div>

          <FilterSelect
            label="Filter by Status"
            value={statusFilter}
            options={filterOptions}
            onChange={setStatusFilter}
            className="md:w-64"
          />
        </div>

        {loading && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader />
            <p className="mt-4 text-gray-500 animate-pulse">
              Loading tickets...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="animate-fadeIn">
            <EmptyState
              title="No Support Tickets"
              description="Everything is running smoothly ✨"
              icon={<ShieldCheck size={48} className="text-indigo-200" />}
            />
          </div>
        ) : (
          <>
            {/* STATS */}
            <ManagerTicketStats
              tickets={statsTickets.length > 0 ? statsTickets : tickets}
              managers={managers}
              totalCount={total}
            />

            {/* LIST */}
            {filteredTickets.length > 0 ? (
              <div className="space-y-8 mt-10">
                {filteredTickets.map((ticket: SupportTicket, index: number) => {
                  const statusUI = STATUS_MAP[ticket.status];

                  return (
                    <div
                      key={ticket._id}
                      style={{
                        zIndex: filteredTickets.length - index,
                        animationDelay: `${index * 50}ms`,
                      }}
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest('.assignee-select')
                        ) {
                          return;
                        }
                        navigate(`/admin/support/${ticket._id}`);
                      }}
                      className="
                        animate-slideUp
                        relative
                        rounded-2xl
                        bg-white/60 backdrop-blur-xl
                        border border-white/70
                        shadow-lg
                        transition-all duration-300
                        hover:shadow-2xl hover:bg-primary/5
                        cursor-pointer
                      "
                    >
                      <div className="p-6 sm:p-8">
                        {/* TOP */}
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                          <div className="min-w-0 flex-1">
                            <Link to={`/admin/support/${ticket._id}`}>
                              <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                {ticket.subject}
                              </h2>
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              Ticket ID • {ticket._id}
                            </p>
                          </div>

                          <span
                            className={`
                              flex items-center gap-2
                              px-4 py-1.5 rounded-full text-xs font-medium
                              ${statusUI.color}
                            `}
                          >
                            {statusUI.icon}
                            {statusUI.label}
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="mt-5 text-sm text-gray-700 line-clamp-2">
                          {ticket.description}
                        </p>

                        {/* META */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                          {/* CREATOR */}
                          <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl">
                            <div className="w-9 h-9 rounded-full bg-white border flex items-center justify-center text-indigo-600">
                              <User size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase text-gray-400 font-bold">
                                Raised By
                              </p>
                              <p className="font-semibold text-gray-800 truncate">
                                {ticket.user?.name || 'Customer'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {ticket.user?.email}
                              </p>
                            </div>
                          </div>

                          {/* ASSIGNMENT – FIXED */}
                          <div className="relative assignee-select">
                            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1 ml-1">
                              Assignee
                            </p>
                            <TicketAssignSelect
                              ticketId={ticket._id}
                              currentManager={ticket.assignedManager}
                              managers={managers}
                            />
                          </div>

                          {/* DATE */}
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold mb-1 ml-1">
                              Created At
                            </p>
                            <span className="flex items-center gap-2 text-gray-700">
                              <Calendar size={14} />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-10 h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-white/40 backdrop-blur-md border border-dashed border-gray-300 rounded-3xl animate-fadeIn">
                <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                  <SearchX size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    No matches found
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    No tickets currently match the "
                    {filterOptions.find((o) => o.value === statusFilter)?.label}
                    " status on this page.
                  </p>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="mt-4 text-indigo-600 font-semibold hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && statusFilter === 'all' && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) =>
                    dispatch(fetchAllSupportTickets(p, PAGE_LIMIT))
                  }
                  isLoading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

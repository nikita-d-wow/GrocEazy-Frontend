import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, User } from 'lucide-react';

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
import TicketAssignSelect from '../../components/admin/tickets/TicketAssignSelect';
import ManagerTicketStats from '../../components/admin/analytics/ManagerTicketStats';

import type { AppDispatch } from '../../redux/store';
import type { SupportTicket } from '../../redux/types/support.types';

import { STATUS_MAP } from '../../utils/ticketStatus';

const PAGE_LIMIT = 10;

export default function AdminSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportTickets);
  const managers = useSelector(selectSupportManagers);
  const loading = useSelector(selectSupportLoading);
  const refreshing = useSelector(selectSupportRefreshing);
  const statsTickets = useSelector(selectSupportStatsTickets);
  const { page, totalPages, total } = useSelector(selectSupportPagination);

  useEffect(() => {
    dispatch(fetchAllSupportTickets(page, PAGE_LIMIT));

    if (managers.length === 0) {
      dispatch(fetchManagersForSupport());
    }

    dispatch(fetchSupportStats());
  }, [dispatch, page, managers.length]);

  if (loading) {
    return <Loader />;
  }

  if (!tickets.length) {
    return (
      <EmptyState
        title="No Support Tickets"
        description="Everything is running smoothly ✨"
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* SILENT REFRESH INDICATOR */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-indigo-100 z-50 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-progress origin-left" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-indigo-600" size={28} />
          <h1 className="text-3xl font-semibold text-gray-800">
            Support Tickets
          </h1>
        </div>

        {/* STATS */}
        <ManagerTicketStats
          tickets={statsTickets.length > 0 ? statsTickets : tickets}
          managers={managers}
          totalCount={total}
        />

        {/* LIST */}
        <div className="space-y-8 mt-10">
          {tickets.map((ticket: SupportTicket, index: number) => {
            const statusUI = STATUS_MAP[ticket.status];

            return (
              <div
                key={ticket._id}
                style={{ zIndex: tickets.length - index }}
                className="
                  relative
                  rounded-2xl
                  bg-white/60 backdrop-blur-xl
                  border border-white/70
                  shadow-lg
                  transition-all duration-300
                  hover:shadow-2xl
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
                    <div className="relative">
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) =>
                dispatch(fetchAllSupportTickets(p, PAGE_LIMIT))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

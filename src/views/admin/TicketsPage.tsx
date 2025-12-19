import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, User, Calendar, Mail } from 'lucide-react';

import { fetchAllSupportTickets } from '../../redux/actions/supportActions';
import {
  selectSupportTickets,
  selectSupportLoading,
  selectSupportPagination,
} from '../../redux/selectors/supportSelectors';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

import type { AppDispatch } from '../../redux/store';
import type { SupportTicket } from '../../redux/types/support.types';

import { STATUS_MAP } from '../../utils/ticketStatus';

const PAGE_LIMIT = 10;

export default function AdminSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportTickets);
  const loading = useSelector(selectSupportLoading);
  const { page, totalPages } = useSelector(selectSupportPagination);

  useEffect(() => {
    dispatch(fetchAllSupportTickets(page, PAGE_LIMIT));
  }, [dispatch, page]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-14">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-indigo-600" size={28} />
          <h1 className="text-3xl font-semibold text-gray-800">
            Support Tickets
          </h1>
        </div>

        {/* LIST */}
        <div className="space-y-8">
          {tickets.map((ticket: SupportTicket) => {
            const statusUI = STATUS_MAP[ticket.status];

            return (
              <div
                key={ticket._id}
                className="
                  group relative rounded-2xl
                  bg-white/60 backdrop-blur-xl
                  border border-white/70
                  shadow-lg
                  transition-all duration-500
                  hover:shadow-2xl hover:-translate-y-1
                "
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-6 sm:p-8">
                  {/* TOP */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {ticket.subject}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Ticket ID • {ticket._id}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-2
                        px-4 py-1.5 rounded-full text-xs font-medium
                        backdrop-blur-md
                        ${statusUI.color}
                      `}
                    >
                      {statusUI.icon}
                      {statusUI.label}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-sm leading-relaxed text-gray-700">
                    {ticket.description}
                  </p>

                  {/* META */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-2">
                      <Mail size={14} />
                      {ticket.user?.email}
                    </span>

                    <span className="flex items-center gap-2">
                      <User size={14} />
                      {ticket.assignedManager?.name ?? 'Auto Assigned'}
                    </span>

                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
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

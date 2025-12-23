import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

import { fetchMySupportTickets } from '../../redux/actions/supportActions';
import {
  selectSupportMyTickets,
  selectSupportLoading,
  selectSupportPagination,
} from '../../redux/selectors/supportSelectors';

import type { AppDispatch } from '../../redux/store';
import type { SupportTicket } from '../../redux/types/support.types';

const PAGE_LIMIT = 4;

export default function MyTickets() {
  const dispatch = useDispatch<AppDispatch>();

  const myTickets = useSelector(selectSupportMyTickets);
  const loading = useSelector(selectSupportLoading);
  const pagination = useSelector(selectSupportPagination);

  const currentPage = pagination?.page || 1;

  useEffect(() => {
    dispatch(fetchMySupportTickets(currentPage, PAGE_LIMIT));
    window.scrollTo(0, 0);
  }, [dispatch, currentPage]);

  if (loading && (!myTickets || myTickets.length === 0)) {
    return <Loader />;
  }

  if (!myTickets || myTickets.length === 0) {
    return (
      <EmptyState
        title="No support tickets yet"
        description="When you contact support, your tickets will appear here."
      />
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        My Support Tickets
      </h1>

      <div className="space-y-5">
        {myTickets.map((ticket: SupportTicket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(p) => dispatch(fetchMySupportTickets(p, PAGE_LIMIT))}
          />
        </div>
      )}
    </div>
  );
}

/* ===================== TICKET CARD ===================== */

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
          Ticket ID
        </p>
        <p className="text-sm font-medium text-gray-600">{ticket._id}</p>
        <p className="mt-2 text-lg font-bold text-gray-900">{ticket.subject}</p>
        <p className="text-sm text-gray-500 mt-1">
          Created on{' '}
          <span className="font-medium">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className="flex items-center">
        <StatusChip status={ticket.status} />
      </div>
    </div>
  );
}

/* ===================== STATUS CHIP ===================== */

function StatusChip({ status }: { status: SupportTicket['status'] }) {
  if (status === 'open') {
    return (
      <Chip
        icon={<AlertCircle size={16} className="text-yellow-600" />}
        label="Open"
        className="bg-yellow-100 text-yellow-700"
      />
    );
  }

  if (status === 'in_progress') {
    return (
      <Chip
        icon={<Clock size={16} className="text-blue-600" />}
        label="In Progress"
        className="bg-blue-100 text-blue-700"
      />
    );
  }

  return (
    <Chip
      icon={<CheckCircle2 size={16} className="text-green-600" />}
      label="Resolved"
      className="bg-green-100 text-green-700"
    />
  );
}

function Chip({
  icon,
  label,
  className,
}: {
  icon: ReactNode;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

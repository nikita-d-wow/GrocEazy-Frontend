import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, SearchX } from 'lucide-react';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import FilterSelect from '../../components/common/FilterSelect';

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
  const navigate = useNavigate();

  const myTickets = useSelector(selectSupportMyTickets);
  const loading = useSelector(selectSupportLoading);
  const pagination = useSelector(selectSupportPagination);

  const currentPage = pagination?.page || 1;
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMySupportTickets(currentPage, PAGE_LIMIT, statusFilter));
    window.scrollTo(0, 0);
  }, [dispatch, currentPage, statusFilter]);

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

  const filteredTickets = myTickets || [];

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            My Support Tickets
          </h1>
          <p className="text-muted-text mt-1 font-medium">
            View and track your support requests
          </p>
        </div>

        <FilterSelect
          label="Filter by Status"
          value={statusFilter}
          options={filterOptions}
          onChange={setStatusFilter}
          className="md:w-64"
        />
      </div>

      {loading && (!myTickets || myTickets.length === 0) ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : !myTickets || myTickets.length === 0 ? (
        <EmptyState
          title="No support tickets yet"
          description="When you contact support, your tickets will appear here."
          icon={
            <AlertCircle size={48} className="text-muted-text opacity-30" />
          }
        />
      ) : (
        <>
          {filteredTickets.length > 0 ? (
            <div className="space-y-5">
              {filteredTickets.map((ticket: SupportTicket, index) => (
                <div
                  key={ticket._id}
                  className="animate-slideUp cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/customer/tickets/${ticket._id}`)}
                >
                  <TicketCard ticket={ticket} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 bg-card/40 backdrop-blur-md border border-dashed border-border rounded-3xl animate-fadeIn">
              <div className="p-4 bg-muted rounded-full text-muted-text opacity-50">
                <SearchX size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">
                  No matches found
                </h3>
                <p className="text-muted-text max-w-xs mx-auto">
                  No tickets currently match the "
                  {filterOptions.find((o) => o.value === statusFilter)?.label}"
                  status on this page.
                </p>
                <button
                  onClick={() => setStatusFilter('all')}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Clear filter
                </button>
              </div>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(p) =>
                  dispatch(fetchMySupportTickets(p, PAGE_LIMIT, statusFilter))
                }
                isLoading={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===================== TICKET CARD ===================== */

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-text opacity-50 font-semibold">
          Ticket ID
        </p>
        <p className="text-sm font-medium text-muted-text">{ticket._id}</p>
        <p className="mt-2 text-lg font-bold text-text">{ticket.subject}</p>
        <p className="text-sm text-muted-text mt-1">
          Created on{' '}
          <span className="font-medium text-text">
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
        icon={<AlertCircle size={16} className="text-yellow-500" />}
        label="Open"
        className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      />
    );
  }

  if (status === 'in_progress') {
    return (
      <Chip
        icon={<Clock size={16} className="text-blue-500" />}
        label="In Progress"
        className="bg-blue-500/10 text-blue-500 border border-blue-500/20"
      />
    );
  }

  return (
    <Chip
      icon={<CheckCircle2 size={16} className="text-primary" />}
      label="Resolved"
      className="bg-primary/10 text-primary border border-primary/20"
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

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Ticket, SearchX } from 'lucide-react';

import {
  fetchAllSupportTickets,
  updateSupportTicketStatus,
} from '../../redux/actions/supportActions';

import {
  selectSupportTickets,
  selectSupportLoading,
} from '../../redux/selectors/supportSelectors';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import FilterSelect from '../../components/common/FilterSelect';

import Pagination from '../../components/common/Pagination';
import { selectSupportPagination } from '../../redux/selectors/supportSelectors';
import TicketCard from '../../components/manager/tickets/TicketCard';
import type { AppDispatch } from '../../redux/store';
import type { TicketStatus } from '../../redux/types/support.types';

export default function ManagerSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectSupportTickets);
  const loading = useSelector(selectSupportLoading);
  const { page, totalPages } = useSelector(selectSupportPagination);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllSupportTickets(page, undefined, statusFilter));
  }, [dispatch, page, statusFilter]);

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

  const filteredTickets = tickets;

  const filterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10">
        <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-card rounded-2xl shadow-sm text-primary border border-border">
              <Ticket size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                My Assigned Tickets
              </h1>
              <p className="text-muted-text mt-1">
                Manage and resolve your customer support requests
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

        {loading && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
            <Loader />
            <p className="mt-4 text-muted-text animate-pulse">
              Syncing your tickets...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="animate-fadeIn">
            <EmptyState
              title="No assigned tickets"
              description="Sit back and relax — nothing to resolve right now ✨"
              icon={<Ticket size={48} className="text-primary/20" />}
            />
          </div>
        ) : filteredTickets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {filteredTickets.map((ticket, index) => (
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
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) =>
                    dispatch(fetchAllSupportTickets(p, undefined, statusFilter))
                  }
                  isLoading={loading}
                />
              </div>
            )}
          </>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-card/40 backdrop-blur-md border border-dashed border-border rounded-3xl animate-fadeIn">
            <div className="p-4 bg-muted rounded-full text-muted-text">
              <SearchX size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">No matches found</h3>
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
      </div>
    </div>
  );
}

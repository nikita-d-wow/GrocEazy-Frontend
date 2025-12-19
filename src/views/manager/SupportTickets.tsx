import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Ticket } from 'lucide-react';

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

import TicketCard from '../../components/manager/tickets/TicketCard';
import type { AppDispatch } from '../../redux/store';
import type { TicketStatus } from '../../redux/types/support.types';

export default function ManagerSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectSupportTickets);
  const loading = useSelector(selectSupportLoading);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllSupportTickets());
  }, [dispatch]);

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

  if (loading) {
    return <Loader />;
  }

  if (!tickets.length) {
    return (
      <EmptyState
        title="No assigned tickets"
        description="Sit back and relax — nothing to resolve right now ✨"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-[95%] lg:w-[90%] mx-auto py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
            <Ticket size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Assigned Tickets
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and resolve your customer support requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket, index) => (
            <div
              key={ticket._id}
              className="animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TicketCard
                ticket={ticket}
                updating={updatingId === ticket._id}
                onStatusChange={(status) => updateStatus(ticket._id, status)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

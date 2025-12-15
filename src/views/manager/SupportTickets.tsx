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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-10">
          <Ticket className="text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            My Assigned Tickets
          </h1>
        </div>

        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              updating={updatingId === ticket._id}
              onStatusChange={(status) => updateStatus(ticket._id, status)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

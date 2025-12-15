import { User, Calendar } from 'lucide-react';
import type { SupportTicket } from '../../../redux/types/support.types';

export default function TicketFooter({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
      <p className="flex items-center gap-2">
        <User size={14} />
        <span className="font-medium">Customer:</span>
        {ticket.user?.email}
      </p>

      <p className="flex items-center gap-2">
        <User size={14} />
        <span className="font-medium">Assigned:</span>
        {ticket.assignedManager?.name ?? 'You'}
      </p>

      <p className="flex items-center gap-2">
        <Calendar size={14} />
        {new Date(ticket.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

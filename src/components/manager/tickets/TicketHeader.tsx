import { Ticket } from 'lucide-react';
import type {
  SupportTicket,
  TicketStatus,
} from '../../../redux/types/support.types';
import TicketStatusSelect from './TicketStatusSelect';

interface Props {
  ticket: SupportTicket;
  updating: boolean;
  onStatusChange: (status: TicketStatus) => void;
}

export default function TicketHeader({
  ticket,
  updating,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">{ticket.subject}</h2>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <Ticket size={14} /> {ticket._id}
        </p>
      </div>

      <TicketStatusSelect
        status={ticket.status}
        disabled={updating}
        onChange={onStatusChange}
      />
    </div>
  );
}

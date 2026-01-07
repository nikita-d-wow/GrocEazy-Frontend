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
        <h2 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
          {ticket.subject}
        </h2>
        <p className="text-xs font-medium text-muted-text flex items-center gap-1.5 mt-2 bg-muted/50 w-fit px-2 py-1 rounded-lg border border-border">
          <Ticket size={14} className="text-primary" />
          <span className="tracking-wide font-mono text-[10px] text-muted-text">
            ID:
          </span>
          {ticket._id}
        </p>
      </div>

      <TicketStatusSelect
        status={ticket.status}
        disabled={
          updating || ticket.status === 'resolved' || ticket.status === 'closed'
        }
        onChange={onStatusChange}
      />
    </div>
  );
}

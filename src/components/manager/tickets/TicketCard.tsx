import type {
  SupportTicket,
  TicketStatus,
} from '../../../redux/types/support.types';
import TicketHeader from './TicketHeader';
import TicketFooter from './TicketFooter';

import { useNavigate } from 'react-router-dom';

interface Props {
  ticket: SupportTicket;
  updating: boolean;
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (_status: TicketStatus) => void;
}

export default function TicketCard({
  ticket,
  updating,
  onStatusChange,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        // Prevent navigation if clicking on status select or buttons
        if (
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).closest('select')
        ) {
          return;
        }
        navigate(`/manager/support/${ticket._id}`);
      }}
      className="
        group relative
        rounded-2xl border border-border
        bg-card/70 backdrop-blur-xl
        p-6 shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1 cursor-pointer
      "
    >
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r from-primary-light/50 via-green-100/50 to-emerald-100/50
          dark:from-primary/10 dark:via-green-900/10 dark:to-emerald-900/10
          transition duration-500 rounded-2xl
        "
      />

      <div className="relative">
        <TicketHeader
          ticket={ticket}
          updating={updating}
          onStatusChange={onStatusChange}
        />

        <p className="mt-4 text-sm text-text leading-relaxed">
          {ticket.description}
        </p>

        <TicketFooter ticket={ticket} />
      </div>
    </div>
  );
}

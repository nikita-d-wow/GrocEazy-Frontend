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
        group relative overflow-hidden
        rounded-2xl border border-white/50
        bg-white/70 backdrop-blur-xl
        p-6 shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1 cursor-pointer
      "
    >
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r from-violet-100/50 via-fuchsia-100/50 to-pink-100/50
          transition duration-500
        "
      />

      <div className="relative">
        <TicketHeader
          ticket={ticket}
          updating={updating}
          onStatusChange={onStatusChange}
        />

        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          {ticket.description}
        </p>

        <TicketFooter ticket={ticket} />
      </div>
    </div>
  );
}

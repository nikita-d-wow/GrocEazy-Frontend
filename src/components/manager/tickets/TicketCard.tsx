import type {
  SupportTicket,
  TicketStatus,
} from '../../../redux/types/support.types';
import TicketHeader from './TicketHeader';
import TicketFooter from './TicketFooter';

interface Props {
  ticket: SupportTicket;
  updating: boolean;
  onStatusChange: (status: TicketStatus) => void;
}

export default function TicketCard({
  ticket,
  updating,
  onStatusChange,
}: Props) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl border border-white/40
        bg-white/60 backdrop-blur-xl
        p-6 shadow-lg
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r from-primary/10 to-cyan-200/10
          transition
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

import { User, Calendar } from 'lucide-react';
import type { SupportTicket } from '../../../redux/types/support.types';

export default function TicketFooter({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs text-muted-text">
      <div className="flex items-center gap-2 group/item">
        <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-500 group-hover/item:bg-orange-100 dark:group-hover/item:bg-orange-500/20 transition-colors">
          <User size={14} />
        </div>
        <span className="truncate">
          <span className="font-medium text-text mr-1">Customer:</span>
          {ticket.user?.name
            ? `${ticket.user.name} (${ticket.user.email})`
            : ticket.user?.email}
        </span>
      </div>

      <div className="flex items-center gap-2 group/item">
        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-500 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-500/20 transition-colors">
          <User size={14} />
        </div>
        <span className="truncate">
          <span className="font-medium text-text mr-1">Assigned:</span>
          {ticket.assignedManager?.name ?? 'You'}
        </span>
      </div>

      <div className="flex items-center gap-2 group/item">
        <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-500/10 text-green-500 group-hover/item:bg-green-100 dark:group-hover/item:bg-green-500/20 transition-colors">
          <Calendar size={14} />
        </div>
        <span className="font-medium">
          {new Date(ticket.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

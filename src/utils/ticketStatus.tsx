import type { ReactNode } from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { TicketStatus } from '../redux/types/support.types';

export const STATUS_MAP: Record<
  TicketStatus,
  { label: string; color: string; icon: ReactNode }
> = {
  open: {
    label: 'Open',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <AlertCircle size={16} />,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    icon: <Clock size={16} />,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 size={16} />,
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-200 text-gray-600',
    icon: <XCircle size={16} />,
  },
};

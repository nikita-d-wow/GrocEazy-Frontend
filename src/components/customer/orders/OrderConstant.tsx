import type { ReactNode } from 'react';
import { CheckCircle2, Clock, Truck } from 'lucide-react';

export const CARD_BG =
  'bg-gradient-to-br from-gray-100/60 via-gray-50 to-gray-100/40';

export const statusChip: Record<string, ReactNode> = {
  delivered: (
    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <CheckCircle2 size={16} /> Delivered
    </span>
  ),

  processing: (
    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <Clock size={16} /> Processing
    </span>
  ),

  shipped: (
    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <Truck size={16} /> Shipped
    </span>
  ),
};

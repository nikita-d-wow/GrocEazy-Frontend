import type { ReactNode } from 'react';
import { CheckCircle2, Clock, Truck } from 'lucide-react';

export const CARD_BG =
  'bg-gradient-to-br from-gray-100/60 via-gray-50 to-gray-100/40';

export const statusChip: Record<string, ReactNode> = {
  Delivered: (
    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <CheckCircle2 size={16} /> Delivered
    </span>
  ),

  Processing: (
    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <Clock size={16} /> Processing
    </span>
  ),

  Shipped: (
    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <Truck size={16} /> Shipped
    </span>
  ),

  Pending: (
    <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <Clock size={16} /> Pending
    </span>
  ),

  Cancelled: (
    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm shadow-sm font-medium">
      <CheckCircle2 size={16} className="rotate-45" /> Cancelled
    </span>
  ),
};

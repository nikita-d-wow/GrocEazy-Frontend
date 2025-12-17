export const ORDER_STATUS_META: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
  },
  Processing: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200',
  },
  Shipped: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-200',
  },
  Delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
  },
  Cancelled: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200',
  },
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_META);

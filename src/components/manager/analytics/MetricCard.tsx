import type { ReactNode } from 'react';

export default function MetricCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`
        glass-card p-6
        bg-gradient-to-br ${bg}
        flex items-center justify-between
      `}
    >
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>

      <div className="p-3 rounded-xl bg-white/40 text-gray-900">{icon}</div>
    </div>
  );
}

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
        relative overflow-hidden group hover:scale-[1.02] transition-transform
      `}
    >
      <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${bg}`} />

      <div className="relative flex items-center justify-between z-10">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>

        <div
          className={`
            p-3.5 rounded-2xl
            bg-gradient-to-br ${bg}
            text-white shadow-sm
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

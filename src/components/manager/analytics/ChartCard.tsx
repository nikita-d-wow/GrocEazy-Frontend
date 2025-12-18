import type { ReactNode } from 'react';

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      {children}
    </div>
  );
}

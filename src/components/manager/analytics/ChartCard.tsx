import type { ReactNode } from 'react';

export default function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {description && (
          <p className="text-gray-400 text-xs mt-1 font-medium italic">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

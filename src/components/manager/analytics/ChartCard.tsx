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
    <div className="relative group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] transition-all duration-500 animate-fadeIn overflow-hidden cursor-pointer">
      {/* Subtle Background Glow Removed */}

      <div className="relative z-10 mb-8 flex items-baseline justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-gray-400 text-xs mt-1.5 font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

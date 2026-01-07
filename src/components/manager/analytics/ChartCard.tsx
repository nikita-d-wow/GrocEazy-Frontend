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
    <div className="relative group p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-md transition-all duration-500 animate-fadeIn overflow-hidden cursor-pointer">
      {/* Subtle Background Glow Removed */}

      <div className="relative z-10 mb-8 flex items-baseline justify-between">
        <div>
          <h3 className="text-xl font-black text-text tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-muted-text text-xs mt-1.5 font-semibold tracking-wide flex items-center gap-1.5">
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

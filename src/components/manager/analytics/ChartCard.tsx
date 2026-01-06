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
    <div className="relative group p-8 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] transition-all duration-500 animate-fadeIn overflow-hidden cursor-pointer">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

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

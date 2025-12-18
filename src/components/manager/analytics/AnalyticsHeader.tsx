import { BarChart3 } from 'lucide-react';

export default function AnalyticsHeader() {
  return (
    <div
      className="
        flex flex-col sm:flex-row
        sm:items-center sm:justify-between
        gap-4
      "
    >
      {/* LEFT */}
      <div>
        <div className="flex items-center gap-3">
          <div
            className="
              p-3 rounded-2xl shadow-sm
              bg-white text-indigo-600 border border-indigo-100
            "
          >
            <BarChart3 size={24} />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Manager Analytics
          </h1>
        </div>

        <p className="text-gray-500 mt-3 max-w-xl text-lg leading-relaxed">
          Monitor revenue trends, inventory health, and overall product
          performance in real time.
        </p>
      </div>

      {/* RIGHT (optional actions later) */}
      <div className="flex items-center gap-3">
        {/* Reserved for future:
            - Date range picker
            - Export button
            - Filters
        */}
      </div>
    </div>
  );
}

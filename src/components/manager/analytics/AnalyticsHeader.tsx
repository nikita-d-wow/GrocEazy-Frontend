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
              p-2 rounded-xl
              bg-indigo-100 text-indigo-600
            "
          >
            <BarChart3 size={22} />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Manager Analytics
          </h1>
        </div>

        <p className="text-gray-500 mt-2 max-w-xl">
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

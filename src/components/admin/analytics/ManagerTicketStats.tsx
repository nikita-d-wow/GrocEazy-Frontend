import React, { useMemo } from 'react';
import { Users, BarChart3, AlertCircle } from 'lucide-react';
import type { SupportTicket, IUser } from '../../../redux/types/support.types';

interface ManagerTicketStatsProps {
  tickets: SupportTicket[];
  managers: IUser[];
  totalCount?: number;
}

const ManagerTicketStats: React.FC<ManagerTicketStatsProps> = ({
  tickets,
  managers,
  totalCount,
}) => {
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize counts for all managers
    managers.forEach((m) => (counts[m._id] = 0));

    // Count tickets for each assigned manager
    tickets.forEach((ticket) => {
      if (ticket.assignedManager?._id) {
        counts[ticket.assignedManager._id] =
          (counts[ticket.assignedManager._id] || 0) + 1;
      }
    });

    return managers
      .map((manager) => ({
        ...manager,
        count: counts[manager._id] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [tickets, managers]);

  const unassignedCount = tickets.filter((t) => !t.assignedManager).length;
  const assignedCount = tickets.length - unassignedCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
      {/* OVERALL STATS */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">System Overview</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
              Global Stats
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Tickets</span>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-gray-800">
                {totalCount ?? tickets.length}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
            <span className="text-sm text-gray-500">Assigned</span>
            <span className="text-lg font-bold text-primary">
              {assignedCount}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Unassigned</span>
            </div>
            <span
              className={`text-lg font-bold ${unassignedCount > 0 ? 'text-amber-600' : 'text-gray-800'}`}
            >
              {unassignedCount}
            </span>
          </div>
        </div>
      </div>

      {/* MANAGER LIST */}
      <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Manager Distribution
            </h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
              System-Wide
            </p>
          </div>
        </div>

        {managers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <AlertCircle size={32} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">No managers found</p>
            <p className="text-[10px] opacity-70 mt-1 text-center max-w-[200px]">
              Active managers will appear here once they are added to the
              system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((manager) => (
              <div
                key={manager._id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-primary/20 hover:bg-white transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {(manager.name || manager.email || '?')
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {manager.name || 'Unnamed'}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {manager.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded-lg shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {manager.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTicketStats;

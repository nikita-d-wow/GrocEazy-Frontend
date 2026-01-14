import React, { useMemo } from 'react';
import { Users, BarChart3, AlertCircle } from 'lucide-react';
import type { SupportTicket, IUser } from '../../../redux/types/support.types';

interface ManagerTicketStatsProps {
  tickets: SupportTicket[];
  managers: IUser[];
  totalCount?: number;
  onStatusSelect?: (status: string) => void;
  onManagerSelect?: (managerId: string) => void;
  currentStatus?: string;
  currentManagerId?: string;
}

const ManagerTicketStats: React.FC<ManagerTicketStatsProps> = ({
  tickets,
  managers,
  totalCount,
  onStatusSelect,
  onManagerSelect,
  currentStatus,
  currentManagerId,
}) => {
  const stats = useMemo(() => {
    const counts: Record<
      string,
      { total: number; active: number; resolved: number }
    > = {};

    // Initialize counts for all managers
    managers.forEach(
      (m) => (counts[m._id] = { total: 0, active: 0, resolved: 0 })
    );

    // Count tickets for each assigned manager
    tickets.forEach((ticket) => {
      if (ticket.assignedManager?._id) {
        const mgrId = ticket.assignedManager._id;
        if (!counts[mgrId]) {
          counts[mgrId] = { total: 0, active: 0, resolved: 0 };
        }

        counts[mgrId].total += 1;
        if (['open', 'in_progress'].includes(ticket.status)) {
          counts[mgrId].active += 1;
        } else {
          counts[mgrId].resolved += 1;
        }
      }
    });

    return managers
      .map((manager) => ({
        ...manager,
        ...(counts[manager._id] || { total: 0, active: 0, resolved: 0 }),
      }))
      .sort((a, b) => b.active - a.active || b.total - a.total);
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
          <div
            onClick={() => onStatusSelect?.('all')}
            className={`flex justify-between items-center p-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-gray-50 active:scale-95 ${
              currentStatus === 'all' && currentManagerId === 'all'
                ? 'bg-primary/5 ring-1 ring-primary/20'
                : ''
            }`}
          >
            <span className="text-sm text-gray-500">Total Tickets</span>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-gray-800">
                {totalCount ?? tickets.length}
              </span>
            </div>
          </div>
          <div
            onClick={() => onManagerSelect?.('assigned')}
            className={`flex justify-between items-center border-t border-gray-50 pt-3 p-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-gray-50 active:scale-95 ${
              currentManagerId === 'assigned'
                ? 'bg-primary/5 ring-1 ring-primary/20'
                : ''
            }`}
          >
            <span className="text-sm text-gray-500">Assigned</span>
            <span className="text-lg font-bold text-primary">
              {assignedCount}
            </span>
          </div>
          <div
            onClick={() => onManagerSelect?.('unassigned')}
            className={`flex justify-between items-center border-t border-gray-50 pt-3 p-2 rounded-xl transition-all duration-200 cursor-pointer hover:bg-gray-50 active:scale-95 ${
              currentManagerId === 'unassigned'
                ? 'bg-amber-50 ring-1 ring-amber-200'
                : ''
            }`}
          >
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
                onClick={() => onManagerSelect?.(manager._id)}
                className={`flex flex-col p-4 rounded-2xl transition-all shadow-sm group cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  currentManagerId === manager._id
                    ? 'bg-white border-primary ring-2 ring-primary/10 shadow-md scale-[1.02]'
                    : 'bg-gray-50/50 border-gray-100 hover:border-primary/20 hover:bg-white'
                } border`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        currentManagerId === manager._id
                          ? 'bg-primary text-white'
                          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                      }`}
                    >
                      {(manager.name || manager.email || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {manager.name || 'Unnamed'}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {manager.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="flex flex-col p-2 bg-white rounded-xl border border-gray-100 items-center justify-center">
                    <span className="text-[10px] uppercase text-amber-600 font-bold mb-0.5">
                      Active
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      {manager.active}
                    </span>
                  </div>
                  <div className="flex flex-col p-2 bg-white rounded-xl border border-gray-100 items-center justify-center">
                    <span className="text-[10px] uppercase text-gray-400 font-bold mb-0.5">
                      Total
                    </span>
                    <span className="text-sm font-bold text-gray-500">
                      {manager.total}
                    </span>
                  </div>
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

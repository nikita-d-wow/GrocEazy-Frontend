import { useEffect, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Ticket,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  UserPlus,
  UserMinus,
} from 'lucide-react';

import api from '../../services/api';

import {
  fetchAllSupportTickets,
  updateSupportTicketStatus,
  unassignTicket,
} from '../../redux/actions/supportActions';

import {
  selectSupportTickets,
  selectSupportLoading,
} from '../../redux/selectors/supportSelectors';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

import type { AppDispatch } from '../../redux/store';
import type { TicketStatus } from '../../redux/types/support.types';

/* ---------------- STATUS UI ---------------- */
const STATUS_MAP: Record<
  TicketStatus,
  { label: string; color: string; icon: ReactNode }
> = {
  open: {
    label: 'Open',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <AlertCircle size={16} />,
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700',
    icon: <Clock size={16} />,
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle2 size={16} />,
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-200 text-gray-600',
    icon: <XCircle size={16} />,
  },
};

interface Manager {
  _id: string;
  name: string;
  email: string;
}

export default function AdminSupportTickets() {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector(selectSupportTickets);
  const loading = useSelector(selectSupportLoading);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<
    Record<string, string>
  >({});

  /* -------- FETCH TICKETS -------- */
  useEffect(() => {
    dispatch(fetchAllSupportTickets());
  }, [dispatch]);

  /* -------- FETCH MANAGERS -------- */
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const { data } = await api.get('/api/users?role=manager');
        setManagers(data.users as Manager[]);
      } catch {
        toast.error('Failed to load managers');
      }
    };

    fetchManagers();
  }, []);

  const updateStatus = async (id: string, status: TicketStatus) => {
    setUpdatingId(id);
    try {
      await dispatch(updateSupportTicketStatus(id, status));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const assignManager = async (ticketId: string) => {
    const managerId = selectedManager[ticketId];

    if (!managerId) {
      toast.error('Please select a manager');
      return;
    }

    setUpdatingId(ticketId);
    try {
      //   await dispatch(assignSupportTicketManager(ticketId, managerId));
      toast.success('Ticket assigned');
    } catch {
      toast.error('Assignment failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const unassign = async (id: string) => {
    setUpdatingId(id);
    try {
      await dispatch(unassignTicket(id));
      toast.success('Ticket unassigned');
    } catch {
      toast.error('Unassign failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!tickets.length) {
    return (
      <EmptyState
        title="No support tickets"
        description="All clear — no tickets available 🎉"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Admin Support Tickets
          </h1>
        </div>

        {/* TICKETS */}
        <div className="space-y-6">
          {tickets.map((ticket) => {
            const statusUI = STATUS_MAP[ticket.status];
            const isAssigned = Boolean(ticket.assignedManager);

            return (
              <div
                key={ticket._id}
                className="
                  group relative overflow-hidden
                  rounded-2xl border border-white/40
                  bg-white/60 backdrop-blur-xl
                  p-6 shadow-lg
                "
              >
                <div className="relative">
                  {/* HEADER */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {ticket.subject}
                        </h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Ticket size={14} /> {ticket._id}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                            inline-flex items-center gap-2
                            px-3 py-1 rounded-full text-xs font-medium
                            ${statusUI.color}
                          `}
                        >
                          {statusUI.icon}
                          {statusUI.label}
                        </span>

                        <select
                          disabled={updatingId === ticket._id}
                          value={ticket.status}
                          onChange={(e) =>
                            updateStatus(
                              ticket._id,
                              e.target.value as TicketStatus
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm bg-white"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* ASSIGN / UNASSIGN */}
                    {!isAssigned ? (
                      <div className="flex gap-2 items-center">
                        <select
                          className="border rounded-lg px-3 py-2 text-sm"
                          onChange={(e) =>
                            setSelectedManager((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select manager</option>
                          {managers.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name} ({m.email})
                            </option>
                          ))}
                        </select>

                        <button
                          disabled={updatingId === ticket._id}
                          onClick={() => assignManager(ticket._id)}
                          className="
                            inline-flex items-center gap-2
                            px-4 py-2 text-sm font-medium
                            rounded-lg
                            bg-primary text-white
                            disabled:opacity-50
                          "
                        >
                          <UserPlus size={16} />
                          Assign
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={updatingId === ticket._id}
                        onClick={() => unassign(ticket._id)}
                        className="
                          inline-flex items-center gap-2
                          px-4 py-2 text-sm font-medium
                          rounded-lg
                          bg-red-100 text-red-700
                          disabled:opacity-50
                        "
                      >
                        <UserMinus size={16} />
                        Unassign
                      </button>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-4 text-sm text-gray-700">
                    {ticket.description}
                  </p>

                  {/* FOOTER */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                    <p className="flex items-center gap-2">
                      <User size={14} />
                      {ticket.user?.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <User size={14} />
                      {ticket.assignedManager?.name ?? 'Unassigned'}
                    </p>

                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

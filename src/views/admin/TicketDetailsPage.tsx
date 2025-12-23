import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Clock,
  AlertCircle,
  Hash,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

import {
  selectSupportTickets,
  selectSupportManagers,
  selectSupportStatsTickets,
} from '../../redux/selectors/supportSelectors';
import {
  fetchAllSupportTickets,
  updateSupportTicketStatus,
  fetchManagersForSupport,
} from '../../redux/actions/supportActions';
import type { AppDispatch } from '../../redux/store';
import { STATUS_MAP } from '../../utils/ticketStatus';
import TicketAssignSelect from '../../components/admin/tickets/TicketAssignSelect';

export default function AdminTicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportTickets);
  const statsTickets = useSelector(selectSupportStatsTickets);
  const managers = useSelector(selectSupportManagers);

  // Combine tickets to find the one we need
  const ticket = useMemo(() => {
    return (
      tickets.find((t) => t._id === id) ||
      statsTickets.find((t) => t._id === id)
    );
  }, [tickets, statsTickets, id]);

  useEffect(() => {
    if (!ticket) {
      dispatch(fetchAllSupportTickets());
    }
    if (managers.length === 0) {
      dispatch(fetchManagersForSupport());
    }
  }, [dispatch, ticket, managers.length]);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Hash size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Ticket Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The ticket you're looking for might have been deleted or moved.
          </p>
          <button
            onClick={() => navigate('/admin/tickets')}
            className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Back to All Tickets
          </button>
        </div>
      </div>
    );
  }

  const statusUI = STATUS_MAP[ticket.status];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-6 sm:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* BACK BUTTON */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/tickets')}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-all font-medium group"
          >
            <ArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            <span>Back to Helpdesk</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <Hash size={14} /> {ticket._id}
          </div>
        </div>

        {/* MAIN HEADER CARD */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden relative p-8 sm:p-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary" size={28} />
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                  {ticket.subject}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span
                  className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm border ${statusUI.color}`}
                >
                  {statusUI.label}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex gap-2">
                {Object.entries(STATUS_MAP).map(([status, ui]) => (
                  <button
                    key={status}
                    onClick={() =>
                      dispatch(
                        updateSupportTicketStatus(ticket._id, status as any)
                      )
                    }
                    className={`p-2.5 rounded-xl transition-all border ${
                      ticket.status === status
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-primary/30'
                    }`}
                    title={ui.label}
                  >
                    {ui.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-primary" />
              Detailed Description
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg italic font-medium">
                "{ticket.description}"
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CUSTOMER CARD */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Customer Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 transition-transform">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Contact Person
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {ticket.user?.name || 'Customer'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Email Address
                  </p>
                  <p className="text-lg font-bold text-gray-800 truncate">
                    {ticket.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNMENT CARD */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <UserCheck size={18} className="text-primary" />
              Ticket Assignment
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Current Assignee
                  </p>
                  <TicketAssignSelect
                    ticketId={ticket._id}
                    currentManager={ticket.assignedManager}
                    managers={managers}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Reference Time
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(ticket.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

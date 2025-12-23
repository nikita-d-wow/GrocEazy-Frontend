import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';

import { selectSupportTickets } from '../../redux/selectors/supportSelectors';
import {
  fetchAllSupportTickets,
  updateSupportTicketStatus,
} from '../../redux/actions/supportActions';
import type { AppDispatch } from '../../redux/store';
import TicketStatusSelect from '../../components/manager/tickets/TicketStatusSelect';

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportTickets);

  // Find the ticket
  const ticket = useMemo(
    () => tickets.find((t) => t._id === id),
    [tickets, id]
  );

  useEffect(() => {
    if (!tickets.length) {
      dispatch(fetchAllSupportTickets());
    }
  }, [dispatch, tickets.length]);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ticket not found or loading...</p>
          <button
            onClick={() => navigate('/manager/support')}
            className="text-primary hover:underline"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: any) => {
    if (ticket._id) {
      dispatch(updateSupportTicketStatus(ticket._id, status));
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 sm:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/manager/support')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group mb-4"
        >
          <div className="p-2 rounded-full bg-white/50 group-hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Tickets</span>
        </button>

        {/* MAIN CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />

          <div className="p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
                    Support Ticket
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    <Hash size={12} /> {ticket._id}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {ticket.subject}
                </h1>
              </div>

              <div className="flex-shrink-0">
                <TicketStatusSelect
                  status={ticket.status}
                  onChange={handleStatusChange}
                  disabled={false} // Allow updates here
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white/50 rounded-xl p-6 border border-white/50 shadow-inner mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" />
                Issue Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* META GRID */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* CUSTOMER INFO */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100">
                <h3 className="text-sm font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <User size={18} className="text-orange-600" />
                  Customer Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">
                        {ticket.user?.name || 'Guest User'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium break-all">
                        {ticket.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TICKET INFO */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Ticket Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="font-medium">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Assigned To</p>
                      <p className="font-medium">
                        {ticket.assignedManager?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

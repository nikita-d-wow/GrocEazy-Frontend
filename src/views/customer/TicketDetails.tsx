import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import { selectSupportMyTickets } from '../../redux/selectors/supportSelectors';
import { fetchMySupportTickets } from '../../redux/actions/supportActions';
import type { AppDispatch } from '../../redux/store';

export default function CustomerTicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const tickets = useSelector(selectSupportMyTickets);

  useEffect(() => {
    if (!tickets || tickets.length === 0) {
      dispatch(fetchMySupportTickets());
    }
  }, [dispatch, tickets]);

  const ticket = useMemo(
    () => tickets?.find((t) => t._id === id),
    [tickets, id]
  );

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl animate-fadeIn">
          <Loader />
          <p className="text-gray-500 mt-6 font-medium animate-pulse">
            Fetching ticket details...
          </p>
          <button
            onClick={() => navigate('/customer/tickets')}
            className="mt-8 px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-all text-sm font-semibold"
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/customer/tickets')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group mb-4"
        >
          <div className="p-2 rounded-full bg-white/50 group-hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to My Tickets</span>
        </button>

        {/* MAIN CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400" />

          <div className="p-6 sm:p-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
                    Support Ticket
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    <Hash size={12} /> {ticket._id}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {ticket.subject}
                </h1>
              </div>

              <div className="flex-shrink-0">
                <StatusChip status={ticket.status} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white/50 rounded-xl p-6 border border-white/50 shadow-inner mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" />
                Your Message
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 gap-6">
              {/* TICKET INFO */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  Ticket Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">
                        Created On
                      </p>
                      <p className="font-semibold text-gray-700">
                        {new Date(ticket.createdAt).toLocaleDateString()}
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

function StatusChip({ status }: { status: string }) {
  const configs: any = {
    open: {
      label: 'Open',
      icon: <AlertCircle size={16} />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    in_progress: {
      label: 'In Progress',
      icon: <Clock size={16} />,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    resolved: {
      label: 'Resolved',
      icon: <CheckCircle2 size={16} />,
      color: 'bg-green-100 text-green-700 border-green-200',
    },
  };

  const config = configs[status] || configs.open;

  return (
    <span
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

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
        <div className="text-center p-8 glass-card rounded-3xl shadow-xl animate-fadeIn">
          <Loader />
          <p className="text-muted-text mt-6 font-medium animate-pulse">
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
          className="flex items-center gap-2 text-muted-text hover:text-primary transition-colors group mb-4"
        >
          <div className="p-2 rounded-full bg-card group-hover:bg-muted shadow-sm transition-all border border-border">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium text-text">Back to My Tickets</span>
        </button>

        {/* MAIN CARD */}
        <div className="glass-card shadow-xl rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400 opacity-70" />

          <div className="p-6 sm:p-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
                    Support Ticket
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-text font-mono bg-muted px-2 py-1 rounded border border-border">
                    <Hash size={12} /> {ticket._id}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text leading-tight">
                  {ticket.subject}
                </h1>
              </div>

              <div className="flex-shrink-0">
                <StatusChip status={ticket.status} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-muted/50 rounded-xl p-6 border border-border shadow-inner mb-8">
              <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" />
                Your Message
              </h3>
              <p className="text-muted-text leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-1 gap-6">
              {/* TICKET INFO */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <h3 className="text-sm font-bold text-blue-500 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" />
                  Ticket Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-text opacity-60 font-bold">
                        Created On
                      </p>
                      <p className="font-semibold text-text">
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
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    in_progress: {
      label: 'In Progress',
      icon: <Clock size={16} />,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    resolved: {
      label: 'Resolved',
      icon: <CheckCircle2 size={16} />,
      color: 'bg-primary/10 text-primary border-primary/20',
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

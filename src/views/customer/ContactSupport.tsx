import { useNavigate } from 'react-router-dom';

import SupportHeader from '../../components/customer/support/SupportHeader';
import SupportContactCards from '../../components/customer/support/SupportContactCards';
import SupportForm from '../../components/customer/support/SupportForm';
import SupportFAQ from '../../components/customer/support/SupportFAQ';
import { Ticket } from 'lucide-react';
export default function ContactSupport() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 relative z-10">
        {/* Header + My Tickets button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SupportHeader />

          {/* ✅ My Tickets Button */}
          <button
            onClick={() => navigate('/customer/tickets')}
            className="
    inline-flex items-center gap-2
    px-6 py-2.5
    rounded-full
    border border-primary
    text-primary
    font-semibold text-sm
    hover:bg-primary hover:text-white
    active:scale-95
    transition-all
    self-start sm:self-auto
  "
          >
            <Ticket size={18} />
            My Tickets
          </button>
        </div>

        <SupportContactCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
          <SupportForm />
          <SupportFAQ />
        </div>
      </div>
    </div>
  );
}

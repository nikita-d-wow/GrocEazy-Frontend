import SupportHeader from '../../components/customer/support/SupportHeader';
import SupportContactCards from '../../components/customer/support/SupportContactCards';
import SupportForm from '../../components/customer/support/SupportForm';
import SupportFAQ from '../../components/customer/support/SupportFAQ';

export default function ContactSupport() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-yellow-50 opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 relative z-10">
        <SupportHeader />
        <SupportContactCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SupportForm />
          <SupportFAQ />
        </div>
      </div>
    </div>
  );
}

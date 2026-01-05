import { type FC } from 'react';
import { ScrollText, ShieldCheck, Clock, FileText } from 'lucide-react';

const TermsPage: FC = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 relative z-10 animate-fadeIn">
        {/* Header section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="p-4 bg-white rounded-2xl mb-6 shadow-sm border border-green-100 flex items-center justify-center">
            <ScrollText size={36} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2">
              <Clock size={16} />
              Updated: Jan 2026
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              Verified
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-12 animate-slideUp">
          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                1
              </div>
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
              By accessing and using <strong>GrocEazy</strong>, you acknowledge
              that you have read, understood, and agree to be bound by these
              Terms of Service. If you do not agree with any part of these
              terms, you must not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                2
              </div>
              User Accounts
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
              To use certain features, you must register for an account. You
              agree to:
            </p>
            <ul className="list-disc pl-16 space-y-2 text-gray-600 text-sm md:text-base">
              <li>Provide accurate, current, and complete information.</li>
              <li>
                Maintain the security and confidentiality of your password.
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account.
              </li>
              <li>
                Take full responsibility for all activities that occur under
                your account.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                3
              </div>
              Orders and Fulfillment
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
              All orders placed through GrocEazy are subject to acceptance. We
              reserve the right to refuse or cancel any order for reasons
              including but not limited to product availability, errors in
              pricing, or suspicion of fraudulent activity. Delivery times are
              estimates and may vary based on external factors.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                4
              </div>
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
              The content, features, and functionality of GrocEazy, including
              but not limited to text, graphics, logos, and software, are the
              exclusive property of GrocEazy and its licensors and are protected
              by international copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-4 border-t border-gray-100 pt-8 mt-12 bg-gray-50/50 -mx-6 md:-mx-10 px-6 md:px-10 pb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              Contact Information
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              If you have any questions about these Terms, please reach out to
              our legal team:
            </p>
            <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
              <p className="text-sm font-semibold text-gray-800">
                Email: legal@groceazy.com
              </p>
              <p className="text-sm text-gray-500">
                Address: 123 Green Street, Fresh City, FC 12345
              </p>
            </div>
          </section>
        </div>

        {/* Footer info internally */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} GrocEazy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

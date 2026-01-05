import { type FC } from 'react';
import { ShieldCheck, Lock, Eye, Clock } from 'lucide-react';
import { privacyPolicyData } from '../../data/privacyPolicyData';

const PrivacyPolicy: FC = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 relative z-10 animate-fadeIn">
        {/* Header section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="p-4 bg-white rounded-2xl mb-6 shadow-sm border border-green-100 flex items-center justify-center">
            <Lock size={36} className="text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2">
              <Clock size={16} />
              Updated: Jan 2026
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-500" />
              Secure
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-12 animate-slideUp">
          <div className="prose prose-green max-w-none">
            <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-8">
              At <strong>GrocEazy</strong>, we value your privacy and are
              committed to protecting your personal data. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you use our grocery delivery platform.
            </p>

            {privacyPolicyData.map((section) => (
              <section key={section.id} className="space-y-4 mb-10">
                <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-900">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                    {section.id}
                  </div>
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-11">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="list-disc pl-16 space-y-2 text-gray-600 text-sm md:text-base">
                    {section.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="space-y-4 border-t border-gray-100 pt-8 mt-12 bg-gray-50/50 -mx-6 md:-mx-10 px-6 md:px-10 pb-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye className="text-primary" size={20} />
                Contact Our Privacy Officer
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                For any privacy-related concerns or data requests, please
                contact us:
              </p>
              <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
                <p className="text-sm font-semibold text-gray-800">
                  Email: privacy@groceazy.com
                </p>
                <p className="text-sm text-gray-500">
                  Topic: Data Protection Inquiry
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer info internally */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} GrocEazy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

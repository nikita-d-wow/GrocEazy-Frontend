import { MessageCircleQuestion } from 'lucide-react';
import { faqs } from '../../../data/faqs';

export default function SupportFAQ() {
  return (
    <div className="animate-slideUp delay-75">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <MessageCircleQuestion size={20} className="text-primary" />
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="
              group border border-gray-200 rounded-xl p-4 
              bg-white/70 backdrop-blur-md
              hover:border-primary hover:bg-green-50
              transition-all duration-300 cursor-pointer shadow-sm
            "
          >
            <summary className="font-medium text-gray-800 flex justify-between items-center">
              {faq.question}
              <span className="text-primary transition-transform duration-300 group-open:rotate-180">
                ▼
              </span>
            </summary>

            <p className="mt-3 text-gray-700 leading-relaxed animate-fadeIn">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

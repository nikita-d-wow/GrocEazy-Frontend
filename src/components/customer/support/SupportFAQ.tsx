import { MessageCircleQuestion } from 'lucide-react';
import { faqs } from '../../../data/faqs';

export default function SupportFAQ() {
  return (
    <div className="animate-slideUp delay-75">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-text">
        <MessageCircleQuestion size={20} className="text-primary" />
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="
              group border border-border rounded-xl p-4 
              bg-card/70 backdrop-blur-md
              hover:border-primary hover:bg-primary/5
              transition-all duration-300 cursor-pointer shadow-sm
            "
          >
            <summary className="font-medium text-text flex justify-between items-center">
              {faq.question}
              <span className="text-primary transition-transform duration-300 group-open:rotate-180">
                ▼
              </span>
            </summary>

            <p className="mt-3 text-muted-text leading-relaxed animate-fadeIn">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

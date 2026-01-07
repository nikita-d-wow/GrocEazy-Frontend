import { MessageCircleQuestion } from 'lucide-react';

export default function SupportHeader() {
  return (
    <div className="mb-12 animate-fadeIn">
      <div className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm px-5 py-2 rounded-full border border-primary/20 shadow-sm">
        <MessageCircleQuestion className="text-primary" size={22} />
        <span className="text-primary font-medium tracking-wide">
          Help & Support Center
        </span>
      </div>

      <h1 className="text-4xl font-bold text-text tracking-tight mt-4">
        Contact Support
      </h1>

      <p className="text-muted-text mt-2 max-w-xl">
        We're here to assist you. Choose a support option or submit a ticket.
      </p>
    </div>
  );
}

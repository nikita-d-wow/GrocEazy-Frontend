export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'How long does delivery take?',
    answer:
      'Most orders are delivered within 30–45 minutes depending on your location.',
  },
  {
    question: 'Can I cancel my order?',
    answer:
      'Yes, you can cancel before it is shipped. After shipment, cancellation is not possible.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI, credit/debit cards, net banking, and wallet payments.',
  },
  {
    question: 'How do I request a refund?',
    answer:
      'Refund requests can be made through the order details page or by contacting support.',
  },
];

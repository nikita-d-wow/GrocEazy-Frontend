export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery times may vary based on location and availability. You will see delivery updates once your order is confirmed.',
  },
  {
    question: 'Can I cancel my order?',
    answer:
      'Order cancellation depends on the current order status. Please contact support as soon as possible for assistance.',
  },
  {
    question: 'How do I place an order?',
    answer:
      'Browse products, add items to your cart, and place the order by providing delivery details. Payment features will be added soon.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach our support team using the Contact Support page. All your support requests will be visible under My Tickets.',
  },
];

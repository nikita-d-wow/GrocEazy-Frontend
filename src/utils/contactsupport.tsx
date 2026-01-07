import { Phone, Mail, ClipboardList } from 'lucide-react';

const cards = [
  {
    icon: <Phone className="text-primary" size={26} />,
    title: 'Call Us',
    text: '+91 98765 43210',
    colors:
      'from-green-100 to-green-50 border-green-200 dark:from-green-500/20 dark:to-green-500/10 dark:border-green-500/30',
  },
  {
    icon: <Mail className="text-primary" size={26} />,
    title: 'Email Support',
    text: 'support@groceazy.com',
    colors:
      'from-yellow-100 to-yellow-50 border-yellow-200 dark:from-yellow-500/20 dark:to-yellow-500/10 dark:border-yellow-500/30',
  },
  {
    icon: <ClipboardList className="text-primary" size={26} />,
    title: 'Working Hours',
    text: 'Mon–Sat: 9 AM – 9 PM',
    colors:
      'from-orange-100 to-orange-50 border-orange-200 dark:from-orange-500/20 dark:to-orange-500/10 dark:border-orange-500/30',
  },
];

export default cards;

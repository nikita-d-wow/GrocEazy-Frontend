import { Phone, Mail, ClipboardList, MessageSquare } from 'lucide-react';

const cards = [
  {
    icon: <MessageSquare className="text-primary" size={26} />,
    title: 'Live Chat',
    text: 'Chat with our experts 24/7',
    colors: 'from-blue-100 to-blue-50 border-blue-200',
    to: '/contact', // This page is used to trigger chat activation usually or goes to main support
    isChat: true,
  },
  {
    icon: <Phone className="text-primary" size={26} />,
    title: 'Call Us',
    text: '+91 98765 43210',
    colors: 'from-green-100 to-green-50 border-green-200',
  },
  {
    icon: <Mail className="text-primary" size={26} />,
    title: 'Email Support',
    text: 'support@groceazy.com',
    colors: 'from-yellow-100 to-yellow-50 border-yellow-200',
  },
  {
    icon: <ClipboardList className="text-primary" size={26} />,
    title: 'Working Hours',
    text: 'Mon–Sat: 9 AM – 9 PM',
    colors: 'from-orange-100 to-orange-50 border-orange-200',
  },
];

export default cards;

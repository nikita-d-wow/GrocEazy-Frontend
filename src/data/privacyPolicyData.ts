export interface PrivacySection {
  id: number;
  title: string;
  content: string;
  list?: string[];
}

export const privacyPolicyData: PrivacySection[] = [
  {
    id: 1,
    title: 'Information Collection',
    content:
      'We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This includes:',
    list: [
      'Name and contact information',
      'Delivery address',
      'Order history and preferences',
    ],
  },
  {
    id: 2,
    title: 'How We Use Your Information',
    content:
      'We use the collected information to provide, maintain, and improve our services, including:',
    list: [
      'Processing and delivering your orders',
      'Communicating with you about your account and orders',
      'Personalizing your shopping experience',
      'Ensuring the security of our platform',
    ],
  },
  {
    id: 3,
    title: 'Information Sharing',
    content:
      'We do not sell your personal information. We share your data only with trusted partners necessary for our operations, such as delivery partners who help us fulfill your orders.',
  },
  {
    id: 4,
    title: 'Data Security',
    content:
      'We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. We prioritize the safety of your personal data through secure administrative and technical controls.',
  },
  {
    id: 5,
    title: 'Your Choices',
    content:
      'You can access and update your account information at any time through your profile settings. You also have the right to request deletion of your data, subject to legal and operational requirements.',
  },
];

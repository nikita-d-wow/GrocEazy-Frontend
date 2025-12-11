import type { Order } from '../types/Order.ts';

export const MOCK_ORDERS: Order[] = [
  {
    _id: '65ab30912cgf11',
    totalAmount: 899,
    status: 'delivered',
    paymentStatus: 'paid',
    placedAt: new Date().toISOString(),
    address: {
      fullName: 'John Doe',
      line1: '12 Green Street',
      city: 'Hyderabad',
      state: 'TS',
      postalCode: '500001',
      phone: '9876543210',
    },
    items: [
      {
        productId: '1',
        productName: 'Fresh Tomatoes',
        image:
          'https://cdn.pixabay.com/photo/2016/03/05/19/02/tomatoes-1238255_1280.jpg',
        quantity: 2,
        unitPrice: 199,
        lineTotal: 398,
      },
    ],
  },

  /* ----------- MORE SAMPLE ORDERS ----------- */

  {
    _id: '65ab30912cgf12',
    totalAmount: 1299,
    status: 'processing',
    paymentStatus: 'paid',
    placedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    address: {
      fullName: 'Aarav Sharma',
      line1: '221B Lotus Enclave',
      city: 'Bangalore',
      state: 'KA',
      postalCode: '560034',
      phone: '9876501234',
    },
    items: [
      {
        productId: '2',
        productName: 'Organic Bananas',
        image:
          'https://cdn.pixabay.com/photo/2018/02/01/22/30/bananas-3120729_1280.jpg',
        quantity: 3,
        unitPrice: 99,
        lineTotal: 297,
      },
      {
        productId: '3',
        productName: 'Basmati Rice (5kg)',
        image:
          'https://cdn.pixabay.com/photo/2015/03/26/09/39/rice-690109_1280.jpg',
        quantity: 1,
        unitPrice: 999,
        lineTotal: 999,
      },
    ],
  },

  {
    _id: '65ab30912cgf13',
    totalAmount: 499,
    status: 'shipped',
    paymentStatus: 'paid',
    placedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    address: {
      fullName: 'Neha Kapoor',
      line1: '45 Sunrise Apartments',
      city: 'Mumbai',
      state: 'MH',
      postalCode: '400001',
      phone: '9998841230',
    },
    items: [
      {
        productId: '4',
        productName: 'Brown Bread',
        image:
          'https://cdn.pixabay.com/photo/2016/10/15/14/39/bread-1746467_1280.jpg',
        quantity: 1,
        unitPrice: 89,
        lineTotal: 89,
      },
      {
        productId: '5',
        productName: 'Almond Milk',
        image:
          'https://cdn.pixabay.com/photo/2020/08/01/10/21/almond-milk-5452530_1280.jpg',
        quantity: 2,
        unitPrice: 205,
        lineTotal: 410,
      },
    ],
  },

  {
    _id: '65ab30912cgf14',
    totalAmount: 1599,
    status: 'delivered',
    paymentStatus: 'paid',
    placedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    address: {
      fullName: 'Ravi Teja',
      line1: 'Plot 89 Maple Colony',
      city: 'Chennai',
      state: 'TN',
      postalCode: '600018',
      phone: '9988776655',
    },
    items: [
      {
        productId: '6',
        productName: 'Olive Oil (1L)',
        image:
          'https://cdn.pixabay.com/photo/2016/03/05/21/43/olive-oil-1238257_1280.jpg',
        quantity: 1,
        unitPrice: 799,
        lineTotal: 799,
      },
      {
        productId: '7',
        productName: 'Whole Wheat Flour (2kg)',
        image:
          'https://cdn.pixabay.com/photo/2016/03/27/20/57/flour-1280557_1280.jpg',
        quantity: 1,
        unitPrice: 299,
        lineTotal: 299,
      },
      {
        productId: '8',
        productName: 'Honey (500g)',
        image:
          'https://cdn.pixabay.com/photo/2014/12/21/23/36/honey-575000_1280.png',
        quantity: 1,
        unitPrice: 499,
        lineTotal: 499,
      },
    ],
  },

  {
    _id: '65ab30912cgf15',
    totalAmount: 299,
    status: 'processing',
    paymentStatus: 'paid',
    placedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    address: {
      fullName: 'Sita Reddy',
      line1: '98 Rose Villa',
      city: 'Pune',
      state: 'MH',
      postalCode: '411001',
      phone: '9876123450',
    },
    items: [
      {
        productId: '9',
        productName: 'Coriander Leaves',
        image:
          'https://cdn.pixabay.com/photo/2018/06/18/18/46/coriander-3485096_1280.jpg',
        quantity: 3,
        unitPrice: 45,
        lineTotal: 135,
      },
      {
        productId: '10',
        productName: 'Ginger (250g)',
        image:
          'https://cdn.pixabay.com/photo/2016/04/27/20/38/ginger-1356782_1280.jpg',
        quantity: 1,
        unitPrice: 164,
        lineTotal: 164,
      },
    ],
  },
];

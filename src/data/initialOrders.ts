import { Order, QueueTicket } from '../types';
import { MENU_ITEMS } from './menuData';

const findItem = (id: string) => MENU_ITEMS.find((i) => i.id === id)!;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#EXT-101',
    type: 'dine_in',
    tableNumber: 2,
    customerName: 'Sofia Gomez',
    customerPhone: '09171234567',
    items: [
      {
        cartId: 'c1',
        menuItem: findItem('sig-ext-signature'),
        quantity: 1,
        customization: { sweetness: 50 },
        unitPrice: 220,
        totalPrice: 220,
      },
      {
        cartId: 'c2',
        menuItem: findItem('pasta-la-trufa'),
        quantity: 1,
        customization: {},
        unitPrice: 300,
        totalPrice: 300,
      }
    ],
    itemStatuses: { c1: true, c2: false },
    status: 'in_prep',
    paymentMethod: 'gcash',
    paymentStatus: 'paid',
    paymentDetails: {
      gcashRef: 'MP-9A8B7C6D5',
      gcashMobile: '0917****567',
      receiptNumber: 'EXT-OR-20260901-1001',
    },
    subtotal: 520,
    discountAmount: 0,
    vatExemptAmount: 0,
    vatAmount: 55.71,
    total: 520,
    createdAt: Date.now() - 1000 * 60 * 8, // 8 mins ago
    prepStartedAt: Date.now() - 1000 * 60 * 6,
  },
  {
    id: 'ord-102',
    orderNumber: '#EXT-102',
    type: 'takeaway',
    customerName: 'Carlos Dizon',
    customerPhone: '09289876543',
    items: [
      {
        cartId: 'c3',
        menuItem: findItem('matcha-strawberry'),
        quantity: 2,
        customization: { milk: 'oat', sweetness: 50 },
        unitPrice: 270, // 220 + 50 oat
        totalPrice: 540,
      },
      {
        cartId: 'c4',
        menuItem: findItem('croissant-ham-cheese'),
        quantity: 1,
        customization: {},
        unitPrice: 180,
        totalPrice: 180,
      }
    ],
    itemStatuses: { c3: true, c4: true },
    status: 'ready',
    paymentMethod: 'gcash',
    paymentStatus: 'paid',
    paymentDetails: {
      gcashRef: 'MP-3F4E5D6C7',
      gcashMobile: '0928****543',
      receiptNumber: 'EXT-OR-20260901-1002',
    },
    subtotal: 720,
    discountAmount: 0,
    vatExemptAmount: 0,
    vatAmount: 77.14,
    total: 720,
    createdAt: Date.now() - 1000 * 60 * 14,
    prepStartedAt: Date.now() - 1000 * 60 * 12,
    readyAt: Date.now() - 1000 * 60 * 2,
  },
  {
    id: 'ord-103',
    orderNumber: '#EXT-103',
    type: 'dine_in',
    tableNumber: 5,
    customerName: 'Dev Team Meeting',
    customerPhone: '09055554321',
    items: [
      {
        cartId: 'c5',
        menuItem: findItem('coffee-iced-spanish-latte'),
        quantity: 3,
        customization: { sweetness: 75 },
        unitPrice: 140,
        totalPrice: 420,
      },
      {
        cartId: 'c6',
        menuItem: findItem('patatas-fries'),
        quantity: 2,
        customization: {},
        unitPrice: 130,
        totalPrice: 260,
      },
      {
        cartId: 'c7',
        menuItem: findItem('patatas-chili-con-tatas'),
        quantity: 1,
        customization: {},
        unitPrice: 200,
        totalPrice: 200,
      }
    ],
    itemStatuses: { c5: false, c6: false, c7: false },
    status: 'placed',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    paymentDetails: {
      cashTendered: 1000,
      changeGiven: 120,
      receiptNumber: 'EXT-OR-20260901-1003',
    },
    subtotal: 880,
    discountAmount: 0,
    vatExemptAmount: 0,
    vatAmount: 94.29,
    total: 880,
    createdAt: Date.now() - 1000 * 60 * 2,
    isRush: true,
  },
];

export const INITIAL_QUEUE: QueueTicket[] = [
  {
    id: 'q-101',
    ticketNumber: 'Q-018',
    customerName: 'Atty. Mendoza',
    phone: '09178889999',
    partySize: 4,
    preferredSection: 'indoor',
    status: 'waiting',
    createdAt: Date.now() - 1000 * 60 * 12,
    estimatedWaitMinutes: 10,
  },
  {
    id: 'q-102',
    ticketNumber: 'Q-019',
    customerName: 'Bianca & Friends',
    phone: '09192223333',
    partySize: 2,
    preferredSection: 'patio',
    status: 'called',
    createdAt: Date.now() - 1000 * 60 * 18,
    calledAt: Date.now() - 1000 * 60 * 1,
    estimatedWaitMinutes: 0,
  },
];

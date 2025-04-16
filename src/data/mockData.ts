
import { Service } from '@/types/service';

export const nearbyServices: Service[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Deep House Cleaning',
    providerName: 'CleanHome Services',
    rating: 4.8,
    price: 250000,
    distance: 2.3,
    category: 'Kebersihan'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Math Tutoring',
    providerName: 'John Smith',
    rating: 4.7,
    price: 150000,
    distance: 3.5,
    category: 'Pendidikan'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Handyman Services',
    providerName: 'FixIt Pro',
    rating: 4.9,
    price: 200000,
    distance: 1.8,
    category: 'Perbaikan'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1508004526072-3be43a5005f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Event Photography',
    providerName: 'Capture Moments',
    rating: 4.6,
    price: 500000,
    distance: 4.2,
    category: 'Acara'
  },
];

export const popularServices: Service[] = [
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Hair Styling',
    providerName: 'Glamour Studio',
    rating: 4.5,
    price: 175000,
    distance: 5.1,
    category: 'Kecantikan'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Plumbing Repair',
    providerName: 'Quick Fix Plumbers',
    rating: 4.7,
    price: 220000,
    distance: 3.2,
    category: 'Perbaikan'
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Personal Fitness',
    providerName: 'Active Life',
    rating: 4.9,
    price: 300000,
    distance: 2.7,
    category: 'Kesehatan'
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Web Development',
    providerName: 'Digital Solutions',
    rating: 4.8,
    price: 450000,
    distance: 3.9,
    category: 'Kreatif'
  },
];

export const serviceDetail = {
  id: '1',
  images: [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1596263373793-6de7057201a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ],
  title: 'Deep House Cleaning',
  providerName: 'CleanHome Services',
  providerImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  rating: 4.8,
  reviewCount: 124,
  price: 250000,
  description: `Our deep cleaning service includes a thorough cleaning of your entire home, focusing on areas that are often missed in regular cleaning routines. 

We clean all surfaces, dust hard-to-reach areas, vacuum and mop all floors, clean and disinfect bathrooms and kitchen, and ensure your home is spotless.

This service is perfect for:
- Before or after moving
- Spring cleaning
- Special occasions or events
- Regular maintenance (recommended every 3 months)

Our team uses eco-friendly cleaning products unless otherwise requested.`,
  location: 'Jakarta Selatan',
  serviceArea: '10km radius from provider location',
  reviews: [
    {
      name: 'Julia Chen',
      date: '15 Mar 2025',
      rating: 5,
      content: 'Fantastic service! My apartment has never been cleaner. The team was professional, thorough, and completed everything in 3 hours. Highly recommend!'
    },
    {
      name: 'Michael Brown',
      date: '27 Feb 2025',
      rating: 4,
      content: 'Good cleaning service. They did miss a few spots behind the refrigerator, but otherwise the house looks great. Would use again.'
    },
    {
      name: 'Sarah Johnson',
      date: '12 Feb 2025',
      rating: 5,
      content: 'Absolutely amazing! Worth every penny. They cleaned areas I didn\'t even know needed cleaning. My bathroom is sparkling!'
    },
  ]
};

export const walletData = {
  balance: 150000,
  transactions: [
    {
      id: 't1',
      type: 'topup' as const,
      amount: 100000,
      date: '10 Apr 2025',
      description: 'Wallet Top-up'
    },
    {
      id: 't2',
      type: 'commission' as const,
      amount: 12500,
      date: '08 Apr 2025',
      description: 'Commission for Deep House Cleaning'
    },
    {
      id: 't3',
      type: 'topup' as const,
      amount: 200000,
      date: '28 Mar 2025',
      description: 'Wallet Top-up'
    },
    {
      id: 't4',
      type: 'commission' as const,
      amount: 25000,
      date: '25 Mar 2025',
      description: 'Commission for Handyman Service'
    },
    {
      id: 't5',
      type: 'payout' as const,
      amount: 112500,
      date: '20 Mar 2025',
      description: 'Wallet Withdrawal'
    },
  ]
};

export const bookingData = {
  id: 'b1',
  serviceId: '1',
  serviceName: 'Deep House Cleaning',
  providerName: 'CleanHome Services',
  consumerName: 'David Wilson',
  date: '20 Apr 2025',
  time: '10:00 AM',
  price: 250000,
  commission: 12500, // 5% of price
};

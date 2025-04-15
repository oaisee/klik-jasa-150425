
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  price: number;
  providerImage?: string;
  location?: string;
  rating?: number;
}

export const useBookings = () => {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        setLoading(false);
        return;
      }
      
      // In a real app, we would fetch bookings from the database
      // For now, simulate with mock data
      setTimeout(() => {
        const mockActiveBookings = [
          {
            id: '1',
            service: 'Jasa Pembersihan Rumah',
            provider: 'Budi Santoso',
            date: '25 April 2023',
            time: '09:00 - 12:00',
            status: 'active',
            price: 150000,
            providerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            location: 'Jakarta Selatan'
          },
          {
            id: '2',
            service: 'Perbaikan AC',
            provider: 'Ahmad Rizki',
            date: '30 April 2023',
            time: '13:00 - 15:00',
            status: 'active',
            price: 250000,
            providerImage: 'https://randomuser.me/api/portraits/men/55.jpg',
            location: 'Jakarta Pusat'
          }
        ];
        
        const mockCompletedBookings = [
          {
            id: '3',
            service: 'Jasa Kurir Dokumen',
            provider: 'Dian Purnama',
            date: '15 April 2023',
            time: '10:00 - 11:00',
            status: 'completed',
            price: 75000,
            rating: 5,
            providerImage: 'https://randomuser.me/api/portraits/women/22.jpg',
            location: 'Jakarta Barat'
          }
        ];
        
        const mockCancelledBookings = [
          {
            id: '4',
            service: 'Jasa Tukang Ledeng',
            provider: 'Joko Santoso',
            date: '10 April 2023',
            time: '14:00 - 16:00',
            status: 'cancelled',
            price: 200000,
            providerImage: 'https://randomuser.me/api/portraits/men/42.jpg',
            location: 'Jakarta Timur'
          }
        ];
        
        setActiveBookings(mockActiveBookings);
        setCompletedBookings(mockCompletedBookings);
        setCancelledBookings(mockCancelledBookings);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return {
    activeBookings,
    completedBookings,
    cancelledBookings,
    loading,
    fetchUserBookings
  };
};

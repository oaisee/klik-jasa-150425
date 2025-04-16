
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types/booking';
import { toast } from 'sonner';

export const useBookings = () => {
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated user');
      }
      
      // For now, let's generate mock data since we don't have a bookings table yet
      // In a real implementation, we would fetch from the database
      
      // Generate random mock bookings
      const generateMockBookings = (count: number, status: string): Booking[] => {
        return Array.from({ length: count }, (_, i) => ({
          id: `booking-${status}-${i}`,
          user_id: session.user.id,
          service_id: `service-${i}`,
          provider_id: `provider-${i}`,
          status: status as any,
          booking_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          service_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Jakarta Selatan',
          price: Math.floor(Math.random() * 500000) + 100000,
          commission_amount: Math.floor(Math.random() * 50000),
          created_at: new Date().toISOString(),
          service: {
            title: ['Perbaikan AC', 'Servis Elektronik', 'Tukang Ledeng', 'Cleaning Service'][Math.floor(Math.random() * 4)],
            category: ['Rumah Tangga', 'Elektronik', 'Perbaikan', 'Jasa'][Math.floor(Math.random() * 4)],
            image: '/placeholder.svg'
          },
          provider: {
            full_name: ['Budi Santoso', 'Joko Widodo', 'Siti Nurhaliza', 'Dian Sastro'][Math.floor(Math.random() * 4)],
            phone: '08123456789',
            avatar_url: '/placeholder.svg'
          }
        }));
      };
      
      // Generate random number of bookings for each status
      const active = generateMockBookings(Math.floor(Math.random() * 5) + 1, 'confirmed');
      const completed = generateMockBookings(Math.floor(Math.random() * 10) + 3, 'completed');
      const cancelled = generateMockBookings(Math.floor(Math.random() * 3), 'cancelled');
      
      setActiveBookings(active);
      setCompletedBookings(completed);
      setCancelledBookings(cancelled);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Gagal memuat data pesanan');
    } finally {
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

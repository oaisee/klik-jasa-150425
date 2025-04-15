import { useState, useEffect } from 'react';
import TabsContainer, { TabItem } from '../shared/TabsContainer';
import BookingsList from './BookingsList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OrdersTab = () => {
  const [activeOrderTab, setActiveOrderTab] = useState('active');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // In a real implementation, you would fetch the user's bookings from the database
          // For now, we'll just use mock data
          
          // This is a placeholder for future implementation
          // const { data, error } = await supabase
          //   .from('bookings')
          //   .select('*, services(*)')
          //   .eq('user_id', session.user.id);
          
          // if (error) throw error;
          
          // setBookings(data || []);
          
          // Mock data for demonstration
          setBookings([
            {
              id: "1",
              status: "active",
              service: "Bersih Rumah Harian",
              provider: "Budi Santoso",
              date: "15 Apr 2025",
              time: "09:00 - 12:00",
              location: "Jl. Kebon Jeruk, Jakarta Barat",
              price: 200000
            },
            {
              id: "2",
              status: "completed",
              service: "Cat Dinding Interior",
              provider: "Joko Widodo",
              date: "10 Apr 2025",
              time: "13:00 - 17:00",
              location: "Jl. Sudirman, Jakarta Pusat",
              price: 350000
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const tabs: TabItem[] = [
    { 
      id: 'active',
      label: 'Aktif',
      content: <BookingsList bookings={bookings} loading={loading} status="active" />
    },
    { 
      id: 'pending',
      label: 'Tertunda',
      content: <BookingsList bookings={bookings} loading={loading} status="pending" />
    },
    { 
      id: 'completed',
      label: 'Selesai',
      content: <BookingsList bookings={bookings} loading={loading} status="completed" />
    }
  ];

  return (
    <TabsContainer 
      tabs={tabs} 
      value={activeOrderTab} 
      onValueChange={setActiveOrderTab} 
    />
  );
};

export default OrdersTab;


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsList from './BookingsList';
import EmptyState from '@/components/shared/EmptyState';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { Calendar, CalendarCheck, CalendarX } from 'lucide-react';

const OrdersTab = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  
  useEffect(() => {
    fetchUserBookings();
  }, []);
  
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
      
      // Mock data
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
  
  const renderEmptyState = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <EmptyState
            icon={Calendar}
            title="Belum ada pesanan aktif"
            description="Pesanan yang sedang berlangsung akan muncul di sini"
          />
        );
      case 'completed':
        return (
          <EmptyState
            icon={CalendarCheck}
            title="Belum ada pesanan selesai"
            description="Pesanan yang telah selesai akan muncul di sini"
          />
        );
      case 'cancelled':
        return (
          <EmptyState
            icon={CalendarX}
            title="Belum ada pesanan dibatalkan"
            description="Pesanan yang dibatalkan akan muncul di sini"
          />
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  return (
    <div className="my-4">
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Aktif
            {activeBookings.length > 0 && (
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {activeBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai
            {completedBookings.length > 0 && (
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {completedBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Dibatalkan
            {cancelledBookings.length > 0 && (
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {cancelledBookings.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeBookings.length > 0 ? (
            <BookingsList bookings={activeBookings} onRefresh={fetchUserBookings} />
          ) : (
            renderEmptyState('active')
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedBookings.length > 0 ? (
            <BookingsList bookings={completedBookings} onRefresh={fetchUserBookings} />
          ) : (
            renderEmptyState('completed')
          )}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {cancelledBookings.length > 0 ? (
            <BookingsList bookings={cancelledBookings} onRefresh={fetchUserBookings} />
          ) : (
            renderEmptyState('cancelled')
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersTab;

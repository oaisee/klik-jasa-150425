
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tab } from '@headlessui/react';
import BookingsList from './BookingsList';
import EmptyState from '@/components/shared/EmptyState';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { Calendar, CalendarCheck, CalendarX } from 'lucide-react';

const OrdersTab = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
            providerImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          {
            id: '2',
            service: 'Perbaikan AC',
            provider: 'Ahmad Rizki',
            date: '30 April 2023',
            time: '13:00 - 15:00',
            status: 'active',
            price: 250000,
            providerImage: 'https://randomuser.me/api/portraits/men/55.jpg'
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
            providerImage: 'https://randomuser.me/api/portraits/women/22.jpg'
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
            providerImage: 'https://randomuser.me/api/portraits/men/42.jpg'
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
  
  const categories = [
    { name: 'Aktif', count: activeBookings.length },
    { name: 'Selesai', count: completedBookings.length },
    { name: 'Dibatalkan', count: cancelledBookings.length }
  ];
  
  return (
    <div className="my-4">
      <Tab.Group>
        <Tab.List className="flex border-b border-gray-200 mb-4">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className={({ selected }) =>
                `py-2 px-4 text-sm font-medium outline-none whitespace-nowrap relative
                ${selected ? 'text-marketplace-primary' : 'text-gray-500'}`
              }
            >
              {({ selected }) => (
                <>
                  <span className="flex items-center">
                    {category.name}
                    {category.count > 0 && (
                      <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        {category.count}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-marketplace-primary" />
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {activeBookings.length > 0 ? (
              <BookingsList bookings={activeBookings} onRefresh={fetchUserBookings} />
            ) : (
              renderEmptyState('active')
            )}
          </Tab.Panel>
          <Tab.Panel>
            {completedBookings.length > 0 ? (
              <BookingsList bookings={completedBookings} onRefresh={fetchUserBookings} />
            ) : (
              renderEmptyState('completed')
            )}
          </Tab.Panel>
          <Tab.Panel>
            {cancelledBookings.length > 0 ? (
              <BookingsList bookings={cancelledBookings} onRefresh={fetchUserBookings} />
            ) : (
              renderEmptyState('cancelled')
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default OrdersTab;

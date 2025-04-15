
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import BookingCard from './BookingCard';
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

  return (
    <Tabs defaultValue="active" className="w-full" value={activeOrderTab} onValueChange={setActiveOrderTab}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="active">Aktif</TabsTrigger>
        <TabsTrigger value="pending">Tertunda</TabsTrigger>
        <TabsTrigger value="completed">Selesai</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
          </div>
        ) : bookings.filter(b => b.status === 'active').length > 0 ? (
          <div className="space-y-4">
            {bookings
              .filter(booking => booking.status === 'active')
              .map(booking => (
                <BookingCard 
                  key={booking.id}
                  service={booking.service}
                  provider={booking.provider}
                  date={booking.date}
                  time={booking.time}
                  location={booking.location}
                  status="active"
                  price={booking.price}
                />
              ))}
              
            <div className="text-center mt-3 text-gray-500 text-sm">
              Menampilkan {bookings.filter(b => b.status === 'active').length} dari {bookings.filter(b => b.status === 'active').length} pesanan aktif
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Calendar size={48} className="mb-2 opacity-50" />
            <p>Tidak ada pesanan aktif</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="pending">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
          </div>
        ) : bookings.filter(b => b.status === 'pending').length > 0 ? (
          <div className="space-y-4">
            {bookings
              .filter(booking => booking.status === 'pending')
              .map(booking => (
                <BookingCard 
                  key={booking.id}
                  service={booking.service}
                  provider={booking.provider}
                  date={booking.date}
                  time={booking.time}
                  location={booking.location}
                  status="pending"
                  price={booking.price}
                />
              ))}
              
            <div className="text-center mt-3 text-gray-500 text-sm">
              Menampilkan {bookings.filter(b => b.status === 'pending').length} dari {bookings.filter(b => b.status === 'pending').length} pesanan tertunda
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Calendar size={48} className="mb-2 opacity-50" />
            <p>Tidak ada pesanan tertunda</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="completed">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
          </div>
        ) : bookings.filter(b => b.status === 'completed').length > 0 ? (
          <div className="space-y-4">
            {bookings
              .filter(booking => booking.status === 'completed')
              .map(booking => (
                <BookingCard 
                  key={booking.id}
                  service={booking.service}
                  provider={booking.provider}
                  date={booking.date}
                  time={booking.time}
                  location={booking.location}
                  status="completed"
                  price={booking.price}
                />
              ))}
              
            <div className="text-center mt-3 text-gray-500 text-sm">
              Menampilkan {bookings.filter(b => b.status === 'completed').length} dari {bookings.filter(b => b.status === 'completed').length} pesanan selesai
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Calendar size={48} className="mb-2 opacity-50" />
            <p>Tidak ada pesanan selesai</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTab;

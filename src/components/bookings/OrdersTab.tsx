
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import BookingCard from './BookingCard';

const OrdersTab = () => {
  const [activeOrderTab, setActiveOrderTab] = useState('active');

  return (
    <Tabs defaultValue="active" className="w-full" value={activeOrderTab} onValueChange={setActiveOrderTab}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="active">Aktif</TabsTrigger>
        <TabsTrigger value="pending">Tertunda</TabsTrigger>
        <TabsTrigger value="completed">Selesai</TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <BookingCard 
          service="Bersih Rumah Harian"
          provider="Budi Santoso"
          date="15 Apr 2025"
          time="09:00 - 12:00"
          location="Jl. Kebon Jeruk, Jakarta Barat"
          status="active"
          price={200000}
        />
        
        <div className="text-center mt-3 text-gray-500 text-sm">
          Menampilkan 1 dari 1 pesanan aktif
        </div>
      </TabsContent>
      
      <TabsContent value="pending">
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <Calendar size={48} className="mb-2 opacity-50" />
          <p>Tidak ada pesanan tertunda</p>
        </div>
      </TabsContent>
      
      <TabsContent value="completed">
        <BookingCard 
          service="Cat Dinding Interior"
          provider="Joko Widodo"
          date="10 Apr 2025"
          time="13:00 - 17:00"
          location="Jl. Sudirman, Jakarta Pusat"
          status="completed"
          price={350000}
        />
        
        <div className="text-center mt-3 text-gray-500 text-sm">
          Menampilkan 1 dari 1 pesanan selesai
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default OrdersTab;

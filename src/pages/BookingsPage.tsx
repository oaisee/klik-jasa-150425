
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const BookingsPage = () => {
  useEffect(() => {
    document.title = 'Pesanan | KlikJasa';
  }, []);
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Pesanan Saya</h1>
      
      <Tabs defaultValue="active" className="w-full">
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
    </div>
  );
};

interface BookingCardProps {
  service: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: 'active' | 'pending' | 'completed';
  price: number;
}

const BookingCard = ({ 
  service, 
  provider, 
  date, 
  time, 
  location, 
  status,
  price
}: BookingCardProps) => {
  const getStatusBadge = () => {
    switch(status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Aktif</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">Tertunda</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Selesai</span>;
    }
  };
  
  return (
    <Card className="mb-3">
      <CardContent className="pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{service}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User size={16} className="mr-2 opacity-70" />
            <span>{provider}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 opacity-70" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className="mr-2 opacity-70" />
            <span>{time}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 opacity-70" />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
          <span className="text-gray-500 text-sm">Total:</span>
          <span className="font-semibold">Rp {price.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsPage;

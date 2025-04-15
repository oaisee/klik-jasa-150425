
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface BookingCardProps {
  service: string;
  provider: string;
  date: string;
  time: string;
  location: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
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
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">Dibatalkan</span>;
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

export default BookingCard;

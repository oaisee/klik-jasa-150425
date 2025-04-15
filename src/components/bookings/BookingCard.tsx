
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
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium border border-green-100 shadow-sm">Aktif</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium border border-yellow-100 shadow-sm">Tertunda</span>;
      case 'completed':
        return <span className="px-2.5 py-1 bg-blue-50 text-marketplace-primary rounded-full text-xs font-medium border border-blue-100 shadow-sm">Selesai</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100 shadow-sm">Dibatalkan</span>;
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">{service}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="bg-gray-50 p-1.5 rounded-full mr-3">
              <User size={16} className="opacity-70" />
            </div>
            <span>{provider}</span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-50 p-1.5 rounded-full mr-3">
              <Calendar size={16} className="opacity-70" />
            </div>
            <span>{date}</span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-50 p-1.5 rounded-full mr-3">
              <Clock size={16} className="opacity-70" />
            </div>
            <span>{time}</span>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-50 p-1.5 rounded-full mr-3">
              <MapPin size={16} className="opacity-70" />
            </div>
            <span>{location}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-gray-500 text-sm">Total:</span>
          <span className="font-semibold text-marketplace-primary">Rp {price.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

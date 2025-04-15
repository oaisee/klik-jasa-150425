
import React from 'react';
import BookingCard from './BookingCard';
import EmptyState from '../shared/EmptyState';
import LoadingIndicator from '../shared/LoadingIndicator';
import { Calendar } from 'lucide-react';

interface Booking {
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

interface BookingsListProps {
  bookings: Booking[];
  loading?: boolean;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
  onRefresh?: () => void;
}

const BookingsList = ({ bookings, loading = false, status, onRefresh }: BookingsListProps) => {
  const filteredBookings = status 
    ? bookings.filter(booking => booking.status === status)
    : bookings;
  
  const statusText: Record<string, string> = {
    'active': 'aktif',
    'pending': 'tertunda',
    'completed': 'selesai',
    'cancelled': 'dibatalkan'
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (filteredBookings.length === 0) {
    return (
      <EmptyState 
        icon={Calendar}
        title={`Tidak ada pesanan ${status ? statusText[status] : ''}`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredBookings.map(booking => (
        <BookingCard 
          key={booking.id}
          service={booking.service}
          provider={booking.provider}
          date={booking.date}
          time={booking.time}
          location={booking.location || 'Jakarta'}
          status={booking.status === 'cancelled' ? 'pending' : booking.status}
          price={booking.price}
        />
      ))}
      
      <div className="text-center mt-3 text-gray-500 text-sm">
        Menampilkan {filteredBookings.length} dari {filteredBookings.length} pesanan {status ? statusText[status] : ''}
      </div>
    </div>
  );
};

export default BookingsList;

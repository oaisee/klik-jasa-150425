
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
  location: string;
  status: 'active' | 'pending' | 'completed';
  price: number;
}

interface BookingsListProps {
  bookings: Booking[];
  loading: boolean;
  status: 'active' | 'pending' | 'completed';
}

const BookingsList = ({ bookings, loading, status }: BookingsListProps) => {
  const filteredBookings = bookings.filter(booking => booking.status === status);
  
  const statusText = {
    'active': 'aktif',
    'pending': 'tertunda',
    'completed': 'selesai'
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (filteredBookings.length === 0) {
    return (
      <EmptyState 
        icon={Calendar}
        title={`Tidak ada pesanan ${statusText[status]}`}
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
          location={booking.location}
          status={booking.status}
          price={booking.price}
        />
      ))}
      
      <div className="text-center mt-3 text-gray-500 text-sm">
        Menampilkan {filteredBookings.length} dari {filteredBookings.length} pesanan {statusText[status]}
      </div>
    </div>
  );
};

export default BookingsList;

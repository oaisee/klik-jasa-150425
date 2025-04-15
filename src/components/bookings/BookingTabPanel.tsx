
import React from 'react';
import BookingsList from './BookingsList';
import { TabsContent } from "@/components/ui/tabs";
import EmptyState from '@/components/shared/EmptyState';
import { Calendar, CalendarCheck, CalendarX } from 'lucide-react';

interface BookingTabPanelProps {
  value: string;
  bookings: any[];
  onRefresh: () => void;
}

const BookingTabPanel = ({ value, bookings, onRefresh }: BookingTabPanelProps) => {
  const renderEmptyState = () => {
    switch(value) {
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

  return (
    <TabsContent value={value}>
      {bookings.length > 0 ? (
        <BookingsList 
          bookings={bookings} 
          onRefresh={onRefresh}
          status={value as 'active' | 'pending' | 'completed' | 'cancelled'}
        />
      ) : (
        renderEmptyState()
      )}
    </TabsContent>
  );
};

export default BookingTabPanel;

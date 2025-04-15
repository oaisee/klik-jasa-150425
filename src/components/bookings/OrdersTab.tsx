
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingTabPanel from './BookingTabPanel';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { useBookings } from '@/hooks/useBookings';

const OrdersTab = () => {
  const { activeBookings, completedBookings, cancelledBookings, loading, fetchUserBookings } = useBookings();
  const [activeTab, setActiveTab] = useState("active");
  
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
        
        <BookingTabPanel 
          value="active" 
          bookings={activeBookings} 
          onRefresh={fetchUserBookings} 
        />
        
        <BookingTabPanel 
          value="completed" 
          bookings={completedBookings} 
          onRefresh={fetchUserBookings} 
        />
        
        <BookingTabPanel 
          value="cancelled" 
          bookings={cancelledBookings} 
          onRefresh={fetchUserBookings} 
        />
      </Tabs>
    </div>
  );
};

export default OrdersTab;


import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import OrdersTab from '@/components/bookings/OrdersTab';
import ServicesTab from '@/components/bookings/ServicesTab';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

const BookingsPage = () => {
  const { userData, loading, fetchUserProfile } = useProfile();
  const [pageTitle, setPageTitle] = useState('Pesanan Saya');

  useEffect(() => {
    // Set page title based on user role
    const title = userData.isProvider ? 'Layanan Saya' : 'Pesanan Saya';
    document.title = `${title} | KlikJasa`;
    setPageTitle(title);
  }, [userData.isProvider]);

  // Re-fetch user profile when this page is loaded to ensure we have the latest role
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white px-4 py-3 flex items-center shadow-sm z-10">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
      
      <div className="flex-1 p-4 pb-20">
        {loading ? (
          <LoadingIndicator size="lg" />
        ) : userData.isProvider ? (
          <ServicesTab />
        ) : (
          <OrdersTab />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;

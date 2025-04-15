
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
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">{pageTitle}</h1>
      
      {loading ? (
        <LoadingIndicator size="lg" />
      ) : userData.isProvider ? (
        <ServicesTab />
      ) : (
        <OrdersTab />
      )}
    </div>
  );
};

export default BookingsPage;


import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import OrdersTab from '@/components/bookings/OrdersTab';
import ServicesTab from '@/components/bookings/ServicesTab';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
  const navigate = useNavigate();
  const {
    userData,
    loading,
    fetchUserProfile
  } = useProfile();
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
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Kembali"
          >
            <ChevronLeft size={22} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
            <p className="text-xs text-gray-500">
              {userData.isProvider 
                ? 'Kelola layanan yang Anda tawarkan' 
                : 'Lihat status pesanan layanan Anda'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 pb-20">
        {loading ? 
          <div className="flex justify-center items-center h-64">
            <LoadingIndicator size="lg" text="Memuat data..." />
          </div> 
          : 
          userData.isProvider ? <ServicesTab /> : <OrdersTab />
        }
      </div>
    </div>
  );
};

export default BookingsPage;

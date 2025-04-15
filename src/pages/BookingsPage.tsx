
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Briefcase, AlertCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import OrdersTab from '@/components/bookings/OrdersTab';
import ServicesTab from '@/components/bookings/ServicesTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BookingsPage = () => {
  const { userData, loading, fetchUserProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('orders');
  const [pageTitle, setPageTitle] = useState('Pesanan Saya');

  useEffect(() => {
    // Set page title based on user role
    const title = userData.isProvider ? 'Layanan Saya' : 'Pesanan Saya';
    document.title = `${title} | KlikJasa`;
    setPageTitle(title);
    
    // Set the initial active tab based on user role
    setActiveTab(userData.isProvider ? 'services' : 'orders');
  }, [userData.isProvider]);

  // Re-fetch user profile when this page is loaded to ensure we have the latest role
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">{pageTitle}</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
        </div>
      ) : userData.isProvider ? (
        <ServicesTab />
      ) : (
        <OrdersTab />
      )}
    </div>
  );
};

export default BookingsPage;

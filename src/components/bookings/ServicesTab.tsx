
import { useState, useEffect } from 'react';
import TabsContainer, { TabItem } from '../shared/TabsContainer';
import BookingServicesList from './BookingServicesList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ServicesTab = () => {
  const navigate = useNavigate();
  const [activeServiceTab, setActiveServiceTab] = useState('active');
  const [userId, setUserId] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
          
          // Fetch services provided by this user
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', session.user.id);
            
          if (error) {
            console.error('Error fetching services:', error);
            toast.error('Gagal memuat layanan');
            throw error;
          }
          
          console.log('Fetched services:', data);
          
          // Add placeholder values for views and ordersCount
          const servicesWithStats = data?.map(service => ({
            ...service,
            views: Math.floor(Math.random() * 100),
            ordersCount: Math.floor(Math.random() * 10)
          })) || [];
          
          setServices(servicesWithStats);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Function to toggle service status (active/inactive)
  const toggleServiceStatus = async (serviceId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', serviceId);
        
      if (error) throw error;
      
      // Update local state
      setServices(services.map(service => 
        service.id === serviceId ? {...service, status: newStatus} : service
      ));
      
      toast.success(`Status layanan berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'nonaktif'}`);
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Gagal mengubah status layanan');
    }
  };
  
  const tabs: TabItem[] = [
    { 
      id: 'active',
      label: 'Aktif',
      content: <BookingServicesList services={services} loading={loading} status="active" onStatusToggle={toggleServiceStatus} />
    },
    { 
      id: 'inactive',
      label: 'Nonaktif',
      content: <BookingServicesList services={services} loading={loading} status="inactive" onStatusToggle={toggleServiceStatus} />
    },
    { 
      id: 'drafts',
      label: 'Draft',
      content: <BookingServicesList services={services} loading={loading} status="draft" onStatusToggle={toggleServiceStatus} />
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Layanan Saya</h2>
        <Button 
          onClick={() => navigate('/create-service')}
          className="flex items-center"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Tambah Layanan
        </Button>
      </div>
      
      <TabsContainer 
        tabs={tabs} 
        value={activeServiceTab} 
        onValueChange={setActiveServiceTab} 
      />
    </div>
  );
};

export default ServicesTab;

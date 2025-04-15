
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { useProviderServices } from '@/hooks/providerMode/useProviderServices';
import { supabase } from '@/integrations/supabase/client';

const ServicesTab = () => {
  const navigate = useNavigate();
  const [activeServiceTab, setActiveServiceTab] = useState('active');
  const [userId, setUserId] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
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
            
          if (error) throw error;
          
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

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
      
      <Tabs defaultValue="active" className="w-full" value={activeServiceTab} onValueChange={setActiveServiceTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="inactive">Nonaktif</TabsTrigger>
          <TabsTrigger value="drafts">Draft</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
            </div>
          ) : services.filter(s => s.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {services
                .filter(service => service.status === 'active')
                .map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    price={service.price}
                    status={service.status}
                    views={Math.floor(Math.random() * 100)}
                    ordersCount={Math.floor(Math.random() * 10)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <Wrench size={40} className="mx-auto text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">Belum Ada Layanan Aktif</h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">Anda belum memiliki layanan yang aktif</p>
              <Button 
                onClick={() => navigate('/create-service')}
                size="sm"
                className="mx-auto"
              >
                <Plus className="w-4 h-4 mr-1" /> Tambah Layanan
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
            </div>
          ) : services.filter(s => s.status === 'inactive').length > 0 ? (
            <div className="space-y-4">
              {services
                .filter(service => service.status === 'inactive')
                .map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    price={service.price}
                    status={service.status}
                    views={Math.floor(Math.random() * 50)}
                    ordersCount={Math.floor(Math.random() * 5)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <AlertCircle size={40} className="mb-2 opacity-50" />
              <p>Tidak ada layanan nonaktif</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drafts">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
            </div>
          ) : services.filter(s => s.status === 'draft').length > 0 ? (
            <div className="space-y-4">
              {services
                .filter(service => service.status === 'draft')
                .map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    price={service.price}
                    status={service.status}
                    views={0}
                    ordersCount={0}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <AlertCircle size={40} className="mb-2 opacity-50" />
              <p>Tidak ada draft layanan</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesTab;

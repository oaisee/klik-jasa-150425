
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const ProviderModePage = () => {
  const navigate = useNavigate();
  const [hasServices, setHasServices] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Mode Penyedia | KlikJasa';
    
    const checkUserServices = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        // Check if user has any services
        const { data: services, error } = await supabase
          .from('services')
          .select('id')
          .eq('provider_id', session.user.id)
          .limit(1);
          
        if (error) throw error;
        
        setHasServices(services && services.length > 0);
      } catch (error) {
        console.error('Error checking services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserServices();
  }, [navigate]);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Mode Penyedia Jasa</h1>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-6 mb-6">
        <h2 className="font-semibold text-lg mb-2">Jadilah Penyedia Jasa di KlikJasa</h2>
        <p className="text-gray-500 mb-4">Tawarkan jasa Anda dan dapatkan pelanggan dari KlikJasa</p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-800">
          Sebagai penyedia jasa, Anda akan dikenakan komisi 5% dari nilai jasa untuk setiap pesanan yang berhasil.
        </AlertDescription>
      </Alert>

      <Card className="mb-4">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-marketplace-primary"></div>
            </div>
          ) : hasServices ? (
            <div className="text-center mb-4">
              <p className="text-green-600 font-medium mb-2">Anda telah memiliki jasa yang ditawarkan</p>
              <Button 
                className="w-full flex items-center justify-center"
                onClick={() => navigate('/create-service')}
              >
                <Plus size={18} className="mr-2" />
                Tambah Jasa Lainnya
              </Button>
            </div>
          ) : (
            <div className="text-center mb-4">
              <p className="text-gray-500 mb-4">Anda belum memiliki jasa yang ditawarkan</p>
              <Button 
                className="w-full flex items-center justify-center"
                onClick={() => navigate('/create-service')}
              >
                <Plus size={18} className="mr-2" />
                Tambah Jasa Baru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Keuntungan Menjadi Penyedia Jasa</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Dapatkan pelanggan dari KlikJasa</li>
            <li>• Kelola jadwal Anda dengan fleksibel</li>
            <li>• Terima pembayaran secara langsung</li>
            <li>• Bangun profil dan ulasan Anda</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderModePage;

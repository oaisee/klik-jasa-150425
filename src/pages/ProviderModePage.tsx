
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Info, AlertCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const ProviderModePage = () => {
  const navigate = useNavigate();
  const [hasServices, setHasServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [profileData, setProfileData] = useState<{
    full_name: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    wallet_balance: number | null;
  }>({
    full_name: null,
    phone: null,
    address: null,
    bio: null,
    wallet_balance: null
  });

  useEffect(() => {
    document.title = 'Mode Penyedia | KlikJasa';
    checkUserProfile();
  }, [navigate]);
  
  const checkUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Get profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address, bio, wallet_balance, is_provider')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Check if user is a provider
      if (!profile.is_provider) {
        navigate('/profile');
        return;
      }
      
      // Check if profile is complete enough to be a provider
      const isComplete = !!(
        profile.full_name &&
        profile.phone &&
        profile.address &&
        profile.bio
      );
      
      setProfileComplete(isComplete);
      setProfileData(profile);
      
      // Check if user has any services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('provider_id', session.user.id)
        .limit(1);
        
      if (servicesError) throw servicesError;
      
      setHasServices(services && services.length > 0);
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (!profileData.full_name) missing.push('Nama Lengkap');
    if (!profileData.phone) missing.push('Nomor Telepon');
    if (!profileData.address) missing.push('Alamat');
    if (!profileData.bio) missing.push('Bio');
    return missing;
  };

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

      {!profileComplete && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-800">
            <p className="font-medium mb-1">Anda perlu melengkapi profil untuk menjadi penyedia jasa</p>
            <p className="text-sm">Data yang perlu dilengkapi: {getMissingFields().join(', ')}</p>
            <Button 
              className="mt-2 bg-amber-500 hover:bg-amber-600"
              onClick={() => navigate('/edit-profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Lengkapi Profil
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
          ) : !profileComplete ? (
            <div className="text-center mb-4">
              <p className="text-amber-600 font-medium mb-2">Lengkapi profil Anda untuk dapat menambahkan jasa</p>
              <Button 
                className="w-full flex items-center justify-center"
                onClick={() => navigate('/edit-profile')}
              >
                <User size={18} className="mr-2" />
                Lengkapi Profil
              </Button>
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
                disabled={!profileComplete}
              >
                <Plus size={18} className="mr-2" />
                Tambah Jasa Baru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {(profileData.wallet_balance === 0 || profileData.wallet_balance === null) && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-amber-700">Perhatian</h3>
            <p className="text-sm text-amber-600 mb-3">
              Saldo wallet Anda kosong. Anda perlu mengisi saldo untuk dapat menerima pesanan, karena komisi 5% akan dipotong dari wallet Anda.
            </p>
            <Button 
              className="w-full"
              onClick={() => navigate('/wallet')}
            >
              Isi Saldo Wallet
            </Button>
          </CardContent>
        </Card>
      )}

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

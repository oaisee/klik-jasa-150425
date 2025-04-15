
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProviderMode } from '@/hooks/useProviderMode';
import ProfileAlert from '@/components/provider/ProfileAlert';
import InfoAlert from '@/components/provider/InfoAlert';
import ServiceCard from '@/components/provider/ServiceCard';
import WalletAlert from '@/components/provider/WalletAlert';
import BenefitsCard from '@/components/provider/BenefitsCard';

const ProviderModePage = () => {
  const navigate = useNavigate();
  const { hasServices, loading, profileComplete, profileData, getMissingFields } = useProviderMode();

  useEffect(() => {
    document.title = 'Mode Penyedia | KlikJasa';
  }, []);

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

      <ProfileAlert 
        profileComplete={profileComplete} 
        missingFields={getMissingFields()} 
      />

      <InfoAlert />

      <ServiceCard 
        loading={loading} 
        profileComplete={profileComplete} 
        hasServices={hasServices} 
      />

      <WalletAlert walletBalance={profileData.wallet_balance} />

      <BenefitsCard />
    </div>
  );
};

export default ProviderModePage;

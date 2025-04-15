
import { useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProviderModePage = () => {
  const navigate = useNavigate();

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

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <p className="text-gray-500">Anda belum memiliki jasa yang ditawarkan</p>
          </div>
          <Button 
            className="w-full flex items-center justify-center"
            onClick={() => navigate('/create-service')}
          >
            <Plus size={18} className="mr-2" />
            Tambah Jasa Baru
          </Button>
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

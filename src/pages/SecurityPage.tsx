
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SecurityPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Keamanan | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Keamanan</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Ubah Kata Sandi</h2>
          <p className="text-sm text-gray-500 mb-4">Ubah kata sandi akun KlikJasa Anda untuk menjaga keamanan.</p>
          <Button variant="outline" className="w-full">Ubah Kata Sandi</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Verifikasi Dua Faktor</h2>
          <p className="text-sm text-gray-500 mb-4">Tambahkan lapisan keamanan ekstra dengan verifikasi dua faktor.</p>
          <Button variant="outline" className="w-full">Aktifkan 2FA</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;

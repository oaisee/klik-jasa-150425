
import { useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Metode Pembayaran | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Metode Pembayaran</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center py-8">
          <p className="text-gray-500 mb-4">Belum ada metode pembayaran yang tersimpan</p>
          <Button className="flex items-center">
            <Plus size={18} className="mr-2" />
            Tambah Metode Pembayaran
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsPage;

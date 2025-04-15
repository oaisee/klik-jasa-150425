
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    document.title = 'Metode Pembayaran | KlikJasa';
  }, []);

  const handleAddPayment = () => {
    toast.info("Fitur dalam pengembangan", {
      description: "Pembayaran saat ini hanya dengan uang tunai saat layanan selesai"
    });
    // In a real implementation, this would open a payment method form or redirect to a payment provider
  };

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Metode Pembayaran</h1>
      </div>

      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-800">
          KlikJasa menggunakan pembayaran tunai saat layanan selesai. Opsi pembayaran online sedang dalam pengembangan.
        </AlertDescription>
      </Alert>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-marketplace-primary" />
              <h3 className="font-semibold">Metode Aktif</h3>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center">
            <p className="text-gray-500">Pembayaran Tunai</p>
            <p className="text-sm text-gray-400 mt-1">Metode default untuk semua layanan</p>
          </div>
          
          <Button 
            className="w-full flex items-center justify-center" 
            variant="outline"
            onClick={handleAddPayment}
          >
            <Plus size={18} className="mr-2" />
            Tambah Metode Pembayaran
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsPage;

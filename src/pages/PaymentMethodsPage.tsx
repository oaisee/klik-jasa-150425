
import { useEffect } from 'react';
import { ArrowLeft, CreditCard, AlertCircle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Metode Pembayaran | KlikJasa';
  }, []);

  const handleAddPayment = () => {
    toast.info("Fitur dalam pengembangan", {
      description: "Pembayaran saat ini hanya dengan uang tunai saat layanan selesai"
    });
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
          KlikJasa menggunakan pembayaran tunai saat layanan selesai. Top-up saldo wallet dilakukan menggunakan Midtrans.
        </AlertDescription>
      </Alert>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-marketplace-primary" />
              <h3 className="font-semibold">Metode Pembayaran Layanan</h3>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              <div>
                <p className="font-medium">Pembayaran Tunai</p>
                <p className="text-sm text-gray-500 mt-1">Pembayaran dilakukan langsung kepada penyedia jasa setelah layanan selesai</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-marketplace-primary" />
              <h3 className="font-semibold">Metode Top-Up Wallet</h3>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 bg-white rounded-full p-1 shadow-sm">
                <img 
                  src="https://midtrans.com/assets/img/midtrans-logo.png" 
                  alt="Midtrans" 
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }} 
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">Midtrans Payment Gateway</p>
                <p className="text-sm text-gray-500 mt-1">Berbagai metode pembayaran termasuk transfer bank, e-wallet, dan kartu kredit</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => navigate('/wallet')}
          >
            Buka Wallet
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Catatan:</span> Komisi 5% dari nilai jasa akan diambil dari wallet penyedia jasa ketika booking dikonfirmasi. Pastikan saldo wallet Anda mencukupi.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;

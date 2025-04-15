
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WalletAlertProps {
  walletBalance: number | null;
}

const WalletAlert = ({ walletBalance }: WalletAlertProps) => {
  const navigate = useNavigate();
  
  if (walletBalance !== 0 && walletBalance !== null) {
    return null;
  }
  
  return (
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
  );
};

export default WalletAlert;

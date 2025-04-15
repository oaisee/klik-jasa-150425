
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const InfoAlert = () => {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <Info className="h-5 w-5 text-blue-500" />
      <AlertDescription className="text-blue-800">
        Sebagai penyedia jasa, Anda akan dikenakan komisi 5% dari nilai jasa untuk setiap pesanan yang berhasil.
      </AlertDescription>
    </Alert>
  );
};

export default InfoAlert;

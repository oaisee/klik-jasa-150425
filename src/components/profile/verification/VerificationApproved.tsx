
import { CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VerificationApproved = () => {
  return (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <AlertDescription className="text-green-800">
        <p className="font-medium mb-1">Verifikasi KTP Berhasil</p>
        <p className="text-sm">Anda telah terverifikasi sebagai penyedia jasa dan dapat menawarkan layanan Anda di KlikJasa.</p>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationApproved;

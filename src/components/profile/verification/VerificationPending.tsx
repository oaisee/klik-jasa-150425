
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VerificationPending = () => {
  return (
    <Alert className="bg-yellow-50 border-yellow-200">
      <AlertCircle className="h-5 w-5 text-yellow-500" />
      <AlertDescription className="text-yellow-800">
        <p className="font-medium mb-1">Verifikasi KTP Sedang Diproses</p>
        <p className="text-sm">Tim kami sedang memverifikasi dokumen KTP Anda. Proses ini biasanya membutuhkan waktu 1x24 jam kerja.</p>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationPending;

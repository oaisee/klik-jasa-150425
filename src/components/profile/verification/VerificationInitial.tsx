
import { Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VerificationInitialProps {
  onStartVerification: () => void;
  onCancel: () => void;
}

const VerificationInitial = ({ onStartVerification, onCancel }: VerificationInitialProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-5 w-5 text-blue-500" />
      <AlertDescription className="text-blue-800">
        <p className="font-medium mb-1">Verifikasi KTP Diperlukan</p>
        <p className="text-sm mb-2">Untuk menjadi penyedia jasa, Anda perlu memverifikasi identitas dengan mengunggah KTP. Ini untuk memastikan keamanan semua pengguna KlikJasa.</p>
        <div className="flex space-x-2 mt-2">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onStartVerification}
          >
            Verifikasi KTP
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationInitial;

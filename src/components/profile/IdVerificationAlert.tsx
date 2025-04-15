
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface IdVerificationAlertProps {
  onVerify: () => void;
  onCancel: () => void;
}

const IdVerificationAlert = ({ onVerify, onCancel }: IdVerificationAlertProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-5 w-5 text-blue-500" />
      <AlertDescription className="text-blue-800">
        <p className="font-medium mb-1">Verifikasi KTP Diperlukan</p>
        <p className="text-sm mb-2">Untuk menjadi penyedia jasa, Anda perlu memverifikasi identitas dengan mengunggah KTP. Ini untuk memastikan keamanan semua pengguna KlikJasa.</p>
        <div className="flex space-x-2 mt-2">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onVerify}
          >
            Verifikasi KTP
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-1" /> Batal
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default IdVerificationAlert;

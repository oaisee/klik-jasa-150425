
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import RejectionNotes from '@/components/admin/verification/components/RejectionNotes';

interface VerificationRejectedProps {
  notes: string | null;
  onRetry: () => void;
}

const VerificationRejected = ({ notes, onRetry }: VerificationRejectedProps) => {
  return (
    <Alert className="bg-red-50 border-red-200">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <AlertDescription className="text-red-800">
        <p className="font-medium mb-1">Verifikasi KTP Ditolak</p>
        <p className="text-sm mb-1">Mohon maaf, verifikasi KTP Anda ditolak.</p>
        
        {notes && <RejectionNotes notes={notes} />}
        
        <p className="text-sm mb-2">Silakan unggah ulang KTP Anda dengan memastikan kualitas gambar yang lebih baik.</p>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onRetry}
        >
          Unggah Ulang KTP
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default VerificationRejected;

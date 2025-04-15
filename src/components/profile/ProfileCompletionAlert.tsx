
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProfileCompletionAlertProps {
  onCompleteProfile: () => void;
  onCancel: () => void;
}

const ProfileCompletionAlert = ({ onCompleteProfile, onCancel }: ProfileCompletionAlertProps) => {
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-5 w-5 text-amber-500" />
      <AlertDescription className="text-amber-800">
        Anda perlu melengkapi profil untuk menjadi penyedia jasa. Silakan lengkapi data diri Anda terlebih dahulu.
      </AlertDescription>
      <div className="flex space-x-2 mt-2">
        <Button 
          variant="outline" 
          className="border-amber-200 text-amber-800 hover:bg-amber-100"
          onClick={onCompleteProfile}
        >
          Lengkapi Profil
        </Button>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:bg-gray-100"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-1" /> Batal
        </Button>
      </div>
    </Alert>
  );
};

export default ProfileCompletionAlert;


import { AlertCircle, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileAlertProps {
  profileComplete: boolean;
  missingFields: string[];
}

const ProfileAlert = ({ profileComplete, missingFields }: ProfileAlertProps) => {
  const navigate = useNavigate();
  
  if (profileComplete) {
    return null;
  }
  
  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertCircle className="h-5 w-5 text-amber-500" />
      <AlertDescription className="text-amber-800">
        <p className="font-medium mb-1">Anda perlu melengkapi profil untuk menjadi penyedia jasa</p>
        <p className="text-sm">Data yang perlu dilengkapi: {missingFields.join(', ')}</p>
        <Button 
          className="mt-2 bg-amber-500 hover:bg-amber-600"
          onClick={() => navigate('/edit-profile')}
        >
          <User className="w-4 h-4 mr-2" />
          Lengkapi Profil
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileAlert;

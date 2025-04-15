
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Briefcase, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface UserRoleToggleProps {
  isProvider: boolean;
  userId: string;
  onRoleChange?: (isProvider: boolean) => void;
}

const UserRoleToggle = ({ isProvider, userId, onRoleChange }: UserRoleToggleProps) => {
  const [loading, setLoading] = useState(false);
  const [isProviderState, setIsProviderState] = useState(isProvider);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [showIdVerificationAlert, setShowIdVerificationAlert] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isProvider !== isProviderState) {
      setIsProviderState(isProvider);
    }
  }, [isProvider]);

  // Check if profile is complete enough to be a provider
  const checkProfileCompleteness = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address, bio, avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Check if essential fields are filled
      const isComplete = !!(
        data.full_name &&
        data.phone &&
        data.address &&
        data.bio
      );

      setProfileComplete(isComplete);
      return isComplete;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  const handleToggleChange = async (checked: boolean) => {
    setLoading(true);
    
    try {
      // If switching to provider mode, check profile completeness
      if (checked) {
        const isComplete = await checkProfileCompleteness();
        
        if (!isComplete) {
          setShowProfileAlert(true);
          setLoading(false);
          return; // Don't proceed with mode change
        }
        
        // Show ID verification alert after profile check
        setShowIdVerificationAlert(true);
        setLoading(false);
        return; // Don't proceed until ID verification
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_provider: checked })
        .eq('id', userId);

      if (error) throw error;

      setIsProviderState(checked);
      if (onRoleChange) {
        onRoleChange(checked);
      }

      toast.success(
        checked 
          ? "Anda sekarang adalah penyedia jasa" 
          : "Anda sekarang adalah pengguna jasa"
      );

      // If switching to provider, navigate to provider mode page
      if (checked) {
        setTimeout(() => {
          navigate('/provider-mode');
        }, 1000); // Short delay to show the toast before navigating
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Gagal mengubah peran pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = () => {
    setShowProfileAlert(false);
    navigate('/edit-profile');
  };
  
  const handleCancelProviderMode = () => {
    setShowProfileAlert(false);
    setShowIdVerificationAlert(false);
  };
  
  const handleVerifyId = () => {
    // Proceed with making the user a provider after verification
    setShowIdVerificationAlert(false);
    setLoading(true);
    
    supabase
      .from('profiles')
      .update({ is_provider: true })
      .eq('id', userId)
      .then(({ error }) => {
        if (error) {
          toast.error("Gagal mengubah peran pengguna");
          console.error('Error updating user role:', error);
          return;
        }
        
        setIsProviderState(true);
        if (onRoleChange) {
          onRoleChange(true);
        }
        
        toast.success("Anda sekarang adalah penyedia jasa");
        
        // Navigate to provider mode page
        setTimeout(() => {
          navigate('/provider-mode');
        }, 1000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col space-y-4">
      {showProfileAlert && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-800">
            Anda perlu melengkapi profil untuk menjadi penyedia jasa. Silakan lengkapi data diri Anda terlebih dahulu.
          </AlertDescription>
          <div className="flex space-x-2 mt-2">
            <Button 
              variant="outline" 
              className="border-amber-200 text-amber-800 hover:bg-amber-100"
              onClick={handleCompleteProfile}
            >
              Lengkapi Profil
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:bg-gray-100"
              onClick={handleCancelProviderMode}
            >
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
          </div>
        </Alert>
      )}
      
      {showIdVerificationAlert && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-800">
            <p className="font-medium mb-1">Verifikasi KTP Diperlukan</p>
            <p className="text-sm mb-2">Untuk menjadi penyedia jasa, Anda perlu memverifikasi identitas dengan mengunggah KTP. Ini untuk memastikan keamanan semua pengguna KlikJasa.</p>
            <div className="flex space-x-2 mt-2">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleVerifyId}
              >
                Verifikasi KTP
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:bg-gray-100"
                onClick={handleCancelProviderMode}
              >
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          {isProviderState ? (
            <div className="p-2 bg-blue-100 rounded-full">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="p-2 bg-green-100 rounded-full">
              <User className="w-5 h-5 text-green-600" />
            </div>
          )}
          <div>
            <h3 className="font-medium">
              {isProviderState ? 'Mode Penyedia Jasa' : 'Mode Pengguna'}
            </h3>
            <p className="text-sm text-gray-500">
              {isProviderState 
                ? 'Anda dapat menawarkan jasa' 
                : 'Anda dapat memesan jasa'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="user-role-toggle" className="sr-only">
            Toggle user role
          </Label>
          <Switch
            id="user-role-toggle"
            checked={isProviderState}
            onCheckedChange={handleToggleChange}
            disabled={loading}
            aria-label="Toggle user role"
          />
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default UserRoleToggle;

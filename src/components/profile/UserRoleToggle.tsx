import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Briefcase, AlertCircle } from 'lucide-react';
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

  return (
    <div className="flex flex-col space-y-4">
      {showProfileAlert && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-800">
            Anda perlu melengkapi profil untuk menjadi penyedia jasa. Silakan lengkapi data diri Anda terlebih dahulu.
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-2 border-amber-200 text-amber-800 hover:bg-amber-100"
            onClick={handleCompleteProfile}
          >
            Lengkapi Profil
          </Button>
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

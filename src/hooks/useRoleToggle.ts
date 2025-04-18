
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkProfileCompleteness } from '@/utils/profileCompleteness';

interface UseRoleToggleProps {
  isProvider: boolean;
  userId: string;
  onRoleChange?: (isProvider: boolean) => void;
}

export const useRoleToggle = ({ isProvider, userId, onRoleChange }: UseRoleToggleProps) => {
  const [loading, setLoading] = useState(false);
  const [isProviderState, setIsProviderState] = useState(isProvider);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [showIdVerificationAlert, setShowIdVerificationAlert] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const navigate = useNavigate();

  const handleToggleChange = async (checked: boolean) => {
    setLoading(true);
    
    try {
      // If switching to provider mode, check profile completeness
      if (checked) {
        const { isComplete } = await checkProfileCompleteness(userId);
        
        if (!isComplete) {
          setShowProfileAlert(true);
          setProfileComplete(false);
          setLoading(false);
          return; // Don't proceed with mode change
        }
        
        // Show ID verification alert after profile check
        setShowIdVerificationAlert(true);
        setLoading(false);
        return; // Don't proceed until ID verification
      }
      
      // Switching to consumer mode - use profiles table only
      const { error } = await supabase
        .from('profiles')
        .update({ is_provider: checked })
        .eq('id', userId);
          
      if (error) {
        toast.error("Gagal mengubah peran pengguna");
        console.error('Error updating user role:', error);
        return;
      }
      
      setIsProviderState(checked);
      if (onRoleChange) {
        onRoleChange(checked);
      }
      
      toast.success(
        checked 
          ? "Anda sekarang adalah penyedia jasa" 
          : "Anda sekarang adalah pengguna jasa"
      );
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
    
    const updateUserRole = async () => {
      try {
        // Update profiles table ONLY
        const { error } = await supabase
          .from('profiles')
          .update({ is_provider: true })
          .eq('id', userId);
          
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
          navigate('/provider');
        }, 1000);
      } catch (err) {
        console.error('Error updating user role:', err);
        toast.error("Gagal mengubah peran pengguna");
      } finally {
        setLoading(false);
      }
    };
    
    updateUserRole();
  };

  return {
    loading,
    isProviderState,
    showProfileAlert,
    showIdVerificationAlert,
    profileComplete,
    handleToggleChange,
    handleCompleteProfile,
    handleCancelProviderMode,
    handleVerifyId
  };
};

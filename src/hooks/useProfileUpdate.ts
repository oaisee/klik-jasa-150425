
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ProfileFormData } from '@/types/profile';

export const useProfileUpdate = () => {
  const [saving, setSaving] = useState(false);

  const updateProfile = async (
    userData: ProfileFormData, 
    avatarUrl: string | null, 
    refreshProfileData: () => Promise<void>
  ) => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sesi tidak ditemukan, silakan login kembali");
        return false;
      }
      
      const userId = session.user.id;
      
      // Update auth metadata (minimal data)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: userData.name
        }
      });
      
      if (authError) throw authError;
      
      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.name,
          phone: userData.phone,
          address: userData.address,
          bio: userData.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      toast.success("Profil berhasil diperbarui");
      
      // Refresh data
      await refreshProfileData();
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Gagal memperbarui profil");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    updateProfile
  };
};

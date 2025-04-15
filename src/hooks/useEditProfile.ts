
import { useState } from 'react';
import { useProfileData } from './useProfileData';
import { useAvatarUpload } from './useAvatarUpload';
import { useProfileUpdate } from './useProfileUpdate';
import { handleInputChange as handleInputChangeUtil } from '@/utils/profileUtils';

export const useEditProfile = () => {
  const { userData, setUserData, loading, fetchUserProfile } = useProfileData();
  const { avatarPreview, uploadingAvatar, handleAvatarChange, uploadAvatar } = useAvatarUpload();
  const { saving, updateProfile } = useProfileUpdate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChangeUtil(e, userData, setUserData);
  };

  const handleSaveProfile = async () => {
    // Get user session to get user ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // Upload avatar if changed and get the new URL
    const avatarUrl = await uploadAvatar(session.user.id, userData.avatarUrl);
    
    // Update the profile with new data including avatar URL
    await updateProfile(userData, avatarUrl, fetchUserProfile);
  };

  return {
    userData,
    loading,
    saving,
    uploadingAvatar,
    avatarPreview,
    handleInputChange,
    handleAvatarChange,
    handleSaveProfile
  };
};

// Add missing import for Supabase client
import { supabase } from '@/integrations/supabase/client';

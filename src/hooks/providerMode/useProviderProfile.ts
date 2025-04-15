
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  wallet_balance: number | null;
  is_provider: boolean;
}

export const useProviderProfile = (userId: string | null) => {
  const [profileComplete, setProfileComplete] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: null,
    phone: null,
    address: null,
    bio: null,
    wallet_balance: null,
    is_provider: false
  });

  const checkUserProfile = async () => {
    if (!userId) return;
    
    try {
      // Get profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address, bio, wallet_balance, is_provider')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Check if profile is complete enough to be a provider
      const isComplete = !!(
        profile.full_name &&
        profile.phone &&
        profile.address &&
        profile.bio
      );
      
      setProfileComplete(isComplete);
      setProfileData(profile);
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const getMissingFields = () => {
    const missing = [];
    if (!profileData.full_name) missing.push('Nama Lengkap');
    if (!profileData.phone) missing.push('Nomor Telepon');
    if (!profileData.address) missing.push('Alamat');
    if (!profileData.bio) missing.push('Bio');
    return missing;
  };
  
  useEffect(() => {
    if (userId) {
      checkUserProfile();
    }
  }, [userId]);

  return {
    profileComplete,
    profileData,
    getMissingFields,
    checkUserProfile
  };
};

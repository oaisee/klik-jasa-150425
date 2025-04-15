
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useProviderMode = () => {
  const navigate = useNavigate();
  const [hasServices, setHasServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [profileData, setProfileData] = useState<{
    full_name: string | null;
    phone: string | null;
    address: string | null;
    bio: string | null;
    wallet_balance: number | null;
  }>({
    full_name: null,
    phone: null,
    address: null,
    bio: null,
    wallet_balance: null
  });

  const checkUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Get profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address, bio, wallet_balance, is_provider')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Check if user is a provider
      if (!profile.is_provider) {
        navigate('/profile');
        return;
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
      
      // Check if user has any services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('provider_id', session.user.id)
        .limit(1);
        
      if (servicesError) throw servicesError;
      
      setHasServices(services && services.length > 0);
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserProfile();
  }, [navigate]);

  const getMissingFields = () => {
    const missing = [];
    if (!profileData.full_name) missing.push('Nama Lengkap');
    if (!profileData.phone) missing.push('Nomor Telepon');
    if (!profileData.address) missing.push('Alamat');
    if (!profileData.bio) missing.push('Bio');
    return missing;
  };

  return {
    hasServices,
    loading,
    profileComplete,
    profileData,
    getMissingFields
  };
};

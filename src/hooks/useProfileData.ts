
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { ProfileFormData } from '@/types/profile';

export const useProfileData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: null,
  });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!sessionData.session) {
        toast.error("Sesi tidak ditemukan, silakan login kembali");
        navigate('/login');
        return;
      }
      
      const user = sessionData.session.user;
      console.log("Current user data:", user);
      
      // Get profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile from database:", profileError);
        // Fall back to user metadata if profile table fetch fails
        setUserData({
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          address: user.user_metadata?.address || '',
          bio: '',
          avatarUrl: null
        });
      } else if (profileData) {
        console.log("Profile data from database:", profileData);
        setUserData({
          name: profileData.full_name || '',
          email: user.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          bio: profileData.bio || '',
          avatarUrl: profileData.avatar_url
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userData,
    setUserData,
    loading,
    fetchUserProfile
  };
};

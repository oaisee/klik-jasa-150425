
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  rating: number;
  reviews: number;
  walletBalance: number;
  avatarUrl: string | null;
  isProvider: boolean;
}

export const useProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    rating: 0,
    reviews: 0,
    walletBalance: 0,
    avatarUrl: null,
    isProvider: false
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
        console.error("No active session found");
        navigate('/login');
        return;
      }
      
      const user = sessionData.session.user;
      console.log("Current user data in profile:", user);
      
      // Get profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile from database:", profileError);
        throw profileError;
      }
      
      console.log("Profile data from database:", profileData);
      
      // Format join date
      const createdAt = profileData.created_at ? new Date(profileData.created_at) : new Date();
      const month = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(createdAt);
      const year = createdAt.getFullYear();
      
      // Get review data if available (to be implemented)
      const averageRating = 4.8; // Placeholder - we'll implement this for real later
      const reviewCount = 24;    // Placeholder - we'll implement this for real later
      
      // Set user data
      setUserData({
        name: profileData.full_name || 'Pengguna KlikJasa',
        email: user.email || '',
        phone: profileData.phone || '-',
        joinDate: `Bergabung ${month} ${year}`,
        rating: averageRating,
        reviews: reviewCount,
        walletBalance: profileData.wallet_balance || 0,
        avatarUrl: profileData.avatar_url,
        isProvider: profileData.is_provider || false
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Gagal memuat data profil", {
        description: "Silakan coba lagi nanti",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    loading,
    userData,
    fetchUserProfile
  };
};


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatarUrl: string | null;
}

export const useEditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [userData, setUserData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: null,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Store the file for upload
      setAvatarFile(file);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return userData.avatarUrl;
    
    try {
      setUploadingAvatar(true);
      
      // Create a unique file path
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Gagal mengunggah foto profil");
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sesi tidak ditemukan, silakan login kembali");
        navigate('/login');
        return;
      }
      
      const userId = session.user.id;
      
      // Upload avatar if changed
      let avatarUrl = userData.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(userId);
      }
      
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
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

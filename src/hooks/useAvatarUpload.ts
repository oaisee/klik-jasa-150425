
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useAvatarUpload = () => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

  const uploadAvatar = async (userId: string, currentAvatarUrl: string | null): Promise<string | null> => {
    if (!avatarFile) return currentAvatarUrl;
    
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

  return {
    avatarFile,
    avatarPreview,
    uploadingAvatar,
    handleAvatarChange,
    uploadAvatar
  };
};

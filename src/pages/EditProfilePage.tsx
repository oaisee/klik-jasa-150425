
import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    avatarUrl: null as string | null,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Edit Profil | KlikJasa';
    fetchUserProfile();
  }, []);

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
      } else {
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

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Edit Profil</h1>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Profile Preview" 
                className="rounded-full object-cover w-full h-full"
              />
            ) : userData.avatarUrl ? (
              <img 
                src={userData.avatarUrl} 
                alt="Profile" 
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
                <span className="text-2xl">{userData.name.charAt(0)}</span>
              </div>
            )}
          </Avatar>
          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-marketplace-primary text-white p-2 rounded-full cursor-pointer">
            {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          </label>
          <input 
            type="file" 
            id="avatar-upload" 
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
          />
        </div>
      </div>

      {loading ? (
        <Card className="mb-4">
          <CardContent className="p-4 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-marketplace-primary" />
            <p className="ml-2">Memuat data profil...</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={userData.email} 
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
              </div>
              
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input 
                  id="phone" 
                  value={userData.phone} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Input 
                  id="address" 
                  value={userData.address} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={userData.bio} 
                  onChange={handleInputChange}
                  placeholder="Ceritakan tentang diri Anda..."
                  className="resize-none"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveProfile}
                disabled={saving || uploadingAvatar}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProfilePage;

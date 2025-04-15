
import { useState, useEffect } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

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
      
      // Set user data from user metadata
      setUserData({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: userData.name,
          phone: userData.phone,
          address: userData.address
        }
      });
      
      if (error) throw error;
      
      toast.success("Profil berhasil diperbarui");
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
            <img 
              src="https://randomuser.me/api/portraits/men/42.jpg" 
              alt="Profile" 
              className="rounded-full object-cover w-full h-full"
            />
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-marketplace-primary text-white p-2 rounded-full">
            <Camera size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <Card className="mb-4">
          <CardContent className="p-4 flex justify-center items-center">
            <p>Memuat data profil...</p>
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

              <Button 
                className="w-full" 
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProfilePage;

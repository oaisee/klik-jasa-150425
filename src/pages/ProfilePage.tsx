
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useProfile } from '@/hooks/useProfile';
import ProfileSummary from '@/components/profile/ProfileSummary';
import WalletSummary from '@/components/profile/WalletSummary';
import ProfileMenu from '@/components/profile/ProfileMenu';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { loading, userData } = useProfile();

  useEffect(() => {
    document.title = 'Profil | KlikJasa';
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Berhasil Keluar");
      
      // Redirect to homepage after logout with a slight delay
      setTimeout(() => {
        navigate('/', { replace: true });
        window.location.reload(); // Force reload to clear any cached auth state
      }, 500);
      
    } catch (error) {
      toast.error("Gagal Keluar");
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-4">Profil Saya</h1>
      </div>
      
      <ProfileSummary loading={loading} userData={userData} />
      
      <WalletSummary walletBalance={userData.walletBalance} />
      
      <ProfileMenu />
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center"
        onClick={handleLogout}
      >
        <LogOut size={18} className="mr-2" />
        Keluar
      </Button>
    </div>
  );
};

export default ProfilePage;

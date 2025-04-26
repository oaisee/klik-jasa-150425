
import React from 'react';
import { Bell, Shield, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Use both toast methods to ensure notification shows up
      toast.success("Berhasil keluar");
      toastHook({
        title: "Berhasil Keluar",
        description: "Anda telah keluar dari akun",
      });
      
      // Add a slight delay before navigation to ensure session is cleared
      setTimeout(() => {
        navigate('/', { replace: true });
        window.location.reload(); // Force reload to clear any cached state
      }, 300);
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Gagal keluar");
      toastHook({
        title: "Gagal Keluar",
        description: "Terjadi kesalahan saat keluar dari akun",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-1 mb-6">
      <MenuItemCard 
        icon={<Bell size={20} />}
        title="Notifikasi"
        path="/notifications"
      />
      <MenuItemCard 
        icon={<Shield size={20} />}
        title="Keamanan"
        path="/security"
      />
      <MenuItemCard 
        icon={<CreditCard size={20} />}
        title="Metode Pembayaran"
        path="/payment-methods"
      />
      <MenuItemCard 
        icon={<Settings size={20} />}
        title="Pengaturan"
        path="/settings"
      />
      <MenuItemCard 
        icon={<HelpCircle size={20} />}
        title="Pusat Bantuan"
        path="/help"
      />
      
      {/* Logout button */}
      <div onClick={handleLogout} className="cursor-pointer">
        <MenuItemCard 
          icon={<LogOut size={20} color="#EF4444" />}
          title="Keluar"
          path="#"
        />
      </div>
    </div>
  );
};

export default ProfileMenu;


import React from 'react';
import { Bell, Shield, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Berhasil Keluar",
        description: "Anda telah keluar dari akun",
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
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

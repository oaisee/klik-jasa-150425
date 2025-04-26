
import React, { useState } from 'react';
import { Bell, Shield, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { performLogout } from '@/integrations/supabase/client';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    try {
      toast.loading("Sedang keluar...");
      
      const result = await performLogout(navigate);
      
      if (!result.success) {
        throw new Error(result.error || "Gagal keluar dari akun");
      }
      
      // Success notifications will appear after navigation/reload
      toast.success("Berhasil keluar");
      toastHook({
        title: "Berhasil Keluar",
        description: "Anda telah keluar dari akun",
      });
      
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Gagal keluar");
      toastHook({
        title: "Gagal Keluar",
        description: "Terjadi kesalahan saat keluar dari akun",
        variant: "destructive",
      });
      setIsLoggingOut(false);
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
          title={isLoggingOut ? "Sedang Keluar..." : "Keluar"}
          path="#"
        />
      </div>
    </div>
  );
};

export default ProfileMenu;


import React from 'react';
import { Bell, Shield, CreditCard, Settings, HelpCircle } from 'lucide-react';
import MenuItemCard from './MenuItemCard';

const ProfileMenu = () => {
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
    </div>
  );
};

export default ProfileMenu;

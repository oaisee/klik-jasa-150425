
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Star, 
  Shield,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  useEffect(() => {
    document.title = 'Profil | KlikJasa';
  }, []);
  
  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-4">Profil Saya</h1>
      </div>
      
      {/* Profile Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <img 
                src="https://randomuser.me/api/portraits/men/42.jpg" 
                alt="Profile" 
                className="rounded-full object-cover w-full h-full"
              />
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">Rahmat Hidayat</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span>4.8 (24 ulasan)</span>
              </div>
              <p className="text-sm text-gray-500">Bergabung Maret 2025</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button className="flex-1 mr-2" variant="outline">
              Edit Profil
            </Button>
            <Button className="flex-1 ml-2" variant="default">
              Mode Penyedia
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Wallet Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Saldo KlikJasa</h3>
            <Link to="/wallet">
              <Button variant="ghost" className="text-marketplace-primary p-0">
                Lihat Detail
              </Button>
            </Link>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold">Rp 250.000</p>
            <div className="mt-2 flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Isi Saldo
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Tarik Dana
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Menu Items */}
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
      
      <Button variant="outline" className="w-full flex items-center justify-center">
        <LogOut size={18} className="mr-2" />
        Keluar
      </Button>
    </div>
  );
};

interface MenuItemCardProps {
  icon: React.ReactNode;
  title: string;
  path: string;
}

const MenuItemCard = ({ icon, title, path }: MenuItemCardProps) => {
  return (
    <Link to={path}>
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-gray-500 mr-3">
              {icon}
            </div>
            <span>{title}</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfilePage;

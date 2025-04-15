
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
      navigate('/login');
    } catch (error) {
      toast.error("Gagal logout");
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 flex items-center space-x-2">
        <img
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
          alt="KlikJasa Logo"
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-marketplace-primary">KlikJasa Admin</h1>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="mr-2 h-5 w-5" />
              Pengguna
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('services')}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Layanan
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('transactions')}
            >
              <FileText className="mr-2 h-5 w-5" />
              Transaksi
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="mr-2 h-5 w-5" />
              Pengaturan
            </Button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Keluar
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

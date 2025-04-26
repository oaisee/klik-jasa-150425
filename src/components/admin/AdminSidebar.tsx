
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  LogOut,
  BarChart3,
  ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  
  useEffect(() => {
    // Fetch pending verification requests on mount
    console.log('AdminSidebar: Fetching pending verifications');
    fetchPendingVerifications();
    
    // Set up a timer to check for new verifications periodically
    const interval = setInterval(fetchPendingVerifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchPendingVerifications = async () => {
    try {
      const { count, error } = await supabase
        .from('verification_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) throw error;
      
      console.log('AdminSidebar: Pending verification count:', count);
      
      if (count !== null) {
        setPendingVerifications(count);
      }
    } catch (error) {
      console.error('Error fetching verification requests:', error);
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Ensure we're using the correct route format with hyphen instead of slash
    navigate(`/admin-dashboard?tab=${tab}`);
  };
  
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
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-4 flex items-center space-x-2">
        <img
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
          alt="KlikJasa Logo"
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-marketplace-primary">KlikJasa Admin</h1>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-2 mb-2">
          Utama
        </div>
        <ul className="space-y-1 mb-6">
          <li>
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('analytics')}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Analitik
            </Button>
          </li>
        </ul>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-2 mb-2">
          Manajemen
        </div>
        <ul className="space-y-1 mb-6">
          <li>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('users')}
            >
              <Users className="mr-2 h-5 w-5" />
              Pengguna
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'services' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('services')}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Layanan
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('transactions')}
            >
              <FileText className="mr-2 h-5 w-5" />
              Transaksi
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === 'verifications' ? 'default' : 'ghost'}
              className="w-full justify-start relative"
              onClick={() => handleTabChange('verifications')}
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Verifikasi
              {pendingVerifications > 0 && (
                <Badge 
                  variant="outline" 
                  className="ml-2 bg-red-100 text-red-800 border-red-200 rounded-full px-2 py-0.5 text-xs"
                >
                  {pendingVerifications}
                </Badge>
              )}
            </Button>
          </li>
        </ul>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-2 mb-2">
          Sistem
        </div>
        <ul className="space-y-1">
          <li>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleTabChange('settings')}
            >
              <Settings className="mr-2 h-5 w-5" />
              Pengaturan
            </Button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
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

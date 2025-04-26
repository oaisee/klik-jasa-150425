
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface AdminMobileTabsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
}

const AdminMobileTabsHeader = ({ 
  activeTab, 
  setActiveTab, 
  handleSignOut 
}: AdminMobileTabsHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
          alt="KlikJasa Logo" 
          className="h-6 w-6" 
        />
        <span className="font-semibold text-lg">KlikJasa Admin</span>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <div className="py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
              <div className="space-y-1">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analitik
                </Button>
                <Button
                  variant={activeTab === 'users' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Pengguna
                </Button>
                <Button
                  variant={activeTab === 'services' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('services')}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Layanan
                </Button>
                <Button
                  variant={activeTab === 'transactions' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('transactions')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Transaksi
                </Button>
                <Button
                  variant={activeTab === 'verifications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('verifications')}
                >
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  Verifikasi
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Pengaturan
                </Button>
                <Button
                  variant="destructive"
                  className="w-full mt-4 justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileTabsHeader;

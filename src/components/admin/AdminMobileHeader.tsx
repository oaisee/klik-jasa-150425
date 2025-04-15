
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings 
} from 'lucide-react';

interface AdminMobileHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => Promise<void>;
}

const AdminMobileHeader = ({ activeTab, setActiveTab, handleSignOut }: AdminMobileHeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
            alt="KlikJasa Logo"
            className="w-8 h-8"
          />
          <h1 className="text-lg font-bold text-marketplace-primary">KlikJasa Admin</h1>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 text-red-500" />
        </Button>
      </div>
      
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="dashboard" onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="users" onClick={() => setActiveTab('users')}>
          <Users className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="services" onClick={() => setActiveTab('services')}>
          <Briefcase className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="transactions" onClick={() => setActiveTab('transactions')}>
          <FileText className="h-5 w-5" />
        </TabsTrigger>
        <TabsTrigger value="settings" onClick={() => setActiveTab('settings')}>
          <Settings className="h-5 w-5" />
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminMobileHeader;

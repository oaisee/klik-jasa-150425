import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <LogOut className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid grid-cols-6 w-full bg-muted p-1 h-10 items-center justify-center rounded-md">
        <Button 
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('users')}
        >
          <Users className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('services')}
        >
          <Briefcase className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'transactions' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('transactions')}
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-full flex justify-center items-center"
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AdminMobileHeader;

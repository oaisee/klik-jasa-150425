
import AdminMobileHeader from '@/components/admin/AdminMobileHeader';

interface AdminMobileTabsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => Promise<void>;
}

const AdminMobileTabsHeader = ({ 
  activeTab, 
  setActiveTab, 
  handleSignOut 
}: AdminMobileTabsHeaderProps) => {
  return (
    <div className="md:hidden px-4 py-2 bg-white border-b border-gray-200">
      <AdminMobileHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        handleSignOut={handleSignOut}
      />
    </div>
  );
};

export default AdminMobileTabsHeader;

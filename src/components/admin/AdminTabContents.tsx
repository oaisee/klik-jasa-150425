
import ServiceManagement from './sections/ServiceManagement';
import UserManagement from './sections/UserManagement';
import TransactionManagement from './sections/TransactionManagement';
import Settings from './sections/Settings';
import VerificationRequestsList from './verification/VerificationRequestsList';

interface AdminTabContentsProps {
  activeTab: string;
}

const AdminTabContents = ({ activeTab }: AdminTabContentsProps) => {
  if (activeTab === 'users') {
    return <UserManagement />;
  }
  
  if (activeTab === 'services') {
    return <ServiceManagement />;
  }
  
  if (activeTab === 'transactions') {
    return <TransactionManagement />;
  }
  
  if (activeTab === 'settings') {
    return <Settings />;
  }
  
  if (activeTab === 'verifications') {
    return <VerificationRequestsList />;
  }
  
  // Default content or placeholder
  return (
    <div className="text-center py-20 text-gray-500">
      Select a tab to view content
    </div>
  );
};

export default AdminTabContents;

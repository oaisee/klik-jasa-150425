
import AnalyticsOverview from './analytics/AnalyticsOverview';
import UserManagement from './sections/UserManagement';
import ServiceManagement from './sections/ServiceManagement';
import TransactionManagement from './sections/TransactionManagement';
import Settings from './sections/Settings';
import VerificationRequestsList from './VerificationRequestsList';

interface AdminTabContentsProps {
  activeTab: string;
}

const AdminTabContents = ({ activeTab }: AdminTabContentsProps) => {
  return (
    <div className="space-y-6">
      {activeTab === 'analytics' && (
        <AnalyticsOverview />
      )}
      
      {activeTab === 'users' && (
        <>
          <VerificationRequestsList />
          <UserManagement />
        </>
      )}
      
      {activeTab === 'services' && (
        <ServiceManagement />
      )}
      
      {activeTab === 'transactions' && (
        <TransactionManagement />
      )}
      
      {activeTab === 'settings' && (
        <Settings />
      )}
    </div>
  );
};

export default AdminTabContents;


import UserManagement from './sections/UserManagement';
import ServiceManagement from './sections/ServiceManagement';
import TransactionManagement from './sections/TransactionManagement';
import VerificationDashboard from './verification/VerificationDashboard';
import Settings from './sections/Settings';
import AnalyticsOverview from './analytics/AnalyticsOverview';

interface AdminTabContentsProps {
  activeTab: string;
}

const AdminTabContents = ({ activeTab }: AdminTabContentsProps) => {
  // Render the appropriate component based on the active tab
  switch (activeTab) {
    case 'users':
      return <UserManagement />;
    case 'services':
      return <ServiceManagement />;
    case 'transactions':
      return <TransactionManagement />;
    case 'verifications':
      return <VerificationDashboard />;
    case 'settings':
      return <Settings />;
    case 'analytics':
      return <AnalyticsOverview />;
    default:
      return <div>Content for {activeTab} tab</div>;
  }
};

export default AdminTabContents;

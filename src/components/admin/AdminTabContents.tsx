
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
  console.log('Rendering AdminTabContents with activeTab:', activeTab);
  
  switch (activeTab) {
    case 'users':
      return <UserManagement />;
    case 'services':
      return <ServiceManagement />;
    case 'transactions':
      return <TransactionManagement />;
    case 'verifications':
      console.log('Should render verification dashboard');
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

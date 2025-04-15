
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AnalyticsOverview from './analytics/AnalyticsOverview';
import UserManagement from './sections/UserManagement';
import ServiceManagement from './sections/ServiceManagement';
import TransactionManagement from './sections/TransactionManagement';
import Settings from './sections/Settings';

interface AdminTabContentsProps {
  activeTab: string;
}

const AdminTabContents = ({ activeTab }: AdminTabContentsProps) => {
  if (activeTab === 'dashboard') {
    return null; // Dashboard content is handled separately
  }
  
  if (activeTab === 'analytics') {
    return <AnalyticsOverview />;
  }
  
  // Return the corresponding component based on the active tab
  switch (activeTab) {
    case 'users':
      return <UserManagement />;
    case 'services':
      return <ServiceManagement />;
    case 'transactions':
      return <TransactionManagement />;
    case 'settings':
      return <Settings />;
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Konten</CardTitle>
            <CardDescription>Konten akan ditampilkan di sini</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-8 text-gray-500">
              Konten akan ditampilkan di sini.
            </p>
          </CardContent>
        </Card>
      );
  }
};

export default AdminTabContents;

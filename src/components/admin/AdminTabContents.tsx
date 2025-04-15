
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AnalyticsOverview from './analytics/AnalyticsOverview';

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
  
  const getTabContent = () => {
    switch (activeTab) {
      case 'users':
        return {
          title: "Manajemen Pengguna",
          description: "Kelola pengguna dan penyedia jasa di platform KlikJasa"
        };
      case 'services':
        return {
          title: "Manajemen Layanan",
          description: "Kelola semua layanan yang terdaftar di platform KlikJasa"
        };
      case 'transactions':
        return {
          title: "Manajemen Transaksi",
          description: "Kelola semua transaksi yang terjadi di platform KlikJasa"
        };
      case 'settings':
        return {
          title: "Pengaturan",
          description: "Kelola pengaturan platform KlikJasa"
        };
      default:
        return {
          title: "Konten",
          description: "Konten akan ditampilkan di sini"
        };
    }
  };
  
  const content = getTabContent();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-gray-500">
          Konten {content.title.toLowerCase()} akan ditampilkan di sini.
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminTabContents;

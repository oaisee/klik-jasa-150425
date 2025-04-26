
import { Tabs, TabsContent } from '@/components/ui/tabs';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import AdminTabContents from '@/components/admin/AdminTabContents';

interface AdminTabsContentProps {
  activeTab: string;
  connectionStatus: { success: boolean; message: string } | null;
}

const AdminTabsContent = ({ activeTab, connectionStatus }: AdminTabsContentProps) => {
  console.log('AdminTabsContent rendering with activeTab:', activeTab);
  
  return (
    <div className="flex-1 overflow-auto p-4 pb-16">
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="dashboard" className="mt-0">
          <AdminDashboardContent connectionStatus={connectionStatus} />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <AdminTabContents activeTab="analytics" />
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <AdminTabContents activeTab="users" />
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <AdminTabContents activeTab="services" />
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-0">
          <AdminTabContents activeTab="transactions" />
        </TabsContent>
        
        <TabsContent value="verifications" className="mt-0">
          <AdminTabContents activeTab="verifications" />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <AdminTabContents activeTab="settings" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTabsContent;

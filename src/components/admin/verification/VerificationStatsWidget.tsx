
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { useVerificationStats } from '@/hooks/useVerificationStats';
import StatTotalRequests from './stats/StatTotalRequests';
import StatPendingRequests from './stats/StatPendingRequests';
import StatApprovedRequests from './stats/StatApprovedRequests';
import StatRejectedRequests from './stats/StatRejectedRequests';

const VerificationStatsWidget = () => {
  const { stats, loading, refreshing, fetchStats } = useVerificationStats();
  
  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    await fetchStats(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Statistik Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingIndicator />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Statistik Verifikasi</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh stats</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTotalRequests total={stats.total} lastWeek={stats.lastWeek} />
          <StatPendingRequests pending={stats.pending} total={stats.total} />
          <StatApprovedRequests approved={stats.approved} total={stats.total} />
          <StatRejectedRequests rejected={stats.rejected} total={stats.total} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatsWidget;

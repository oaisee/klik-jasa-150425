
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface VerificationSummaryProps {
  filteredCount: number;
  totalCount: number;
  refreshing: boolean;
  onRefresh: () => void;
}

const VerificationSummary = ({
  filteredCount,
  totalCount,
  refreshing,
  onRefresh
}: VerificationSummaryProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="text-sm text-gray-500 w-full sm:w-auto">
        Total: {filteredCount} dari {totalCount} permintaan
      </div>
      <div className="flex-1"></div>
      <Button 
        variant="outline" 
        className="w-full sm:w-auto" 
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Memuat Ulang...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Muat Ulang Data
          </>
        )}
      </Button>
    </div>
  );
};

export default VerificationSummary;

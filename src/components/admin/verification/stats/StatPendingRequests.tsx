
import { Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatPendingRequestsProps {
  pending: number;
  total: number;
}

const StatPendingRequests = ({ pending, total }: StatPendingRequestsProps) => {
  const percentage = total > 0 ? Math.round((pending / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="h-5 w-5 text-amber-500" />
        <span className="text-sm font-medium text-gray-600">Menunggu</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-amber-700">{pending}</span>
        {pending > 0 && total > 0 && (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            {percentage}%
          </Badge>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1">
        {pending > 0 ? (
          <TrendingUp className="h-3 w-3 text-amber-400" />
        ) : (
          <Clock className="h-3 w-3 text-amber-400" />
        )}
        <span className="text-xs text-amber-600">
          {pending > 0 ? 'Memerlukan verifikasi' : 'Tidak ada yang menunggu'}
        </span>
      </div>
    </div>
  );
};

export default StatPendingRequests;

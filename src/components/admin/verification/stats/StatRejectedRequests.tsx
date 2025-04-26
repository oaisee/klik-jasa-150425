
import { UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatRejectedRequestsProps {
  rejected: number;
  total: number;
}

const StatRejectedRequests = ({ rejected, total }: StatRejectedRequestsProps) => {
  const percentage = total > 0 ? Math.round((rejected / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <UserX className="h-5 w-5 text-red-500" />
        <span className="text-sm font-medium text-gray-600">Ditolak</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-red-700">{rejected}</span>
        {rejected > 0 && total > 0 && (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {percentage}%
          </Badge>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1">
        <UserX className="h-3 w-3 text-red-400" />
        <span className="text-xs text-red-600">
          {rejected > 0 ? 'Ditolak karena masalah dokumen' : 'Tidak ada yang ditolak'}
        </span>
      </div>
    </div>
  );
};

export default StatRejectedRequests;


import { UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatApprovedRequestsProps {
  approved: number;
  total: number;
}

const StatApprovedRequests = ({ approved, total }: StatApprovedRequestsProps) => {
  const percentage = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <UserCheck className="h-5 w-5 text-green-500" />
        <span className="text-sm font-medium text-gray-600">Disetujui</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-green-700">{approved}</span>
        {approved > 0 && total > 0 && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {percentage}%
          </Badge>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1">
        <UserCheck className="h-3 w-3 text-green-400" />
        <span className="text-xs text-green-600">
          {approved} penyedia jasa aktif
        </span>
      </div>
    </div>
  );
};

export default StatApprovedRequests;

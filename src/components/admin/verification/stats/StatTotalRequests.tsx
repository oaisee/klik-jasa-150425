
import { Users, CalendarDays } from 'lucide-react';

interface StatTotalRequestsProps {
  total: number;
  lastWeek: number;
}

const StatTotalRequests = ({ total, lastWeek }: StatTotalRequestsProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Users className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium text-gray-600">Total</span>
      </div>
      <span className="text-2xl font-bold text-blue-700">{total}</span>
      <div className="mt-1 flex items-center gap-1">
        <CalendarDays className="h-3 w-3 text-blue-400" />
        <span className="text-xs text-blue-600">
          {lastWeek} dalam 7 hari terakhir
        </span>
      </div>
    </div>
  );
};

export default StatTotalRequests;

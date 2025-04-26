
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface TransactionItemProps {
  type: 'topup' | 'commission' | 'payout';
  amount: number;
  date?: string;
  timestamp?: string;
  status: string;
  description: string;
}

const TransactionItem = ({ type, amount, date, timestamp, status, description }: TransactionItemProps) => {
  const isIncoming = type === 'topup';
  
  // Format the date
  const displayDate = () => {
    if (date) return date;
    if (timestamp) {
      try {
        return format(parseISO(timestamp), 'dd MMMM yyyy, HH:mm', { locale: id });
      } catch (e) {
        return timestamp;
      }
    }
    return '';
  };

  // Status badge color
  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          Menunggu
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Gagal</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center py-4 px-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200">
      <div className={`p-3 rounded-full mr-4 ${isIncoming ? 'bg-green-100' : 'bg-red-100'} shadow-sm`}>
        {isIncoming ? (
          <ArrowDownLeft className="h-5 w-5 text-green-600" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">{description}</h4>
          {status && getStatusBadge()}
        </div>
        <p className="text-xs text-gray-500">{displayDate()}</p>
      </div>
      <div className={`font-semibold text-base text-right ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
        {isIncoming ? '+' : '-'} Rp {amount.toLocaleString()}
      </div>
    </div>
  );
};

export default TransactionItem;


import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionItemProps {
  type: 'topup' | 'commission' | 'payout';
  amount: number;
  date: string;
  description: string;
}

const TransactionItem = ({ type, amount, date, description }: TransactionItemProps) => {
  const isIncoming = type === 'topup';
  
  return (
    <div className="flex items-center py-3 border-b border-gray-100">
      <div className={`p-2 rounded-full mr-3 ${isIncoming ? 'bg-green-100' : 'bg-red-100'}`}>
        {isIncoming ? (
          <ArrowDownLeft className="h-5 w-5 text-green-600" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{description}</h4>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <div className={`font-medium ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
        {isIncoming ? '+' : '-'} Rp {amount.toLocaleString()}
      </div>
    </div>
  );
};

export default TransactionItem;

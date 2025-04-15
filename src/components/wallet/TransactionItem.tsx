
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionItem = ({ type, amount, date, timestamp, description }: TransactionItemProps) => {
  const isIncoming = type === 'topup';
  const displayDate = date || timestamp || '';
  
  return (
    <div className="flex items-center py-4 px-1 border-b border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-200">
      <div className={`p-3 rounded-full mr-4 ${isIncoming ? 'bg-green-100' : 'bg-red-100'} shadow-sm`}>
        {isIncoming ? (
          <ArrowDownLeft className="h-5 w-5 text-green-600" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-red-600" />
        )}
      </div>
      <div className="flex-1 text-left">  {/* Changed to text-left */}
        <h4 className="font-medium text-gray-800">{description}</h4>
        <p className="text-xs text-gray-500">{displayDate}</p>
      </div>
      <div className={`font-semibold text-base text-right ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
        {isIncoming ? '+' : '-'} Rp {amount.toLocaleString()}
      </div>
    </div>
  );
};

export default TransactionItem;

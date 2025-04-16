
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ReceiptText } from 'lucide-react';

interface TransactionTypeIconProps {
  type: string;
}

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'topup':
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    case 'withdrawal':
      return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
    case 'commission':
      return <ReceiptText className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

export const getTransactionTypeLabel = (type: string) => {
  switch (type) {
    case 'topup':
      return 'Top Up';
    case 'withdrawal':
      return 'Penarikan';
    case 'commission':
      return 'Komisi';
    default:
      return type;
  }
};

const TransactionTypeIcon = ({ type }: TransactionTypeIconProps) => {
  return (
    <div className="flex items-center gap-1">
      {getTransactionIcon(type)}
      {getTransactionTypeLabel(type)}
    </div>
  );
};

export default TransactionTypeIcon;

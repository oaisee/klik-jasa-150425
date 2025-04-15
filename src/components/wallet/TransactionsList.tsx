
import React from 'react';
import TransactionItem from './TransactionItem';
import EmptyState from '../shared/EmptyState';
import LoadingIndicator from '../shared/LoadingIndicator';
import { CreditCard } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'topup' | 'commission';
  amount: number;
  timestamp: string;
  status: string;
  description: string;
}

export interface TransactionsListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionsList = ({ transactions, loading = false }: TransactionsListProps) => {
  if (loading) {
    return <LoadingIndicator />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState 
        icon={CreditCard}
        title="Tidak ada transaksi"
        description="Riwayat transaksi Anda akan muncul di sini"
      />
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <TransactionItem 
          key={transaction.id}
          type={transaction.type}
          amount={transaction.amount}
          timestamp={transaction.timestamp}
          description={transaction.description}
        />
      ))}
    </div>
  );
};

export default TransactionsList;

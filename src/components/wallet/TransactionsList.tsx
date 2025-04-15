
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import TransactionItem from './TransactionItem';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../shared/EmptyState';
import { FileX } from 'lucide-react';
import { Transaction } from '@/types/database';

interface TransactionsListProps {
  userId: string;
}

const TransactionsList = ({ userId }: TransactionsListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Cast the data to ensure it complies with Transaction type
      const typedTransactions = data?.map(item => ({
        ...item,
        type: item.type as 'topup' | 'commission' | 'payout'
      })) || [];
      
      setTransactions(typedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState 
        icon={FileX}
        title="Belum ada transaksi"
        description="Riwayat transaksi Anda akan muncul di sini"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          type={transaction.type as 'topup' | 'commission' | 'payout'}
          amount={transaction.amount}
          date={new Date(transaction.created_at).toISOString()}
          description={transaction.description}
        />
      ))}
    </div>
  );
};

export default TransactionsList;

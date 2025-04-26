
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/components/wallet/TransactionsList';
import { toast } from 'sonner';

export const useWalletTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        setTransactionsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedTransactions: Transaction[] = data.map((item) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        timestamp: item.created_at,
        status: item.status,
        description: item.description,
      }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Gagal memuat data transaksi', {
        description: 'Silakan coba lagi nanti'
      });
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Set up real-time listener for wallet_transactions
  useEffect(() => {
    fetchTransactions();
    
    const channel = supabase
      .channel('wallet_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallet_transactions'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchTransactions();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    transactions,
    transactionsLoading,
    fetchTransactions
  };
};

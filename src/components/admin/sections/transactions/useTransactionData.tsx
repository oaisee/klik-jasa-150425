
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  profile_id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  booking_id?: string;
  created_at?: string;
  profile?: {
    full_name: string;
  };
}

export const useTransactionData = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Since we don't have real transactions data yet, let's create mock data
    // In a real app, we'd fetch from the database
    const createMockTransactions = () => {
      setLoading(true);
      const types = ['topup', 'commission', 'withdrawal'];
      const statuses = ['completed', 'pending', 'failed'];
      const descriptions = [
        'Top up wallet via Midtrans', 
        'Commission fee for booking #', 
        'Withdrawal to bank account'
      ];
      
      const mockData: Transaction[] = Array.from({ length: 15 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const typeIndex = types.indexOf(type);
        
        return {
          id: `trans-${i + 1}`,
          profile_id: `user-${Math.floor(Math.random() * 10) + 1}`,
          amount: Math.floor(Math.random() * 1000000) + 50000,
          type,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          description: `${descriptions[typeIndex]}${typeIndex === 1 ? Math.floor(Math.random() * 1000) : ''}`,
          booking_id: typeIndex === 1 ? `booking-${Math.floor(Math.random() * 100) + 1}` : undefined,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          profile: {
            full_name: `User ${Math.floor(Math.random() * 10) + 1}`
          }
        };
      });
      
      setTransactions(mockData);
      setLoading(false);
    };

    createMockTransactions();
  }, []);

  // Filter transactions based on search query and type filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    loading,
    transactions,
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    formatDate
  };
};


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import TopUpDialog from '@/components/wallet/TopUpDialog';
import TransactionsList, { Transaction } from '@/components/wallet/TransactionsList';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

const WalletPage = () => {
  const { userData, loading, fetchUserProfile } = useProfile();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams] = useSearchParams();

  // Check payment status from URL parameters (from Midtrans redirect)
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      if (status === 'success') {
        toast.success('Pembayaran berhasil!', {
          description: 'Saldo Anda telah ditambahkan'
        });
      } else if (status === 'pending') {
        toast.info('Pembayaran sedang diproses', {
          description: 'Saldo akan ditambahkan setelah pembayaran dikonfirmasi'
        });
      } else if (status === 'error') {
        toast.error('Pembayaran gagal', {
          description: 'Silakan coba lagi atau gunakan metode pembayaran lain'
        });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = 'Saldo | KlikJasa';
    fetchTransactions();
    
    // Set up real-time listener for wallet_transactions
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
          fetchUserProfile(); // Refresh wallet balance
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      
      // Map database records to Transaction interface
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
  
  const handleTopUp = (amount: number) => {
    // Refresh the profile to get updated balance
    fetchUserProfile();
    // Refresh transactions
    fetchTransactions();
  };
  
  const filteredTransactions = () => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'topup') return transactions.filter(t => t.type === 'topup');
    if (activeTab === 'commission') return transactions.filter(t => t.type === 'commission');
    return transactions;
  };

  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Saldo</h1>
      
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Card className="mb-6 bg-gradient-to-r from-marketplace-secondary to-marketplace-primary text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm opacity-80 mb-1">Saldo Saat Ini</div>
                  <div className="text-2xl font-bold">Rp {userData.walletBalance?.toLocaleString() || '0'}</div>
                </div>
                <Wallet className="h-8 w-8 opacity-80" />
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full mt-4 text-marketplace-primary"
                onClick={() => setIsTopUpOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Top Up Saldo
              </Button>
            </CardContent>
          </Card>
          
          <h2 className="text-lg font-semibold mb-3">Riwayat Transaksi</h2>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="topup">
                <ArrowDownLeft className="mr-1 h-4 w-4" /> Top Up
              </TabsTrigger>
              <TabsTrigger value="commission">
                <ArrowUpRight className="mr-1 h-4 w-4" /> Komisi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TransactionsList 
                transactions={filteredTransactions()} 
                loading={transactionsLoading} 
              />
            </TabsContent>
            
            <TabsContent value="topup">
              <TransactionsList 
                transactions={filteredTransactions()} 
                loading={transactionsLoading} 
              />
            </TabsContent>
            
            <TabsContent value="commission">
              <TransactionsList 
                transactions={filteredTransactions()} 
                loading={transactionsLoading} 
              />
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <TopUpDialog 
        open={isTopUpOpen}
        onOpenChange={setIsTopUpOpen}
        onTopUp={handleTopUp}
      />
    </div>
  );
};

export default WalletPage;


import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useProfile } from '@/hooks/useProfile';
import TopUpDialog from '@/components/wallet/TopUpDialog';
import TransactionsList, { Transaction } from '@/components/wallet/TransactionsList';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { supabase } from '@/integrations/supabase/client';

const WalletPage = () => {
  const { userData, loading, fetchUserProfile } = useProfile();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    document.title = 'Saldo | KlikJasa';
    fetchTransactions();
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
      
      // In a real app, we would fetch actual transactions
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'topup',
            amount: 200000,
            timestamp: '2023-04-20T14:30:00Z',
            status: 'completed',
            description: 'Top up via Bank Transfer'
          },
          {
            id: '2',
            type: 'commission',
            amount: -12500,
            timestamp: '2023-04-18T09:15:00Z',
            status: 'completed',
            description: 'Komisi layanan "Jasa Pembersihan"'
          },
          {
            id: '3',
            type: 'topup',
            amount: 100000,
            timestamp: '2023-04-15T16:45:00Z',
            status: 'completed',
            description: 'Top up via GOPAY'
          },
          {
            id: '4',
            type: 'commission',
            amount: -5000,
            timestamp: '2023-04-10T13:20:00Z',
            status: 'completed',
            description: 'Komisi layanan "Antar Dokumen"'
          }
        ];
        
        setTransactions(mockTransactions);
        setTransactionsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactionsLoading(false);
    }
  };
  
  const handleTopUp = (amount: number) => {
    // In a real app, this would update the database
    // For now, we're just updating the local state and showing a toast
    fetchUserProfile(); // Refresh the profile to get updated balance
    fetchTransactions(); // Refresh transactions
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

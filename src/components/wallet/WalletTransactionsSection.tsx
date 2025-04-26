
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsList from './TransactionsList';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction } from './TransactionsList';

interface WalletTransactionsSectionProps {
  transactions: Transaction[];
  loading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const WalletTransactionsSection = ({ 
  transactions, 
  loading,
  activeTab,
  onTabChange
}: WalletTransactionsSectionProps) => {
  const filteredTransactions = () => {
    if (activeTab === 'all') return transactions;
    if (activeTab === 'topup') return transactions.filter(t => t.type === 'topup');
    if (activeTab === 'commission') return transactions.filter(t => t.type === 'commission');
    return transactions;
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Riwayat Transaksi</h2>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
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
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="topup">
          <TransactionsList 
            transactions={filteredTransactions()} 
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="commission">
          <TransactionsList 
            transactions={filteredTransactions()} 
            loading={loading} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WalletTransactionsSection;

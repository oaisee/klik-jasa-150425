
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import TopUpDialog from '@/components/wallet/TopUpDialog';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import WalletBalanceCard from '@/components/wallet/WalletBalanceCard';
import WalletTransactionsSection from '@/components/wallet/WalletTransactionsSection';
import { useWalletTransactions } from '@/hooks/useWalletTransactions';

const WalletPage = () => {
  const { userData, loading, fetchUserProfile } = useProfile();
  const { transactions, transactionsLoading } = useWalletTransactions();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams] = useSearchParams();

  // Check payment status from URL parameters
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
  }, []);
  
  const handleTopUp = (amount: number) => {
    // Refresh the profile to get updated balance
    fetchUserProfile();
  };

  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-bold mb-4">Saldo</h1>
      
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <WalletBalanceCard 
            balance={userData.walletBalance || 0}
            onTopUp={() => setIsTopUpOpen(true)}
          />
          
          <WalletTransactionsSection 
            transactions={transactions}
            loading={transactionsLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
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

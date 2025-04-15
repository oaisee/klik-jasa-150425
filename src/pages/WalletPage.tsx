
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TopUpDialog from '@/components/wallet/TopUpDialog';
import TransactionsList from '@/components/wallet/TransactionsList';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

const WalletPage = () => {
  const navigate = useNavigate();
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Wallet | KlikJasa';
    getUserIdAndWalletData();
  }, []);
  
  const getUserIdAndWalletData = async () => {
    setIsLoading(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUserId(session.user.id);
        await fetchWalletData(session.user.id);
      } else {
        // If no session, redirect to login
        toast.error('Silakan login terlebih dahulu');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error getting user session:', error);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchWalletData = async (id: string) => {
    try {
      // Get the current user's wallet balance
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', id)
        .single();
          
      if (error) throw error;
        
      if (data) {
        setWalletBalance(data.wallet_balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Gagal memuat data wallet');
    }
  };
  
  const handleTopUp = () => {
    setTopUpDialogOpen(true);
  };

  const handleTopUpSuccess = (amount: number) => {
    // Update the wallet balance locally
    setWalletBalance(prev => prev + amount);
    // Close the dialog
    setTopUpDialogOpen(false);
  };
  
  const handleRefresh = () => {
    if (userId) {
      setIsLoading(true);
      fetchWalletData(userId)
        .finally(() => setIsLoading(false));
    }
  };
  
  return (
    <div className="animate-fade-in pb-20">
      <div className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Wallet</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>
      
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="px-4 pt-4">
          <div className="bg-gradient-to-r from-marketplace-primary to-marketplace-secondary text-white p-6 rounded-lg shadow">
            <p className="text-sm opacity-80">Saldo Saat Ini</p>
            <h2 className="text-3xl font-bold mt-1">Rp {walletBalance.toLocaleString()}</h2>
            
            <div className="flex mt-6">
              <Button 
                variant="secondary" 
                className="flex-1 bg-white text-marketplace-primary hover:bg-gray-100"
                onClick={handleTopUp}
              >
                <Plus size={18} className="mr-2" />
                Isi Saldo
              </Button>
            </div>
          </div>
          
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <AlertDescription className="text-blue-800">
              KlikJasa mengambil komisi 5% dari saldo wallet penyedia jasa saat booking dikonfirmasi
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
            {userId && <TransactionsList userId={userId} />}
          </div>
        </div>
      )}
      
      {userId && (
        <TopUpDialog 
          isOpen={topUpDialogOpen}
          onClose={() => setTopUpDialogOpen(false)}
          onSuccess={handleTopUpSuccess}
          userId={userId}
        />
      )}
    </div>
  );
};

export default WalletPage;


import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransactionItem from '@/components/wallet/TransactionItem';
import { walletData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const WalletPage = () => {
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [amount, setAmount] = useState(50000); // Default amount for top-up
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState(walletData.transactions);
  
  useEffect(() => {
    document.title = 'Wallet | KlikJasa';
    fetchWalletData();
  }, []);
  
  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // Get the current user's wallet balance
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setWalletBalance(data.wallet_balance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Gagal memuat data wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTopUp = () => {
    setPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    // In a real implementation, you would verify the payment status
    // and update the wallet balance accordingly
    toast.success("Pembayaran Berhasil", {
      description: "Saldo Anda telah berhasil ditambahkan ke akun.",
    });
    // Refetch wallet data
    fetchWalletData();
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // This is a simple way to detect successful payment in an iframe
    // In a real app, you would use Midtrans callbacks or check status via API
    const iframe = e.target as HTMLIFrameElement;
    try {
      if (iframe.contentWindow?.location.href.includes('success')) {
        handlePaymentComplete();
      }
    } catch (error) {
      // Cross-origin errors can occur when trying to access iframe content
      console.log('Iframe access limited due to cross-origin policy');
    }
  };
  
  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Wallet</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={fetchWalletData}
          disabled={isLoading}
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-marketplace-primary to-marketplace-secondary text-white p-6 mx-4 rounded-lg shadow">
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
      
      <Alert className="mx-4 mt-4 bg-blue-50 border-blue-200">
        <AlertCircle className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-800">
          KlikJasa mengambil komisi 5% dari saldo wallet penyedia jasa saat booking dikonfirmasi
        </AlertDescription>
      </Alert>
      
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                date={transaction.date}
                description={transaction.description}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Belum ada riwayat transaksi
            </div>
          )}
        </div>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 h-[80vh] overflow-hidden">
          <DialogHeader className="p-4 flex flex-row items-center justify-between">
            <DialogTitle>Pembayaran Midtrans</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPaymentDialogOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <X size={18} />
            </Button>
          </DialogHeader>
          <div className="h-full w-full">
            <iframe 
              src="https://app.midtrans.com/payment-links/1744535686326" 
              title="Midtrans Payment" 
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
            />
          </div>
          <DialogFooter className="p-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setPaymentDialogOpen(false)}
            >
              Batalkan
            </Button>
            <Button onClick={handlePaymentComplete}>
              Selesai Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;

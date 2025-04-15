
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransactionItem from '@/components/wallet/TransactionItem';
import { walletData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";

const WalletPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  useEffect(() => {
    document.title = 'Wallet | KlikJasa';
  }, []);
  
  const handleTopUp = () => {
    setPaymentDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    toast({
      title: "Pembayaran Berhasil",
      description: "Saldo Anda telah berhasil ditambahkan ke akun.",
    });
  };
  
  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Wallet</h1>
      </div>
      
      <div className="bg-gradient-to-r from-marketplace-primary to-marketplace-secondary text-white p-6 mx-4 rounded-lg shadow">
        <p className="text-sm opacity-80">Saldo Saat Ini</p>
        <h2 className="text-3xl font-bold mt-1">Rp {walletData.balance.toLocaleString()}</h2>
        
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
      
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold mb-3">Riwayat Transaksi</h3>
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {walletData.transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              type={transaction.type}
              amount={transaction.amount}
              date={transaction.date}
              description={transaction.description}
            />
          ))}
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
              onLoad={() => {
                // This is a simple way to detect successful payment in an iframe
                // In a real app, you would use Midtrans callbacks or check status via API
                const iframe = document.querySelector('iframe');
                if (iframe?.contentWindow?.location.href.includes('success')) {
                  handlePaymentComplete();
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;

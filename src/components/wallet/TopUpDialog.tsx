
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  userId: string;
}

const PREDEFINED_AMOUNTS = [
  { value: 50000, label: 'Rp 50.000' },
  { value: 100000, label: 'Rp 100.000' },
  { value: 200000, label: 'Rp 200.000' },
  { value: 500000, label: 'Rp 500.000' },
];

const TopUpDialog = ({ isOpen, onClose, onSuccess, userId }: TopUpDialogProps) => {
  const [amount, setAmount] = useState(50000);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleIncreaseAmount = () => {
    setAmount(prev => prev + 50000);
  };

  const handleDecreaseAmount = () => {
    if (amount > 50000) {
      setAmount(prev => prev - 50000);
    }
  };

  const handleProceedToPayment = () => {
    if (amount < 10000) {
      toast.error('Minimal top-up adalah Rp 10.000');
      return;
    }
    setStep('payment');
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCompletePurchase = async () => {
    if (!paymentMethod) {
      toast.error('Silakan pilih metode pembayaran');
      return;
    }

    setProcessing(true);
    try {
      // 1. In a real app, we would integrate with a payment gateway like Midtrans here
      // For the demo, we'll simply simulate a successful payment
      
      // 2. Update user's wallet balance in the database
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();
        
      if (fetchError) throw fetchError;
      
      const currentBalance = userData.wallet_balance || 0;
      const newBalance = currentBalance + amount;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);
        
      if (updateError) throw updateError;
      
      // 3. Record the transaction
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          type: 'top_up',
          payment_method: paymentMethod,
          status: 'completed',
          description: `Top up via ${paymentMethod}`
        });
        
      if (transactionError) throw transactionError;
      
      // 4. Notify success and close the dialog
      toast.success(`Top-up Rp ${amount.toLocaleString()} berhasil`);
      onSuccess(amount);
      resetDialog();
    } catch (error) {
      console.error('Error processing top-up:', error);
      toast.error('Gagal melakukan top-up. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  const resetDialog = () => {
    setAmount(50000);
    setStep('amount');
    setPaymentMethod(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetDialog()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            {step === 'payment' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep('amount')}
                className="mr-2 h-8 w-8"
              >
                <ArrowLeft size={16} />
              </Button>
            )}
            <DialogTitle>
              {step === 'amount' ? 'Isi Saldo' : 'Pilih Metode Pembayaran'}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetDialog}
            className="h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        {step === 'amount' ? (
          <>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Jumlah Top-up</p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecreaseAmount}
                    disabled={amount <= 10000}
                  >
                    <Minus size={16} />
                  </Button>
                  <div className="text-2xl font-bold min-w-[120px]">
                    Rp {amount.toLocaleString()}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleIncreaseAmount}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PREDEFINED_AMOUNTS.map((item) => (
                  <Button
                    key={item.value}
                    variant={amount === item.value ? "default" : "outline"}
                    onClick={() => handleAmountChange(item.value)}
                    className="w-full"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleProceedToPayment} 
                className="w-full"
              >
                Lanjutkan
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Total Pembayaran</p>
                <p className="text-xl font-bold">Rp {amount.toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Pilih Metode Pembayaran:</p>
                
                {[
                  { id: 'bca', name: 'Bank BCA', icon: 'https://midtrans.com/assets/images/logo-bca.svg' },
                  { id: 'mandiri', name: 'Bank Mandiri', icon: 'https://midtrans.com/assets/images/logo-mandiri.svg' },
                  { id: 'gopay', name: 'GoPay', icon: 'https://midtrans.com/assets/images/logo-gopay.svg' },
                  { id: 'ovo', name: 'OVO', icon: 'https://midtrans.com/assets/images/logo-ovo.svg' }
                ].map(method => (
                  <div 
                    key={method.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors flex justify-between items-center ${
                      paymentMethod === method.id 
                        ? 'border-marketplace-primary bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={method.icon} 
                        alt={method.name} 
                        className="h-8 w-8 object-contain" 
                      />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-xs text-gray-500">
                          {method.id === 'gopay' || method.id === 'ovo' 
                            ? 'E-Wallet' 
                            : 'Transfer Bank'}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="h-4 w-4 rounded-full bg-marketplace-primary"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleCompletePurchase} 
                className="w-full"
                disabled={!paymentMethod || processing}
              >
                {processing ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

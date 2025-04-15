
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess: () => void;
}

const TopUpDialog = ({ open, onOpenChange, userId, onSuccess }: TopUpDialogProps) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);
  
  const predefinedAmounts = [
    { value: '50000', label: 'Rp 50.000' },
    { value: '100000', label: 'Rp 100.000' },
    { value: '200000', label: 'Rp 200.000' },
    { value: '500000', label: 'Rp 500.000' },
  ];
  
  const paymentMethods = [
    { value: 'bank_transfer', label: 'Transfer Bank' },
    { value: 'e_wallet', label: 'E-Wallet (OVO, GoPay, DANA)' },
    { value: 'credit_card', label: 'Kartu Kredit' },
  ];
  
  const handleSelectAmount = (value: string) => {
    setSelectedAmount(value);
    setAmount(value);
  };
  
  const handleManualAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedAmount('');
  };
  
  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Masukkan jumlah yang valid");
      return;
    }
    
    if (Number(amount) < 10000) {
      toast.error("Minimal top up Rp 10.000");
      return;
    }
    
    if (Number(amount) > 10000000) {
      toast.error("Maksimal top up Rp 10.000.000");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would initiate a Midtrans payment flow
      // For now, simulate a successful top-up
      
      // Mock delay to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record transaction in the database
      const { error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: userId,
          amount: Number(amount),
          type: 'topup',
          status: 'completed',
          description: `Top up via ${getPaymentMethodName(paymentMethod)}`,
          metadata: {
            payment_method: paymentMethod,
          }
        });
      
      if (error) throw error;
      
      // Update wallet balance
      const { error: updateError } = await supabase
        .rpc('increment_wallet_balance', {
          user_id: userId,
          increment_amount: Number(amount)
        });
      
      if (updateError) throw updateError;
      
      toast.success(`Top up Rp ${Number(amount).toLocaleString()} berhasil`);
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error processing top up:', error);
      toast.error("Gagal melakukan top up. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };
  
  const getPaymentMethodName = (value: string): string => {
    const method = paymentMethods.find(m => m.value === value);
    return method ? method.label : value;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up Saldo</DialogTitle>
          <DialogDescription>
            Pilih nominal dan metode pembayaran untuk top up saldo Anda
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Pilih Nominal</Label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedAmounts.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedAmount === option.value ? "default" : "outline"}
                  className="h-10"
                  onClick={() => handleSelectAmount(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Nominal Lainnya</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Masukkan nominal"
                className="pl-10"
                value={amount}
                onChange={handleManualAmountChange}
              />
            </div>
            <p className="text-xs text-gray-500">Minimal Rp 10.000, maksimal Rp 10.000.000</p>
          </div>
          
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              {paymentMethods.map((method) => (
                <div 
                  key={method.value}
                  className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                >
                  <RadioGroupItem value={method.value} id={method.value} />
                  <Label htmlFor={method.value} className="flex-1 cursor-pointer">
                    {method.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0 || loading}
            className="w-full"
          >
            {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

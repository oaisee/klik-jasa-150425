
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { CreditCard, AlertCircle } from 'lucide-react';

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: (amount: number) => void;
}

const TopUpDialog = ({ open, onOpenChange, onTopUp }: TopUpDialogProps) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePresetAmountClick = (presetAmount: number) => {
    setAmount(presetAmount);
    setCustomAmount(presetAmount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setAmount(value ? parseInt(value, 10) : '');
  };

  const handleTopUp = async () => {
    if (!amount) {
      toast({
        variant: "destructive",
        title: "Jumlah tidak valid",
        description: "Silakan masukkan jumlah yang valid untuk top up",
      });
      return;
    }

    if (typeof amount === 'number' && amount < 10000) {
      toast({
        variant: "destructive",
        title: "Jumlah terlalu kecil",
        description: "Minimal top up adalah Rp 10.000",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Simulate API call to payment provider (Midtrans)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would integrate with Midtrans API
      // After successful payment, we would call onTopUp
      
      onTopUp(typeof amount === 'number' ? amount : 0);
      
      toast({
        title: "Top up berhasil!",
        description: `Rp ${typeof amount === 'number' ? amount.toLocaleString() : 0} telah ditambahkan ke saldo Anda`,
      });
      
      // Reset and close dialog
      setAmount('');
      setCustomAmount('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing top up:', error);
      toast({
        variant: "destructive",
        title: "Gagal melakukan top up",
        description: "Terjadi kesalahan saat memproses pembayaran Anda"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Top Up Saldo KlikJasa
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <Button
                key={presetAmount}
                variant={amount === presetAmount ? "default" : "outline"}
                onClick={() => handlePresetAmountClick(presetAmount)}
                className="w-full"
              >
                Rp {presetAmount.toLocaleString()}
              </Button>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah Kustom</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <Input
                id="amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pl-10"
                placeholder="Minimal Rp 10.000"
              />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-600" />
              <div>
                <p className="font-medium">Informasi Pembayaran</p>
                <p className="mt-1">Top up saldo melalui Midtrans dengan berbagai metode pembayaran (bank transfer, e-wallet, dll)</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleTopUp}
            disabled={!amount || isProcessing}
            className="w-full"
          >
            {isProcessing ? "Memproses..." : `Top Up ${amount ? `Rp ${Number(amount).toLocaleString()}` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: (amount: number) => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

const TopUpDialog = ({ open, onOpenChange, onTopUp }: TopUpDialogProps) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState<{id: string; email: string; name: string} | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Load Midtrans Snap script
  useEffect(() => {
    if (open && !scriptLoaded) {
      const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
      const script = document.createElement('script');
      script.src = midtransScriptUrl;
      script.setAttribute('data-client-key', 'Mid-client-JQ9Bp2ODOaoiu58P'); // Use the client key
      script.onload = () => setScriptLoaded(true);
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
    
    // Fetch user data when dialog opens
    if (open) {
      fetchUserData();
    }
  }, [open]);

  // Check transaction status
  useEffect(() => {
    const checkTransactionStatus = async () => {
      if (!orderId) return;
      
      try {
        const response = await fetch('/functions/v1/midtrans-payment/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId }),
        });
        
        const data = await response.json();
        
        if (data.status === 'completed') {
          toast.success("Top up berhasil!");
          onTopUp(typeof amount === 'number' ? amount : 0);
          resetDialog();
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
      }
    };
    
    const intervalId = setInterval(checkTransactionStatus, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [orderId]);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        return;
      }
      
      const user = session.user;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      setUserData({
        id: user.id,
        email: user.email || '',
        name: profileData?.full_name || ''
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handlePresetAmountClick = (presetAmount: number) => {
    setAmount(presetAmount);
    setCustomAmount(presetAmount.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setAmount(value ? parseInt(value, 10) : '');
  };

  const resetDialog = () => {
    setAmount('');
    setCustomAmount('');
    setIsProcessing(false);
    setOrderId(null);
    onOpenChange(false);
  };

  const handleTopUp = async () => {
    if (!amount) {
      toast.error("Jumlah tidak valid", {
        description: "Silakan masukkan jumlah yang valid untuk top up"
      });
      return;
    }

    if (typeof amount === 'number' && amount < 10000) {
      toast.error("Jumlah terlalu kecil", {
        description: "Minimal top up adalah Rp 10.000"
      });
      return;
    }

    if (!userData?.id) {
      toast.error("Anda belum login", {
        description: "Silakan login terlebih dahulu"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Call midtrans-payment edge function to create transaction
      const response = await fetch('/functions/v1/midtrans-payment/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          userId: userData.id,
          userEmail: userData.email,
          userName: userData.name
        }),
      });

      const { token, order_id } = await response.json();
      
      if (!token) {
        throw new Error('Failed to get payment token');
      }
      
      setOrderId(order_id);
      
      // Open Midtrans Snap payment page
      if (window.snap && scriptLoaded) {
        window.snap.pay(token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            toast.success("Top up berhasil!");
            onTopUp(typeof amount === 'number' ? amount : 0);
            resetDialog();
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            toast.info("Pembayaran dalam proses", {
              description: "Saldo akan ditambahkan setelah pembayaran selesai"
            });
            // Don't close yet, keep checking status
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            toast.error("Gagal melakukan top up", {
              description: "Terjadi kesalahan saat memproses pembayaran Anda"
            });
            setIsProcessing(false);
          },
          onClose: function() {
            console.log('Customer closed the popup without finishing payment');
            toast.info("Pembayaran dibatalkan", {
              description: "Anda telah menutup halaman pembayaran"
            });
            setIsProcessing(false);
          }
        });
      } else {
        throw new Error('Midtrans Snap not loaded properly');
      }
    } catch (error) {
      console.error('Error processing top up:', error);
      toast.error("Gagal melakukan top up", {
        description: error.message || "Terjadi kesalahan saat memproses pembayaran Anda"
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
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : `Top Up ${amount ? `Rp ${Number(amount).toLocaleString()}` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

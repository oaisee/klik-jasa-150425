
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MidtransPaymentOptions {
  onSuccess: (amount: number) => void;
  onClose: () => void;
}

interface MidtransPayment {
  amount: number | '';
  isProcessing: boolean;
  orderId: string | null;
  initializePayment: (amount: number) => Promise<void>;
  reset: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export const useMidtransPayment = ({ onSuccess, onClose }: MidtransPaymentOptions): MidtransPayment => {
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadMidtransScript = () => {
      const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
      const script = document.createElement('script');
      script.src = midtransScriptUrl;
      script.setAttribute('data-client-key', 'Mid-client-JQ9Bp2ODOaoiu58P');
      script.onload = () => setScriptLoaded(true);
      
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };
    
    loadMidtransScript();
  }, []);

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
          onSuccess(typeof amount === 'number' ? amount : 0);
          reset();
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
      }
    };
    
    const intervalId = setInterval(checkTransactionStatus, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [orderId, amount, onSuccess]);

  const initializePayment = async (paymentAmount: number) => {
    if (!paymentAmount || paymentAmount < 10000) {
      toast.error("Jumlah tidak valid", {
        description: "Minimal top up adalah Rp 10.000"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setAmount(paymentAmount);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No active session');
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      const response = await fetch('/functions/v1/midtrans-payment/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          userId: session.user.id,
          userEmail: session.user.email,
          userName: profileData?.full_name || ''
        }),
      });

      const { token, order_id } = await response.json();
      
      if (!token) {
        throw new Error('Failed to get payment token');
      }
      
      setOrderId(order_id);
      
      if (window.snap && scriptLoaded) {
        window.snap.pay(token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            toast.success("Top up berhasil!");
            onSuccess(paymentAmount);
            reset();
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            toast.info("Pembayaran dalam proses", {
              description: "Saldo akan ditambahkan setelah pembayaran selesai"
            });
          },
          onError: function(result: any) {
            console.error('Payment error:', result);
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
            onClose();
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
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setAmount('');
    setIsProcessing(false);
    setOrderId(null);
  };

  return {
    amount,
    isProcessing,
    orderId,
    initializePayment,
    reset
  };
};

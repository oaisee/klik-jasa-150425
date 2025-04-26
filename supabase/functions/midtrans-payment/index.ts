
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as midtransClient from "https://esm.sh/midtrans-client@1.3.1";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Create Midtrans Snap API instance
const snap = new midtransClient.Snap({
  isProduction: false,  // Set to true for production environment
  serverKey: Deno.env.get("MIDTRANS_SERVER_KEY"),
  clientKey: Deno.env.get("MIDTRANS_CLIENT_KEY"),
});

// Create Midtrans API Core instance for notification handling
const core = new midtransClient.CoreApi({
  isProduction: false,  // Set to true for production environment
  serverKey: Deno.env.get("MIDTRANS_SERVER_KEY"),
  clientKey: Deno.env.get("MIDTRANS_CLIENT_KEY"),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Extract request path to determine the action
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  try {
    // Handle payment creation
    if (path === 'create-payment') {
      // Parse request body
      const { amount, userId, userEmail, userName } = await req.json();

      if (!amount || amount < 10000) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount, minimum amount is Rp 10.000' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate order ID
      const orderId = `KJTOPUP-${userId.substring(0, 8)}-${Date.now()}`;
      
      // Prepare transaction parameters
      const transactionParams = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          email: userEmail || 'noemail@klikjasa.com',
          first_name: userName || 'KlikJasa User'
        },
        callbacks: {
          finish: `${url.origin}/wallet?status=success`,
          error: `${url.origin}/wallet?status=error`,
          pending: `${url.origin}/wallet?status=pending`
        },
        item_details: [
          {
            id: "TOPUP-WALLET",
            price: amount,
            quantity: 1,
            name: "Top Up KlikJasa Wallet"
          }
        ]
      };

      // Create transaction
      const { token, redirect_url } = await snap.createTransaction(transactionParams);

      // Create transaction record in database
      const { data: supabaseClient } = await fetch(
        `${url.origin}/rest/v1/wallet_transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            user_id: userId,
            amount: amount,
            type: 'topup',
            status: 'pending',
            description: `Top up wallet via Midtrans`,
            metadata: {
              order_id: orderId,
              payment_gateway: 'midtrans',
              redirect_url: redirect_url
            }
          })
        }
      );

      // Return the transaction token
      return new Response(
        JSON.stringify({ token, redirect_url, order_id: orderId }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle webhook notifications from Midtrans
    else if (path === 'webhook') {
      const notification = await req.json();
      console.log('Received webhook notification:', notification);

      // Verify transaction status
      const statusResponse = await core.transaction.notification(notification);
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;
      
      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      // Check transaction status
      let paymentStatus = 'pending';
      let shouldUpdateBalance = false;
      
      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          paymentStatus = 'pending';
        } else if (fraudStatus === 'accept') {
          paymentStatus = 'completed';
          shouldUpdateBalance = true;
        }
      } else if (transactionStatus === 'settlement') {
        paymentStatus = 'completed';
        shouldUpdateBalance = true;
      } else if (transactionStatus === 'deny') {
        paymentStatus = 'failed';
      } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
        paymentStatus = 'failed';
      } else if (transactionStatus === 'pending') {
        paymentStatus = 'pending';
      }

      // Extract transaction from database
      const { data: transactions, error } = await fetch(
        `${url.origin}/rest/v1/wallet_transactions?metadata->order_id=eq.${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          }
        }
      ).then(res => res.json());

      if (error || !transactions || transactions.length === 0) {
        console.error('Error fetching transaction:', error || 'No transactions found');
        return new Response(
          JSON.stringify({ error: 'Transaction not found' }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const transaction = transactions[0];
      const userId = transaction.user_id;
      const amount = transaction.amount;

      // Update transaction status
      await fetch(
        `${url.origin}/rest/v1/wallet_transactions?id=eq.${transaction.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            status: paymentStatus,
            metadata: {
              ...transaction.metadata,
              transaction_status: transactionStatus,
              fraud_status: fraudStatus,
              updated_at: new Date().toISOString()
            }
          })
        }
      );

      // Update user's wallet balance if payment is successful
      if (shouldUpdateBalance) {
        // Get current wallet balance
        const { data: profiles, error: profileError } = await fetch(
          `${url.origin}/rest/v1/profiles?id=eq.${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            }
          }
        ).then(res => res.json());

        if (profileError || !profiles || profiles.length === 0) {
          console.error('Error fetching profile:', profileError || 'No profile found');
          return new Response(
            JSON.stringify({ error: 'User profile not found' }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const profile = profiles[0];
        const currentBalance = profile.wallet_balance || 0;
        const newBalance = currentBalance + amount;

        // Update wallet balance
        await fetch(
          `${url.origin}/rest/v1/profiles?id=eq.${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              wallet_balance: newBalance
            })
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle status check
    else if (path === 'check-status') {
      const { order_id } = await req.json();
      
      if (!order_id) {
        return new Response(
          JSON.stringify({ error: 'Order ID is required' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get status from database
      const { data: transactions, error } = await fetch(
        `${url.origin}/rest/v1/wallet_transactions?metadata->order_id=eq.${order_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          }
        }
      ).then(res => res.json());

      if (error || !transactions || transactions.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Transaction not found' }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ status: transactions[0].status }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle other paths
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

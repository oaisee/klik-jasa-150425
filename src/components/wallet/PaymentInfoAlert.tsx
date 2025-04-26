
import { AlertCircle } from "lucide-react";

const PaymentInfoAlert = () => {
  return (
    <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-600" />
        <div>
          <p className="font-medium">Informasi Pembayaran</p>
          <p className="mt-1">Top up saldo melalui Midtrans dengan berbagai metode pembayaran (bank transfer, e-wallet, dll)</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoAlert;


import React from 'react';

interface TransactionStatusBadgeProps {
  status: string;
}

const TransactionStatusBadge = ({ status }: TransactionStatusBadgeProps) => {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'completed' 
        ? 'bg-green-100 text-green-800' 
        : status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
    }`}>
      {status === 'completed' ? 'Selesai' : 
       status === 'pending' ? 'Menunggu' : 'Gagal'}
    </div>
  );
};

export default TransactionStatusBadge;

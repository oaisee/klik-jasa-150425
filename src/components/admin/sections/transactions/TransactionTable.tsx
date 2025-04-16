
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import TransactionTableRow from './TransactionTableRow';

interface Transaction {
  id: string;
  profile_id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  booking_id?: string;
  created_at?: string;
  profile?: {
    full_name: string;
  };
}

interface TransactionTableProps {
  loading: boolean;
  filteredTransactions: Transaction[];
  formatDate: (dateString?: string) => string;
  searchQuery: string;
  typeFilter: string;
}

const TransactionTable = ({ 
  loading, 
  filteredTransactions, 
  formatDate,
  searchQuery,
  typeFilter
}: TransactionTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Transaksi</TableHead>
            <TableHead>Pengguna</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32">
                {searchQuery || typeFilter !== 'all' ? 'Tidak ada transaksi yang sesuai dengan filter' : 'Belum ada transaksi'}
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionTableRow 
                key={transaction.id} 
                transaction={transaction} 
                formatDate={formatDate} 
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;

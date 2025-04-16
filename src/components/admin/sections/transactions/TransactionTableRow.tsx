
import React from 'react';
import { 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Download } from 'lucide-react';
import TransactionStatusBadge from './TransactionStatusBadge';
import TransactionTypeIcon from './TransactionTypeIcon';
import { formatRupiah } from '@/utils/adminUtils';

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

interface TransactionTableRowProps {
  transaction: Transaction;
  formatDate: (dateString?: string) => string;
}

const TransactionTableRow = ({ transaction, formatDate }: TransactionTableRowProps) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell className="font-medium">{transaction.id}</TableCell>
      <TableCell>{transaction.profile?.full_name || '-'}</TableCell>
      <TableCell>
        <TransactionTypeIcon type={transaction.type} />
      </TableCell>
      <TableCell className={transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}>
        {transaction.type === 'withdrawal' ? '-' : ''}{formatRupiah(transaction.amount)}
      </TableCell>
      <TableCell>
        <TransactionStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>{formatDate(transaction.created_at)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>Lihat Detail</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              <span>Unduh Invoice</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;

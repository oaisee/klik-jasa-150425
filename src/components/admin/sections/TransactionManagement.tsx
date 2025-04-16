
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionTable from './transactions/TransactionTable';
import { useTransactionData } from './transactions/useTransactionData';

const TransactionManagement = () => {
  const { 
    loading, 
    filteredTransactions, 
    searchQuery, 
    setSearchQuery, 
    typeFilter, 
    setTypeFilter,
    formatDate
  } = useTransactionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Transaksi</CardTitle>
        <CardDescription>Kelola semua transaksi yang terjadi di platform KlikJasa</CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <TransactionTable 
          loading={loading}
          filteredTransactions={filteredTransactions}
          formatDate={formatDate}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionManagement;

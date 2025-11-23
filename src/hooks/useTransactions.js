import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

// ✅ METHOD 31: Custom Hook for reusable logic
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ METHOD 32: Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      setError(null);
      const updatedTransaction = await transactionService.update(id, transactionData);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      return updatedTransaction;
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
      throw err;
    }
  };

  // ✅ METHOD 33: Add new transaction
  const addTransaction = async (transactionData) => {
    try {
      setError(null);
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err.message || 'Failed to add transaction');
      throw err;
    }
  };

  // ✅ METHOD 34: Delete transaction
  const deleteTransaction = async (id) => {
    try {
      setError(null);
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      throw err;
    }
  };

  // ✅ METHOD 35: useEffect for initial data load
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setError
  };
};
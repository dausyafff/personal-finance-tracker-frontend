import React, { createContext, useState, useContext, useCallback } from 'react';
import { transactionsService } from '../services/transactionService'; // import dari service Anda

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  // ✅ METHOD 34: Clear error
  const clearError = useCallback(() => setError(null), []);

  // ✅ METHOD 35: Get all transactions
  const getTransactions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      clearError();
      const data = await transactionsService.getAll(params);
      setTransactions(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // ✅ METHOD 36: Create transaction
  const createTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      clearError();
      const data = await transactionsService.create(transactionData);
      
      // Update local state
      setTransactions(prev => [data, ...prev]);
      
      // Refresh summary
      await refreshSummary();
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // ✅ METHOD 37: Update transaction
  const updateTransaction = useCallback(async (id, transactionData) => {
    try {
      setLoading(true);
      clearError();
      const data = await transactionsService.update(id, transactionData);
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => t.id === id ? data : t)
      );
      
      // Refresh summary
      await refreshSummary();
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // ✅ METHOD 38: Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      clearError();
      await transactionsService.delete(id);
      
      // Update local state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Refresh summary
      await refreshSummary();
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // ✅ METHOD 39: Search transactions
  const searchTransactions = useCallback(async (query, filters = {}) => {
    try {
      setLoading(true);
      clearError();
      const data = await transactionsService.search(query, filters);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // ✅ METHOD 40: Get financial summary
  const getFinancialSummary = useCallback(async () => {
    try {
      const data = await transactionsService.getSummary();
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // ✅ METHOD 41: Refresh summary data
  const refreshSummary = useCallback(async () => {
    try {
      await getFinancialSummary();
    } catch (err) {
      console.error('Failed to refresh summary:', err);
    }
  }, [getFinancialSummary]);

  // ✅ METHOD 42: Initialize data
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        getTransactions(),
        getFinancialSummary()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getTransactions, getFinancialSummary]);

  const value = {
    // State
    transactions,
    summary,
    loading,
    error,
    
    // Actions
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    searchTransactions,
    getFinancialSummary,
    refreshSummary,
    initializeData,
    clearError
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
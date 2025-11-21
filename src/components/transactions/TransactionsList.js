import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const { transactions, loading, error, deleteTransaction, fetchTransactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ DELETE TRANSACTION
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        alert('Transaction deleted successfully');
      } catch (err) {
        alert('Failed to delete transaction');
      }
    }
  };

  // ✅ EDIT TRANSACTION
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  // ✅ CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setShowForm(false);
  };

  // ✅ SUCCESS CALLBACK
  const handleSuccess = () => {
    fetchTransactions(); // Refresh list
    setEditingTransaction(null);
    setShowForm(false);
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        <button onClick={fetchTransactions} style={{ marginLeft: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transaction Management</h2>

      {/* TOGGLE FORM BUTTON */}
      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ 
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: showForm ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showForm ? 'Hide Form' : 'Add New Transaction'}
      </button>

      {/* TRANSACTION FORM */}
      {(showForm || editingTransaction) && (
        <TransactionForm 
          onSuccess={handleSuccess}
          editData={editingTransaction}
          onCancel={handleCancelEdit}
        />
      )}

      {/* TRANSACTIONS LIST */}
      <div>
        <h3>All Transactions ({transactions.length})</h3>
        
        {transactions.length === 0 ? (
          <p>No transactions found. Create your first transaction!</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {transactions.map(transaction => (
              <div 
                key={transaction.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: transaction.type === 'income' ? '#f0fff0' : '#fff0f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{transaction.description}</h4>
                    <p style={{ margin: '0', color: '#666' }}>
                      {transaction.category?.name} • {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: transaction.type === 'income' ? 'green' : 'red'
                    }}>
                      {transaction.type === 'income' ? '+' : '-'} 
                      ${parseFloat(transaction.amount).toLocaleString()}
                    </div>
                    
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      {/* EDIT BUTTON */}
                      <button 
                        onClick={() => handleEdit(transaction)}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
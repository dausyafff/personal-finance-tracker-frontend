import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../../contexts/TransactionContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaWallet,
  FaPlusCircle,
  FaEye
} from 'react-icons/fa';

const Dashboard = () => {
  const { 
    financialSummary, 
    transactions, 
    expensesByCategory, 
    loading, 
    initializeData 
  } = useTransactions();
  
  const { user } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    // Get 5 most recent transactions
    setRecentTransactions(transactions.slice(0, 5));
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ 
            color: '#2c3e50', 
            margin: '0 0 5px 0',
            fontSize: '28px'
          }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>
            Here's your financial overview
          </p>
        </div>
        
        <Link 
          to="/transactions/add"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          <FaPlusCircle /> Add Transaction
        </Link>
      </div>

      {/* Financial Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Total Income Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          borderLeft: '5px solid #28a745'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ 
                color: '#6c757d', 
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Total Income
              </h3>
              <p style={{ 
                color: '#28a745', 
                margin: 0,
                fontSize: '32px',
                fontWeight: '600'
              }}>
                {formatCurrency(financialSummary.totalIncome)}
              </p>
            </div>
            <div style={{
              backgroundColor: '#d4edda',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaArrowUp style={{ color: '#28a745', fontSize: '20px' }} />
            </div>
          </div>
        </div>

        {/* Total Expense Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          borderLeft: '5px solid #dc3545'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ 
                color: '#6c757d', 
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Total Expense
              </h3>
              <p style={{ 
                color: '#dc3545', 
                margin: 0,
                fontSize: '32px',
                fontWeight: '600'
              }}>
                {formatCurrency(financialSummary.totalExpense)}
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8d7da',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaArrowDown style={{ color: '#dc3545', fontSize: '20px' }} />
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          borderLeft: '5px solid #007bff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ 
                color: '#6c757d', 
                margin: '0 0 10px 0',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Current Balance
              </h3>
              <p style={{ 
                color: financialSummary.balance >= 0 ? '#28a745' : '#dc3545',
                margin: 0,
                fontSize: '32px',
                fontWeight: '600'
              }}>
                {formatCurrency(financialSummary.balance)}
              </p>
            </div>
            <div style={{
              backgroundColor: '#cce5ff',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaWallet style={{ color: '#007bff', fontSize: '20px' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px'
      }}>
        {/* Recent Transactions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              color: '#2c3e50', 
              margin: 0,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Recent Transactions
            </h3>
            <Link 
              to="/transactions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <FaEye /> View All
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div>
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: '1px solid #f1f1f1'
                  }}
                >
                  <div>
                    <div style={{ 
                      fontWeight: '500', 
                      color: '#2c3e50',
                      marginBottom: '5px'
                    }}>
                      {transaction.description}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      fontSize: '14px',
                      color: '#7f8c8d'
                    }}>
                      <span style={{
                        backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                        color: transaction.type === 'income' ? '#28a745' : '#dc3545',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '18px',
                    color: transaction.type === 'income' ? '#28a745' : '#dc3545'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#7f8c8d'
            }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '10px',
                opacity: 0.5
              }}>
                💰
              </div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                No transactions yet
              </h4>
              <p style={{ margin: '0 0 20px 0' }}>
                Start tracking your finances by adding your first transaction
              </p>
              <Link 
                to="/transactions/add"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <FaPlusCircle /> Create First Transaction
              </Link>
            </div>
          )}
        </div>

        {/* Expenses by Category */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{ 
            color: '#2c3e50', 
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Expenses by Category
          </h3>

          {expensesByCategory.length > 0 ? (
            <div>
              {expensesByCategory.map((item, index) => {
                const percentage = (item.amount / financialSummary.totalExpense) * 100;
                return (
                  <div key={index} style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                        {item.category}
                      </span>
                      <span style={{ fontWeight: '600', color: '#dc3545' }}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: '#dc3545',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '5px',
                      fontSize: '12px',
                      color: '#7f8c8d'
                    }}>
                      <span>{percentage.toFixed(1)}% of total expenses</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#7f8c8d'
            }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '10px',
                opacity: 0.5
              }}>
                📊
              </div>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                No expense data yet
              </h4>
              <p style={{ margin: 0 }}>
                Add expense transactions to see category breakdown
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Loading dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Error: {error}</h3>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>No data available</h3>
      </div>
    );
  }

  const { totals, recent_transactions, expense_by_category } = dashboardData;

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Financial Dashboard</h1>
        <Link 
          to="/transactions"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          + Add Transaction
        </Link>
      </div>
      
      {/* SUMMARY CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Income</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'green', margin: 0 }}>
            ${parseFloat(totals.total_income || 0).toLocaleString()}
          </p>
        </div>
        
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Expense</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'red', margin: 0 }}>
            ${parseFloat(totals.total_expense || 0).toLocaleString()}
          </p>
        </div>
        
        <div style={{ 
          padding: '25px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Balance</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: parseFloat(totals.balance || 0) >= 0 ? 'blue' : 'red', 
            margin: 0 
          }}>
            ${parseFloat(totals.balance || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* RECENT TRANSACTIONS */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
            <Link to="/transactions" style={{ color: '#007bff', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
          
          {recent_transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>No transactions yet</p>
              <Link 
                to="/transactions"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginTop: '10px'
                }}
              >
                Create First Transaction
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recent_transactions.map(transaction => (
                <div key={transaction.id} style={{ 
                  padding: '15px',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {transaction.description}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {transaction.category?.name} • {new Date(transaction.transaction_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: transaction.type === 'income' ? 'green' : 'red'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'} 
                    ${parseFloat(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXPENSE BY CATEGORY */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '25px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>Expenses by Category</h3>
          
          {expense_by_category.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>No expense data yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expense_by_category.map(item => (
                <div key={item.category_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: item.category.color || '#666',
                        borderRadius: '50%' 
                      }}
                    ></div>
                    <span>{item.category.name}</span>
                  </div>
                  <span style={{ fontWeight: 'bold' }}>
                    ${parseFloat(item.total).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
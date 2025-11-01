import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

// ✅ METHOD 23: Component with data fetching and state management
const Dashboard = () => {
  // ✅ METHOD 24: Multiple state variables for different data types
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ METHOD 25: Async function in useEffect for data fetching
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

  // ✅ METHOD 26: Conditional rendering based on state
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

  // ✅ METHOD 27: Destructuring for cleaner code
  const { totals, recent_transactions, expense_by_category, monthly_summary } = dashboardData;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Financial Dashboard</h2>
      
      {/* ✅ METHOD 28: Rendering dynamic data */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>
            ${parseFloat(totals.total_income || 0).toLocaleString()}
          </p>
        </div>
        
        <div style={{ padding: '20px', backgroundColor: '#ffe8e8', borderRadius: '8px' }}>
          <h3>Total Expense</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>
            ${parseFloat(totals.total_expense || 0).toLocaleString()}
          </p>
        </div>
        
        <div style={{ padding: '20px', backgroundColor: '#e8f0f8', borderRadius: '8px' }}>
          <h3>Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue' }}>
            ${parseFloat(totals.balance || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ✅ METHOD 29: Rendering lists with map() */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Recent Transactions</h3>
        {recent_transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recent_transactions.map(transaction => (
              <li key={transaction.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{transaction.description}</span>
                <span style={{ 
                  color: transaction.type === 'income' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  ${parseFloat(transaction.amount).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ METHOD 30: Conditional rendering with logical && operator */}
      {expense_by_category.length > 0 && (
        <div>
          <h3>Expenses by Category</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {expense_by_category.map(item => (
              <li key={item.category_id} style={{ 
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{item.category.name}</span>
                <span>${parseFloat(item.total).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
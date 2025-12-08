import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import { 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaPlusCircle,
  FaEye,
  FaCalendarAlt
} from 'react-icons/fa';
import { CATEGORIES } from '../constants/transactionTypes';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    error, 
    deleteTransaction,
    searchTransactions,
    getTransactions,
    refreshFinancialData
  } = useTransactions();
  
  const navigate = useNavigate();
  
  // State untuk search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  useEffect(() => {
    // Apply filters locally for better UX
    let filtered = [...transactions];
    
    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm)
      );
    }
    
    // Type filter
    if (filters.type) {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(transaction => transaction.category === filters.category);
    }
    
    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) <= new Date(filters.endDate)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filters]);

  const handleSearch = async () => {
    try {
      await searchTransactions(searchTerm, filters);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        await refreshFinancialData();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    getTransactions();
  };

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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          color: '#2c3e50', 
          margin: '0 0 10px 0',
          fontSize: '28px'
        }}>
          Transactions
        </h1>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Manage all your income and expense transactions
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, position: 'relative' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c757d'
            }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                border: '1px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: showFilters ? '#007bff' : '#f8f9fa',
              color: showFilters ? 'white' : '#2c3e50',
              border: '1px solid #e1e5e9',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <FaFilter /> Filters
          </button>

          {/* Add Transaction Button */}
          <Link 
            to="/transactions/add"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#28a745',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <FaPlusCircle /> Add Transaction
          </Link>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '15px'
            }}>
              {/* Type Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">All Categories</option>
                  <optgroup label="Income">
                    {CATEGORIES.INCOME.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Expense">
                    {CATEGORIES.EXPENSE.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Start Date Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Start Date
                </label>
                <div style={{ position: 'relative' }}>
                  <FaCalendarAlt style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d'
                  }} />
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: '1px solid #e1e5e9',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>

              {/* End Date Filter */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  End Date
                </label>
                <div style={{ position: 'relative' }}>
                  <FaCalendarAlt style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d'
                  }} />
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 35px',
                      border: '1px solid #e1e5e9',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
              <button
                onClick={handleSearch}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Transactions List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
          padding: '15px 20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e1e5e9',
          fontWeight: '600',
          color: '#2c3e50'
        }}>
          <div>Description</div>
          <div>Category</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Actions</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: '#6c757d'
          }}>
            Loading transactions...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ 
            padding: '60px 20px', 
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '10px',
              opacity: 0.5
            }}>
              📝
            </div>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              No transactions found
            </h4>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm || Object.values(filters).some(Boolean)
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first transaction'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(Boolean) && (
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
            )}
          </div>
        ) : (
          /* Transactions List */
          filteredTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                padding: '15px 20px',
                borderBottom: '1px solid #f1f1f1',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {/* Description */}
              <div>
                <div style={{ 
                  fontWeight: '500', 
                  color: '#2c3e50',
                  marginBottom: '5px'
                }}>
                  {transaction.description}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                  color: transaction.type === 'income' ? '#28a745' : '#dc3545',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </div>
              </div>

              {/* Category */}
              <div style={{ color: '#6c757d' }}>
                {transaction.category}
              </div>

              {/* Date */}
              <div style={{ color: '#6c757d' }}>
                {formatDate(transaction.date)}
              </div>

              {/* Amount */}
              <div style={{
                fontWeight: '600',
                fontSize: '16px',
                color: transaction.type === 'income' ? '#28a745' : '#dc3545'
              }}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '5px'
                  }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '5px'
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => navigate(`/transactions/${transaction.id}`)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6c757d',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '5px'
                  }}
                  title="View Details"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Summary Footer */}
        {filteredTransactions.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e1e5e9',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            <div>
              Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </div>
            <div>
              Total: {formatCurrency(
                filteredTransactions.reduce((sum, t) => 
                  t.type === 'income' ? sum + t.amount : sum - t.amount, 0
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import { CATEGORIES } from '../constants/transactionTypes';
import { 
  FaArrowLeft, 
  FaPlusCircle, 
  FaMoneyBillWave,
  FaCalendarAlt 
} from 'react-icons/fa';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { createTransaction, loading, error, clearError } = useTransactions();
  
  const [formData, setFormData] = useState({
    type: 'expense', // Default ke expense
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });
  
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // If type changes, reset category to empty
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: '',
        type: value
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      await createTransaction(transactionData);
      
      // Redirect to transactions list with success message
      navigate('/transactions', { 
        state: { message: 'Transaction added successfully!' }
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      // Error sudah dihandle oleh context
    }
  };

  // Get available categories based on selected type
  const getAvailableCategories = () => {
    return formData.type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <Link 
            to="/transactions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '16px'
            }}
          >
            <FaArrowLeft /> Back to Transactions
          </Link>
        </div>
        
        <h1 style={{ 
          color: '#2c3e50', 
          margin: '0 0 10px 0',
          fontSize: '28px'
        }}>
          <FaPlusCircle style={{ marginRight: '10px' }} />
          Add New Transaction
        </h1>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Record a new income or expense
        </p>
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
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Type Selection */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Transaction Type *
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'income' } })}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: formData.type === 'income' ? '#d4edda' : '#f8f9fa',
                  color: formData.type === 'income' ? '#28a745' : '#6c757d',
                  border: `2px solid ${formData.type === 'income' ? '#28a745' : '#e1e5e9'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <div style={{ fontSize: '20px' }}>💰</div>
                <div>Income</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'type', value: 'expense' } })}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: formData.type === 'expense' ? '#f8d7da' : '#f8f9fa',
                  color: formData.type === 'expense' ? '#dc3545' : '#6c757d',
                  border: `2px solid ${formData.type === 'expense' ? '#dc3545' : '#e1e5e9'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <div style={{ fontSize: '20px' }}>💸</div>
                <div>Expense</div>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Amount *
            </label>
            <div style={{ position: 'relative' }}>
              <FaMoneyBillWave style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '18px'
              }} />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                style={{
                  width: '100%',
                  padding: '15px 15px 15px 50px',
                  border: `2px solid ${errors.amount ? '#dc3545' : '#e1e5e9'}`,
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '500'
                }}
              />
            </div>
            {errors.amount && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.amount}
              </span>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                border: `2px solid ${errors.category ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a category</option>
              {getAvailableCategories().map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.category}
              </span>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this transaction for?"
              rows="3"
              style={{
                width: '100%',
                padding: '15px',
                border: `2px solid ${errors.description ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {errors.description && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.description}
              </span>
            )}
          </div>

          {/* Date */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              Date *
            </label>
            <div style={{ position: 'relative' }}>
              <FaCalendarAlt style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '18px'
              }} />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '15px 15px 15px 50px',
                  border: `2px solid ${errors.date ? '#dc3545' : '#e1e5e9'}`,
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            {errors.date && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', display: 'block' }}>
                {errors.date}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
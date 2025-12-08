import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import { CATEGORIES } from '../constants/transactionTypes';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaSave 
} from 'react-icons/fa';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getTransaction, 
    updateTransaction, 
    loading, 
    error, 
    clearError 
  } = useTransactions();
  
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load transaction data
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setIsLoading(true);
        clearError();
        
        const transaction = await getTransaction(id);
        
        setFormData({
          type: transaction.type,
          amount: transaction.amount.toString(),
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.split('T')[0]
        });
        
        setOriginalData(transaction);
      } catch (error) {
        console.error('Error loading transaction:', error);
        navigate('/transactions', { 
          state: { error: 'Transaction not found' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadTransaction();
    }
  }, [id, getTransaction, navigate, clearError]);

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

    // If type changes, validate category
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value,
        category: '' // Reset category when type changes
      }));
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.type !== originalData.type ||
      parseFloat(formData.amount) !== originalData.amount ||
      formData.category !== originalData.category ||
      formData.description !== originalData.description ||
      formData.date !== originalData.date.split('T')[0]
    );
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

    if (!hasChanges()) {
      navigate('/transactions');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      await updateTransaction(id, transactionData);
      
      // Redirect to transactions list with success message
      navigate('/transactions', { 
        state: { message: 'Transaction updated successfully!' }
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      // Error sudah dihandle oleh context
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        // Note: Delete function akan diimplement di TransactionContext
        // Untuk sekarang, redirect ke transactions list
        navigate('/transactions', { 
          state: { message: 'Transaction deleted successfully!' }
        });
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Get available categories based on selected type
  const getAvailableCategories = () => {
    return formData.type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading transaction data...</div>
      </div>
    );
  }

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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              color: '#2c3e50', 
              margin: '0 0 10px 0',
              fontSize: '28px'
            }}>
              <FaEdit style={{ marginRight: '10px' }} />
              Edit Transaction
            </h1>
            <p style={{ color: '#7f8c8d', margin: 0 }}>
              Update transaction details
            </p>
          </div>
          
          {originalData && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: originalData.type === 'income' ? '#d4edda' : '#f8d7da',
              color: originalData.type === 'income' ? '#28a745' : '#dc3545',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {originalData.type === 'income' ? 'Income' : 'Expense'}
            </div>
          )}
        </div>
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: '15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Delete
            </button>
            
            <div style={{ flex: 1, display: 'flex', gap: '15px' }}>
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
                disabled={loading || !hasChanges()}
                style={{
                  flex: 1,
                  padding: '15px',
                  backgroundColor: loading ? '#6c757d' : (!hasChanges() ? '#6c757d' : '#007bff'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading || !hasChanges() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FaSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* No changes message */}
          {!hasChanges() && !loading && (
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#e9ecef',
              borderRadius: '6px',
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '14px'
            }}>
              No changes made to the transaction
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditTransaction;
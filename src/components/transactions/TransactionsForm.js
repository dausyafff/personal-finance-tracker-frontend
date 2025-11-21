import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { transactionService } from '../../services/transactionService';

const TransactionForm = ({ onSuccess, editData, onCancel }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    type: 'expense',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ GET CATEGORIES
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ PRE-FILL FORM JIKA EDIT
  useEffect(() => {
    if (editData) {
      setFormData({
        category_id: editData.category_id,
        amount: editData.amount,
        type: editData.type,
        description: editData.description,
        transaction_date: editData.transaction_date
      });
    }
  }, [editData]);

  const fetchCategories = async () => {
    try {
      const data = await dashboardService.getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ CREATE/UPDATE TRANSACTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editData) {
        // UPDATE
        await transactionService.update(editData.id, formData);
      } else {
        // CREATE
        await transactionService.create(formData);
      }
      
      onSuccess(); // Refresh list di parent
      if (!editData) {
        // Reset form jika create baru
        setFormData({
          category_id: '',
          amount: '',
          type: 'expense',
          description: '',
          transaction_date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>{editData ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* TYPE SELECTION */}
        <div style={{ marginBottom: '15px' }}>
          <label>Type:</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* CATEGORY SELECTION */}
        <div style={{ marginBottom: '15px' }}>
          <label>Category:</label>
          <select 
            name="category_id" 
            value={formData.category_id} 
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select Category</option>
            {categories
              .filter(cat => cat.type === formData.type)
              .map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>

        {/* AMOUNT */}
        <div style={{ marginBottom: '15px' }}>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* DATE */}
        <div style={{ marginBottom: '15px' }}>
          <label>Date:</label>
          <input
            type="date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : (editData ? 'Update' : 'Add Transaction')}
          </button>
          
          {editData && (
            <button 
              type="button"
              onClick={onCancel}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
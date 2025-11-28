import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', // Ubah dari firstName/lastName jadi name jika backend butuh field ini
    email: '',
    password: '',
    password_confirmation: '', // Sesuaikan dengan nama field backend
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error ketika user mulai mengetik
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ PERBAIKAN 1: Validasi yang lebih robust
  const validateForm = () => {
    const newErrors = {};

    // Validasi name
    if (!formData.name?.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Validasi email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validasi confirm password
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ PERBAIKAN 2: Handle submit dengan structure data yang benar
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    setIsLoading(true);
    
    try {
      // ✅ PERBAIKAN 3: Structure data sesuai kebutuhan backend
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        // Tambahkan field lain jika diperlukan backend
      };

      console.log('Sending registration data:', registrationData);
      
      await register(registrationData);
      
      // Navigation akan dihandle oleh useEffect yang watch isAuthenticated
      
    } catch (error) {
      console.error('Registration error in component:', error);
      // Error sudah dihandle oleh AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '30px auto', 
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e1e5e9'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          color: '#2c3e50', 
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Create Account
        </h2>
        <p style={{ 
          color: '#7f8c8d', 
          margin: 0,
          fontSize: '16px'
        }}>
          Join Finance Tracker to manage your finances
        </p>
      </div>

      {/* ✅ PERBAIKAN 4: Tampilkan error dari AuthContext */}
      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Registration Error:</strong> {error}
        </div>
      )}

      {/* ✅ PERBAIKAN 5: Form dengan field yang sesuai */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px',
            fontWeight: '500',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.name ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px',
            fontWeight: '500',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.email ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px',
            fontWeight: '500',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.password ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Create a password (min. 6 characters)"
          />
          {errors.password && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.password}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px',
            fontWeight: '500',
            color: '#2c3e50',
            fontSize: '14px'
          }}>
            Confirm Password *
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.password_confirmation ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Confirm your password"
          />
          {errors.password_confirmation && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.password_confirmation}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '14px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginBottom: '20px'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ 
        textAlign: 'center', 
        color: '#7f8c8d',
        fontSize: '15px',
        margin: 0
      }}>
        Already have an account?{' '}
        <Link 
          to="/login" 
          style={{ 
            color: '#007bff', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default Register;
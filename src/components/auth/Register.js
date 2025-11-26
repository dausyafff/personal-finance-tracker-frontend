import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // State management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Custom hooks
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, []);

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength('');
    }
  }, [formData.password]);

  // Event handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    if (strongRegex.test(password)) return 'strong';
    if (mediumRegex.test(password)) return 'medium';
    if (password.length > 0) return 'weak';
    return '';
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong': return '#28a745';
      case 'medium': return '#ffc107';
      case 'weak': return '#dc3545';
      default: return 'transparent';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return 'Strong password';
      case 'medium': return 'Medium password';
      case 'weak': return 'Weak password';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      // Navigation will be handled by useEffect watching isAuthenticated
    } catch (error) {
      console.error('Registration error:', error);
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

      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#f8d7da',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontWeight: '500',
              color: '#2c3e50',
              fontSize: '14px'
            }}>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: `2px solid ${errors.firstName ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.firstName}
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px',
              fontWeight: '500',
              color: '#2c3e50',
              fontSize: '14px'
            }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px',
                border: `2px solid ${errors.lastName ? '#dc3545' : '#e1e5e9'}`,
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.lastName}
              </span>
            )}
          </div>
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
            placeholder="Create a password"
          />
          {passwordStrength && (
            <div style={{ marginTop: '8px' }}>
              <div style={{
                height: '4px',
                backgroundColor: '#e1e5e9',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                  backgroundColor: getPasswordStrengthColor(),
                  transition: 'all 0.3s ease'
                }} />
              </div>
              <span style={{ 
                color: getPasswordStrengthColor(),
                fontSize: '12px',
                fontWeight: '500',
                marginTop: '4px',
                display: 'block'
              }}>
                {getPasswordStrengthText()}
              </span>
            </div>
          )}
          {errors.password && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.password}
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
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px',
              border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#e1e5e9'}`,
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s'
            }}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              style={{ 
                marginTop: '2px',
                transform: 'scale(1.2)'
              }}
            />
            <span style={{ fontSize: '14px', color: '#2c3e50', lineHeight: '1.4' }}>
              I agree to the <Link to="/terms" style={{ color: '#007bff', textDecoration: 'none' }}>Terms and Conditions</Link> and <Link to="/privacy" style={{ color: '#007bff', textDecoration: 'none' }}>Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block', marginLeft: '28px' }}>
              {errors.agreeToTerms}
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
          onMouseOver={(e) => {
            if (!isLoading) e.target.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            if (!isLoading) e.target.style.backgroundColor = '#007bff';
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
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

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          input:focus {
            outline: none;
            border-color: #007bff !important;
          }
        `}
      </style>
    </div>
  );
};

export default Register;
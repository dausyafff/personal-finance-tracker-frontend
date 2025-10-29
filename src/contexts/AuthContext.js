import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

// ✅ METHOD 8: Create Context with default values
const AuthContext = createContext();

// ✅ METHOD 9: Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ METHOD 10: Context Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ METHOD 11: useEffect for initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // ✅ METHOD 12: Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  // ✅ METHOD 13: Register function
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  };

  // ✅ METHOD 14: Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // ✅ METHOD 15: Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#343a40',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      {/* LEFT SIDE - BRAND & LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h3 style={{ margin: 0, color: 'white' }}>
          💰 Finance Tracker
        </h3>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link 
            to="/dashboard" 
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link 
            to="/transactions" 
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Transactions
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE - USER INFO & LOGOUT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Hello, {user?.name}</span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
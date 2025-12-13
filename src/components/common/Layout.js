import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '💰' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '80px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        transition: 'width 0.3s',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0'
      }}>
        {/* Logo */}
        <div style={{ 
          padding: '0 20px 30px 20px',
          borderBottom: '1px solid #2d2d44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <h2 style={{ margin: 0, fontSize: '20px' }}>💰 Finance Tracker</h2>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                color: location.pathname === item.path ? '#4cc9f0' : '#b8b8d1',
                textDecoration: 'none',
                fontSize: sidebarOpen ? '16px' : '12px',
                transition: 'all 0.2s',
                backgroundColor: location.pathname === item.path ? '#2d2d44' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #4cc9f0' : '4px solid transparent'
              }}
            >
              <span style={{ marginRight: sidebarOpen ? '15px' : '0', fontSize: '18px' }}>
                {item.icon}
              </span>
              {sidebarOpen && item.label}
            </Link>
          ))}
        </div>

        {/* User Info & Logout */}
        <div style={{ 
          padding: '20px',
          borderTop: '1px solid #2d2d44',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: '500' }}>{user?.name || user?.email}</div>
              <div style={{ fontSize: '12px', color: '#b8b8d1' }}>{user?.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontSize: sidebarOpen ? '14px' : '18px',
              padding: sidebarOpen ? '8px 16px' : '5px'
            }}
            title="Logout"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#f5f7fa',
        padding: '20px',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
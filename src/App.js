import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';

// ✅ 1. DEFINISIKAN ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ✅ 2. DEFINISIKAN PublicRoute Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// ✅ 3. WRAPPER COMPONENT UNTUK PROTECTED ROUTES DENGAN LAYOUT
const ProtectedLayout = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

// Lazy load components
const Login = React.lazy(() => import('./components/auth/Login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const TransactionList = React.lazy(() => import('./components/transactions/TransactionList'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <React.Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
            <Routes>
              {/* PUBLIC ROUTES - TANPA LAYOUT */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* PROTECTED ROUTES - DENGAN LAYOUT */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <Dashboard />
                  </ProtectedLayout>
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <TransactionList />
                  </ProtectedLayout>
                </ProtectedRoute>
              } />

              {/* DEFAULT ROUTE */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </React.Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Import semua pages dari lokasi yang benar
import Login from './components/Login'; // Login ada di components
import Register from './components/Register'; // Register ada di components
import Dashboard from './components/Dashboard'; // Dashboard ada di components
import Transactions from './components/Transactions'; // Transactions ada di components
import AddTransaction from './components/AddTransaction'; // AddTransaction ada di components
import EditTransaction from './components/EditTransaction'; // EditTransaction ada di components
import Categories from './components/Categories'; // Categories ada di components
import Reports from './components/Reports'; // Reports ada di components
import Profile from './components/Profile'; // Profile ada di components
import NotFound from './components/NotFound'; // NotFound ada di components

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/add" element={<AddTransaction />} />
                <Route path="/transactions/edit/:id" element={<EditTransaction />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
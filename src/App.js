import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransactions';
import EditTransaction from './pages/EditTransactions';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="App">
            <Routes>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/add" element={<AddTransaction />} />
                <Route path="/transactions/edit/:id" element={<EditTransaction />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

            </Routes>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;

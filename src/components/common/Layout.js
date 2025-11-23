import React from 'react';
import Navigation from './Navigation';

// ✅ PASTIKAN ADA export default
const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation />
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

// ✅ INI YANG PENTING - export default
export default Layout;
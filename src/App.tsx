import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UploadFile from './pages/UploadFile';
import DataProcessing from './pages/DataProcessing';
import QueryAnalyzer from './pages/QueryAnalyzer';
import AnalysisResults from './pages/AnalysisResults';
import Auth from './pages/Auth';

import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>Loading application...</div>;
  }

  if (!isAuthenticated) {
    return <Auth onLogin={() => {}} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-area">
          <Header theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadFile />} />
              <Route path="/processing" element={<DataProcessing />} />
              <Route path="/query" element={<QueryAnalyzer />} />
              <Route path="/analysis" element={<AnalysisResults />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

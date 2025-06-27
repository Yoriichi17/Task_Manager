import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ManagerDashboard from './pages/ManagerDashboard';
import AssociateDashboard from './pages/AssociateDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    if (tokenFromStorage && userFromStorage) {
      setToken(tokenFromStorage);
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user.role === 'manager' ? (
                <Navigate to="/manager" />
              ) : (
                <Navigate to="/associate" />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/manager"
          element={
            isAuthenticated && user.role === 'manager' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/associate"
          element={
            isAuthenticated && user.role === 'associate' ? (
              <AssociateDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

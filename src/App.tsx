import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PriceEditPage from './PriceEditPage';
import ReservationList from './ReservationPage';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateRoute from './PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
          <AuthRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthRoutes: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (role: string) => {
    login(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <>
      <nav className="w-full max-w-lg bg-white p-4 rounded shadow mb-6">
        <ul className="flex justify-around">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Modificare Preț
            </Link>
          </li>
          <li>
            <Link to="/reservations" className="text-blue-500 hover:underline">
              Rezervări
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              Logout
            </button>
          </li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <PriceEditPage />
          </PrivateRoute>
        } />
        <Route path="/reservations" element={
          <PrivateRoute>
            <ReservationList />
          </PrivateRoute>
        } />
      </Routes>
    </>
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
};

export default App;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();

  return user === 'tudor' ? children : <Navigate to="/" />;
};

export default PrivateRoute;
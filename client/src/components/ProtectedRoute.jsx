import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { accessToken, user } = useAuth();

  if (!accessToken || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

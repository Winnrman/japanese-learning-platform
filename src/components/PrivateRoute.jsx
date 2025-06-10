// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Or use context
  console.log("User isn't authenticated")

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

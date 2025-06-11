// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from '../pages/auth/AuthContext';


const PrivateRoute = ({ children }) => {

  const user = useAuth();

  // const isAuthenticated = !!localStorage.getItem('authToken'); // Or use context
  // console.log("User isn't authenticated")

  // return isAuthenticated ? children : <Navigate to="/" replace />;

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

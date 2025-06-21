import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles = [] }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

export default PrivateRoute;

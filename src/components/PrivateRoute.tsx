// PrivateRoute.tsx
import React from 'react';
import { Navigate } from '@tanstack/react-router';

// Mock authentication check
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : (window.location.href = '/');
};

export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}



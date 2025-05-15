import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRouteRestaurante({ children }) {
  const token = localStorage.getItem('token');
  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/Login-Restaurante" replace />;
  }
  return children;
}


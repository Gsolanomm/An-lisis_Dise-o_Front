// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verifica si el usuario está autenticado al revisar el token en localStorage
  const isAuthenticated = !!localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    // Redirige a la página de login si no está autenticado
    return <Navigate to="/login" />;
  }

  // Renderiza el componente hijo si está autenticado
  return children;
};

export default ProtectedRoute;

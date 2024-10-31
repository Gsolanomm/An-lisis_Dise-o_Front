// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../Auth/AxiosConfig';

const ProtectedRoute = ({ children, allowedRoles = [], disableRender = false }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // `null` para la verificación en proceso
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // Si no se especifican roles permitidos, se permite el acceso
        if (allowedRoles.length === 0) {
          setIsAuthorized(true);
          return;
        }

        const response = await api.get('/auth/verify-role', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifica si el rol del usuario está permitido
        setIsAuthorized(allowedRoles.includes(response.data.role));
      } catch (err) {
        console.error('Error en la verificación del rol:', err);
        setIsAuthorized(false); // Si hay error en la solicitud, se niega el acceso
      }
    };

    checkAuthorization();
  }, [allowedRoles, token]);

  // Mientras se verifica el rol, muestra un mensaje de carga
  if (isAuthorized === null) return <p>Verificando acceso...</p>;

  // Si disableRender es true, no renderiza los hijos y no hace nada más
  if (disableRender && !isAuthorized) return null;

  // Redirección según si hay token o no, y si tiene permisos
  if (!isAuthorized) return <Navigate to={token ? "/unauthorized" : "/login"} />;

  return children;
};

export default ProtectedRoute;

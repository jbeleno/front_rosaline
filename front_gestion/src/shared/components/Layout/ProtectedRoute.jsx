import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si está autenticado
 * @param {boolean} props.requireAdmin - Si true, solo admins pueden acceder
 * @param {string} props.redirectTo - Ruta de redirección si no está autenticado
 */
export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login' 
}) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la ubicación a la que intentaba acceder
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Usuario autenticado pero no es admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}


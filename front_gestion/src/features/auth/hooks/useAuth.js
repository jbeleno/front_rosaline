/**
 * Hook personalizado para autenticación
 * Proporciona acceso al store de autenticación y métodos útiles
 */
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export function useAuth() {
  const {
    user,
    userProfile,
    cliente,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    initializeAuth,
    login,
    register,
    logout,
  } = useAuthStore();

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    userProfile,
    cliente,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };
}


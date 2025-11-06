/**
 * Hook personalizado para autenticación
 * Proporciona acceso al store de autenticación y métodos útiles
 */
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { supabase } from '../../../config/supabase';

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
    fetchUserProfile,
  } = useAuthStore();

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();

    // Escuchar cambios en el estado de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await initializeAuth();
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.getState().logout();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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


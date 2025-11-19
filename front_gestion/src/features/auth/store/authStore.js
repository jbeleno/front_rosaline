/**
 * Store de autenticación con Zustand
 * Gestiona el estado del usuario autenticado
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../../config/supabase';
import { apiClient } from '../../../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../../../shared/services/api/endpoints';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      userProfile: null, // Datos del backend
      cliente: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isAdmin: false,

      // Acciones
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Obtener perfil del usuario desde el backend
      fetchUserProfile: async (userId) => {
        try {
          // Obtener datos del usuario del backend
          const usuario = await apiClient.get(API_ENDPOINTS.CLIENTE_BY_USUARIO(userId));
          set({ cliente: usuario });

          // Determinar si es admin
          const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
          const isAdmin = userData.rol === 'admin';
          set({ isAdmin, userProfile: { ...usuario, rol: userData.rol } });
        } catch (error) {
          // Si el cliente no existe (404), no es un error crítico
          // Puede ser un admin o un usuario que aún no ha completado su perfil
          if (error.message && (error.message.includes('404') || error.message.includes('no encontrado'))) {
            console.log('Cliente no encontrado para este usuario - puede ser admin o perfil incompleto');
            const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
            const isAdmin = userData.rol === 'admin';
            set({ 
              cliente: null, 
              isAdmin, 
              userProfile: { rol: userData.rol } 
            });
          } else {
            console.error('Error obteniendo perfil:', error);
          }
        }
      },

      // Inicializar autenticación desde token almacenado
      initializeAuth: async () => {
        set({ loading: true });
        try {
          // Verificar si hay token y usuario en localStorage
          const token = localStorage.getItem('token');
          const usuarioStr = localStorage.getItem('usuario');
          
          if (token && usuarioStr) {
            try {
              const usuario = JSON.parse(usuarioStr);
              const { jwtDecode } = await import('jwt-decode');
              
              // Verificar que el token no haya expirado
              const decoded = jwtDecode(token);
              const currentTime = Date.now() / 1000;
              
              if (decoded.exp && decoded.exp < currentTime) {
                // Token expirado, limpiar
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                set({ 
                  user: null, 
                  isAuthenticated: false,
                  loading: false 
                });
                return;
              }
              
              set({ 
                user: { id: usuario.id, email: usuario.correo },
                userProfile: usuario,
                isAuthenticated: true,
                isAdmin: usuario.rol === 'admin',
                loading: false 
              });
              
              // Intentar obtener perfil del cliente
              await get().fetchUserProfile(usuario.id);
            } catch (error) {
              console.error('Error al inicializar autenticación:', error);
              // Limpiar datos inválidos
              localStorage.removeItem('token');
              localStorage.removeItem('usuario');
              set({ 
                user: null, 
                isAuthenticated: false,
                loading: false 
              });
            }
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              loading: false 
            });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Login con backend
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Login en backend
          const backendData = await apiClient.post(API_ENDPOINTS.LOGIN, {
            correo: email,
            contraseña: password,
          });

          // Guardar token
          localStorage.setItem('token', backendData.access_token);

          // Decodificar token para obtener datos del usuario
          const { jwtDecode } = await import('jwt-decode');
          const decoded = jwtDecode(backendData.access_token);
          
          const userData = {
            id: decoded.id_usuario,
            correo: decoded.sub,
            rol: decoded.rol,
          };

          localStorage.setItem('usuario', JSON.stringify(userData));

          // NO hacer login en Supabase - ya no se usa para autenticación
          // Si es necesario para otras funcionalidades, se puede hacer de forma opcional
          // pero no debe fallar el login si Supabase no está disponible

          set({ 
            user: { id: decoded.id_usuario, email: decoded.sub },
            userProfile: userData,
            isAuthenticated: true,
            isAdmin: decoded.rol === 'admin',
            loading: false 
          });

          // Intentar obtener perfil del cliente (puede no existir si es admin o usuario nuevo)
          await get().fetchUserProfile(decoded.id_usuario);

          return { success: true };
        } catch (error) {
          const errorMessage = error.message || 'Error al iniciar sesión';
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          return { success: false, error: errorMessage };
        }
      },

      // Registro
      register: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Crear usuario en backend (el backend envía email de confirmación automáticamente)
          const usuario = await apiClient.post(API_ENDPOINTS.USUARIOS, {
            correo: email,
            contraseña: password,
            rol: 'cliente',
          });

          // NO hacer login automático - el usuario debe confirmar su email primero
          // El usuario puede completar su perfil después de confirmar su cuenta
          set({ loading: false, isAuthenticated: false });
          return { success: true, usuario };
        } catch (error) {
          const errorMessage = error.message || 'Error al registrarse';
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        try {
          // Intentar logout de Supabase si está disponible (opcional)
          // No debe fallar si Supabase no está disponible
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // Ignorar errores de Supabase - no es crítico
            console.log('Supabase no disponible o ya cerrado');
          }
          
          // Limpiar datos de autenticación
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          
          set({ 
            user: null,
            userProfile: null,
            cliente: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            error: null
          });
        } catch (error) {
          // Asegurar que se limpien los datos incluso si hay error
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          set({ 
            user: null,
            userProfile: null,
            cliente: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            error: error.message 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir datos no sensibles
      partialize: (state) => ({ 
        user: state.user ? { id: state.user.id, email: state.user.email } : null 
      }),
    }
  )
);

export default useAuthStore;


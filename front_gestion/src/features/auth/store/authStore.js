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
          console.error('Error obteniendo perfil:', error);
        }
      },

      // Inicializar autenticación desde Supabase
      initializeAuth: async () => {
        set({ loading: true });
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;

          if (session?.user) {
            set({ 
              user: session.user, 
              isAuthenticated: true,
              loading: false 
            });
            await get().fetchUserProfile(session.user.id);
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

      // Login con backend (mantener compatibilidad)
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

          // También hacer login en Supabase si es necesario
          const { data: supabaseUser } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          set({ 
            user: supabaseUser?.user || { id: decoded.id_usuario, email: decoded.sub },
            userProfile: userData,
            isAuthenticated: true,
            isAdmin: decoded.rol === 'admin',
            loading: false 
          });

          await get().fetchUserProfile(decoded.id_usuario);

          return { success: true };
        } catch (error) {
          const errorMessage = error.message || 'Error al iniciar sesión';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Registro
      register: async (email, password, userData) => {
        set({ loading: true, error: null });
        try {
          // Crear usuario en backend
          const usuario = await apiClient.post(API_ENDPOINTS.USUARIOS, {
            correo: email,
            contraseña: password,
            rol: 'cliente',
          });

          // Crear cliente
          await apiClient.post(API_ENDPOINTS.CLIENTES, {
            id_usuario: usuario.id_usuario,
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono,
            direccion: userData.direccion,
          });

          // Guardar usuario básico
          localStorage.setItem('usuario', JSON.stringify({
            id: usuario.id_usuario,
            rol: usuario.rol,
          }));

          // Login automático después del registro
          return await get().login(email, password);
        } catch (error) {
          const errorMessage = error.message || 'Error al registrarse';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          
          set({ 
            user: null,
            userProfile: null,
            cliente: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false 
          });
        } catch (error) {
          set({ error: error.message, loading: false });
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


/**
 * Cliente API centralizado para todas las peticiones HTTP
 * Maneja errores, headers y configuración común
 */

const API_BASE_URL = 'https://api.rosalinebakery.me';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Obtener headers comunes para las peticiones
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Manejar respuesta de la API
   */
  async handleResponse(response) {
    console.log(`[API Client] Response status: ${response.status}`, response.url);
    
    if (!response.ok) {
      let errorMessage = 'Error en la petición';
      let errorDetail = null;
      let validationErrors = null;
      
      try {
        const errorData = await response.json();
        
        // Manejar errores de validación (422) con formato mejorado
        if (response.status === 422 && errorData.errors) {
          validationErrors = errorData.errors;
          // Crear mensaje legible con todos los errores de validación
          const fieldErrors = errorData.errors.map(e => {
            const fieldName = e.field.split(' -> ').pop(); // Obtener solo el nombre del campo
            return `${fieldName}: ${e.message}`;
          }).join(', ');
          errorMessage = errorData.message || `Error de validación: ${fieldErrors}`;
        } else if (response.status === 400) {
          // Errores de negocio (400)
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } else if (response.status === 401) {
          // No autorizado
          errorMessage = errorData.detail || 'No autorizado. Por favor, inicia sesión.';
        } else if (response.status === 403) {
          // Prohibido
          errorMessage = errorData.detail || 'No tienes permisos para realizar esta acción.';
        } else if (response.status === 404) {
          // No encontrado
          errorMessage = errorData.detail || 'Recurso no encontrado.';
        } else if (response.status === 500) {
          // Error del servidor
          errorMessage = errorData.message || errorData.detail || 'Error interno del servidor. Por favor, intenta más tarde.';
        } else {
          // Otros errores
          errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
        }
        
        errorDetail = errorData;
      } catch {
        const text = await response.text();
        errorMessage = `Error ${response.status}: ${response.statusText}. ${text || ''}`;
      }

      // Crear error con información del status
      const error = new Error(errorMessage);
      error.status = response.status;
      error.detail = errorDetail;
      error.validationErrors = validationErrors; // Agregar errores de validación para uso en formularios
      
      console.error(`[API Client] Error ${response.status}:`, errorMessage);
      if (validationErrors) {
        console.error('[API Client] Errores de validación:', validationErrors);
      }
      throw error;
    }

    // Verificar content-type
    const contentType = response.headers.get('content-type') || '';
    
    // Si la respuesta está vacía, retornar null
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.warn(`[API Client] Response is not JSON, content-type: ${contentType}`);
      
      // Si hay texto, intentar parsearlo como JSON
      if (text.trim()) {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      }
      return null;
    }

    try {
      const data = await response.json();
      console.log(`[API Client] Success:`, data?.length || 'Data received');
      return data;
    } catch (error) {
      console.error(`[API Client] Error parsing JSON:`, error);
      throw new Error('Error al parsear la respuesta del servidor');
    }
  }

  /**
   * Realizar petición GET
   */
  async get(endpoint, options = {}) {
    let fullUrl = `${this.baseURL}${endpoint}`;
    
    // Agregar query params si existen
    if (options.params) {
      const queryString = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, value);
        }
      });
      const queryStr = queryString.toString();
      if (queryStr) {
        fullUrl += `?${queryStr}`;
      }
    }
    
    console.log(`[API Client] GET request to:`, fullUrl);
    
    try {
      // Agregar timeout para evitar esperas infinitas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`[API Client] Timeout en GET ${endpoint} después de 30 segundos`);
        throw new Error('La petición tardó demasiado. El servidor puede estar inactivo.');
      }
      console.error(`[API Client] Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realizar petición POST
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realizar petición PUT
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realizar petición DELETE
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}

// Instancia singleton
export const apiClient = new ApiClient();
export default apiClient;


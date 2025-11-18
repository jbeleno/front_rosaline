/**
 * Cliente API centralizado para todas las peticiones HTTP
 * Maneja errores, headers y configuración común
 */

const API_BASE_URL = 'http://3.137.201.203';

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
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = `Error ${response.status}: ${response.statusText}. ${text}`;
      }

      console.error(`[API Client] Error:`, errorMessage);
      throw new Error(errorMessage);
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
  async get(endpoint) {
    const fullUrl = `${this.baseURL}${endpoint}`;
    console.log(`[API Client] GET request to:`, fullUrl);
    
    try {
      // Agregar timeout para evitar esperas infinitas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: this.getHeaders(),
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


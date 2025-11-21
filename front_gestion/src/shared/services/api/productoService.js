import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const productoService = {
  /**
   * Obtener todos los productos
   * @param {Object} params - Parámetros opcionales { skip, limit }
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PRODUCTOS}?${queryString}` : API_ENDPOINTS.PRODUCTOS;
    
    return await apiClient.get(url);
  },

  /**
   * Obtener un producto por ID
   * Usa el endpoint directo GET /productos/{id}
   */
  async getById(id) {
    try {
      return await apiClient.get(API_ENDPOINTS.PRODUCTO_BY_ID(id));
    } catch (error) {
      // Fallback: obtener de la lista completa si el endpoint directo falla
      console.warn(`Endpoint GET /productos/${id} falló, usando lista completa como fallback`);
      const productos = await this.getAll();
      return productos.find(p => p.id_producto === parseInt(id));
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(productoData) {
    return await apiClient.post(API_ENDPOINTS.PRODUCTOS, productoData);
  },

  /**
   * Actualizar un producto existente
   */
  async update(id, productoData) {
    return await apiClient.put(API_ENDPOINTS.PRODUCTO_BY_ID(id), productoData);
  },

  /**
   * Eliminar un producto
   */
  async delete(id) {
    return await apiClient.delete(API_ENDPOINTS.PRODUCTO_BY_ID(id));
  },
};

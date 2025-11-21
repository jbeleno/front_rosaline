import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const pedidoService = {
  /**
   * Obtener todos los pedidos
   * @param {Object} params - Parámetros opcionales { skip, limit }
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PEDIDOS}?${queryString}` : API_ENDPOINTS.PEDIDOS;
    
    return await apiClient.get(url);
  },

  /**
   * Obtener un pedido por ID
   * Usa el endpoint directo GET /pedidos/{id}
   */
  async getById(id) {
    try {
      return await apiClient.get(API_ENDPOINTS.PEDIDO_BY_ID(id));
    } catch (error) {
      // Fallback: obtener de la lista completa si el endpoint directo falla
      console.warn(`Endpoint GET /pedidos/${id} falló, usando lista completa como fallback`);
      const pedidos = await this.getAll();
      return pedidos.find(p => p.id_pedido === parseInt(id));
    }
  },

  /**
   * Obtener pedidos por estado
   */
  async getByEstado(estado) {
    return await apiClient.get(API_ENDPOINTS.PEDIDOS_BY_ESTADO(estado));
  },

  /**
   * Obtener productos de un pedido
   */
  async getProductos(pedidoId) {
    return await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_PEDIDO(pedidoId));
  },

  /**
   * Crear un nuevo pedido
   */
  async create(pedidoData) {
    return await apiClient.post(API_ENDPOINTS.PEDIDOS, pedidoData);
  },

  /**
   * Actualizar un pedido existente
   */
  async update(id, pedidoData) {
    return await apiClient.put(API_ENDPOINTS.PEDIDO_BY_ID(id), pedidoData);
  },

  /**
   * Eliminar un pedido
   */
  async delete(id) {
    return await apiClient.delete(API_ENDPOINTS.PEDIDO_BY_ID(id));
  },
};

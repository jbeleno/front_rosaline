import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const detallePedidoService = {
  /**
   * Obtener todos los detalles de pedidos
   * @param {Object} params - Parámetros opcionales { skip, limit }
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.DETALLE_PEDIDOS}?${queryString}` : API_ENDPOINTS.DETALLE_PEDIDOS;
    
    return await apiClient.get(url);
  },

  /**
   * Crear un nuevo detalle de pedido
   */
  async create(detalleData) {
    return await apiClient.post(API_ENDPOINTS.DETALLE_PEDIDOS, detalleData);
  },

  /**
   * Actualizar un detalle de pedido existente
   */
  async update(id, detalleData) {
    return await apiClient.put(API_ENDPOINTS.DETALLE_PEDIDO_BY_ID(id), detalleData);
  },

  /**
   * Eliminar un detalle de pedido
   */
  async delete(id) {
    return await apiClient.delete(API_ENDPOINTS.DETALLE_PEDIDO_BY_ID(id));
  },
};

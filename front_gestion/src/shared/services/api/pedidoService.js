import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Pedido } from '../../models/Pedido';

export class PedidoService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Obtener todos los pedidos
   * @param {Object} params - Parámetros opcionales { skip, limit }
   * @returns {Promise<Pedido[]>}
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PEDIDOS}?${queryString}` : API_ENDPOINTS.PEDIDOS;

    const data = await this.client.get(url);
    return Array.isArray(data) ? data.map(p => new Pedido(p)) : [];
  }

  /**
   * Obtener un pedido por ID
   * @param {number|string} id
   * @returns {Promise<Pedido>}
   */
  async getById(id) {
    try {
      const data = await this.client.get(API_ENDPOINTS.PEDIDO_BY_ID(id));
      return new Pedido(data);
    } catch (error) {
      console.warn(`Endpoint GET /pedidos/${id} falló, usando lista completa como fallback`);
      const pedidos = await this.getAll();
      const found = pedidos.find(p => p.id_pedido === parseInt(id));
      if (!found) throw error;
      return found;
    }
  }

  /**
   * Obtener pedidos por estado
   * @param {string} estado
   * @returns {Promise<Pedido[]>}
   */
  async getByEstado(estado) {
    const data = await this.client.get(API_ENDPOINTS.PEDIDOS_BY_ESTADO(estado));
    return Array.isArray(data) ? data.map(p => new Pedido(p)) : [];
  }

  /**
   * Obtener productos de un pedido
   * @param {number|string} pedidoId
   * @returns {Promise<any[]>}
   */
  async getProductos(pedidoId) {
    return await this.client.get(API_ENDPOINTS.PRODUCTOS_BY_PEDIDO(pedidoId));
  }

  /**
   * Crear un nuevo pedido
   * @param {Object} pedidoData
   * @returns {Promise<Pedido>}
   */
  async create(pedidoData) {
    const data = await this.client.post(API_ENDPOINTS.PEDIDOS, pedidoData);
    return new Pedido(data);
  }

  /**
   * Actualizar un pedido existente
   * @param {number|string} id
   * @param {Object} pedidoData
   * @returns {Promise<Pedido>}
   */
  async update(id, pedidoData) {
    const data = await this.client.put(API_ENDPOINTS.PEDIDO_BY_ID(id), pedidoData);
    return new Pedido(data);
  }

  /**
   * Eliminar un pedido
   * @param {number|string} id
   */
  async delete(id) {
    return await this.client.delete(API_ENDPOINTS.PEDIDO_BY_ID(id));
  }
}

export const pedidoService = new PedidoService();

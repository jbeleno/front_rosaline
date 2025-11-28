import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export class DetalleCarritoService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Agregar producto al carrito
   * @param {Object} detalleData
   * @returns {Promise<Object>}
   */
  async agregarProductoAlCarrito(detalleData) {
    return await this.client.post(API_ENDPOINTS.DETALLE_CARRITO, detalleData);
  }

  /**
   * Obtener todos los detalles de carrito (Solo Admin/Super Admin)
   * @param {Object} params
   * @returns {Promise<any[]>}
   */
  async obtenerDetallesCarrito(params = {}) {
    const { skip = 0, limit = 100 } = params;
    return await this.client.get(API_ENDPOINTS.DETALLE_CARRITO, {
      params: { skip, limit }
    });
  }

  /**
   * Obtener un detalle de carrito por ID
   * @param {number|string} detalleId
   * @returns {Promise<Object>}
   */
  async obtenerDetallePorId(detalleId) {
    return await this.client.get(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId));
  }

  /**
   * Actualizar detalle de carrito (cantidad, precio, etc.)
   * @param {number|string} detalleId
   * @param {Object} detalleData
   * @returns {Promise<Object>}
   */
  async actualizarDetalleCarrito(detalleId, detalleData) {
    return await this.client.put(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId), detalleData);
  }

  /**
   * Eliminar producto del carrito
   * @param {number|string} detalleId
   */
  async eliminarProductoDelCarrito(detalleId) {
    return await this.client.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId));
  }

  /**
   * Obtener detalles de un carrito específico
   * @param {number|string} carritoId
   * @returns {Promise<any[]>}
   */
  async obtenerDetallesPorCarrito(carritoId) {
    return await this.client.get(API_ENDPOINTS.DETALLE_CARRITO_BY_CARRITO(carritoId));
  }
}

export const detalleCarritoService = new DetalleCarritoService();
export default detalleCarritoService;

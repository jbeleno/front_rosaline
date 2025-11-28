import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Carrito } from '../../models/Carrito';
import { Producto } from '../../models/Producto';

export class CarritoService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Crear un nuevo carrito
   * @param {Object} carritoData
   * @returns {Promise<Carrito>}
   */
  async crearCarrito(carritoData) {
    const data = await this.client.post(API_ENDPOINTS.CARRITOS, carritoData);
    return new Carrito(data);
  }

  /**
   * Obtener todos los carritos (Solo Admin/Super Admin)
   * @param {Object} params
   * @returns {Promise<Carrito[]>}
   */
  async obtenerCarritos(params = {}) {
    const { skip = 0, limit = 100 } = params;
    const data = await this.client.get(API_ENDPOINTS.CARRITOS, {
      params: { skip, limit }
    });
    return Array.isArray(data) ? data.map(c => new Carrito(c)) : [];
  }

  /**
   * Obtener un carrito por ID
   * @param {number|string} carritoId
   * @returns {Promise<Carrito>}
   */
  async obtenerCarritoPorId(carritoId) {
    const data = await this.client.get(API_ENDPOINTS.CARRITO_BY_ID(carritoId));
    return new Carrito(data);
  }

  /**
   * Obtener productos de un carrito
   * @param {number|string} carritoId
   * @returns {Promise<Producto[]>}
   */
  async obtenerProductosDeCarrito(carritoId) {
    const data = await this.client.get(API_ENDPOINTS.PRODUCTOS_BY_CARRITO(carritoId));
    return Array.isArray(data) ? data.map(p => new Producto(p)) : [];
  }

  /**
   * Actualizar un carrito
   * @param {number|string} carritoId
   * @param {Object} carritoData
   * @returns {Promise<Carrito>}
   */
  async actualizarCarrito(carritoId, carritoData) {
    const data = await this.client.put(API_ENDPOINTS.CARRITO_BY_ID(carritoId), carritoData);
    return new Carrito(data);
  }

  /**
   * Eliminar un carrito
   * @param {number|string} carritoId
   */
  async eliminarCarrito(carritoId) {
    return await this.client.delete(API_ENDPOINTS.CARRITO_BY_ID(carritoId));
  }

  /**
   * Obtener carritos de un cliente
   * @param {number|string} clienteId
   * @returns {Promise<Carrito[]>}
   */
  async obtenerCarritosPorCliente(clienteId) {
    const data = await this.client.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(clienteId));
    return Array.isArray(data) ? data.map(c => new Carrito(c)) : [];
  }
}

export const carritoService = new CarritoService();
export default carritoService;

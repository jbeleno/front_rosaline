import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Producto } from '../../models/Producto';

export class ProductoService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Obtener todos los productos
   * @param {Object} params - Parámetros opcionales { skip, limit }
   * @returns {Promise<Producto[]>}
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.PRODUCTOS}?${queryString}` : API_ENDPOINTS.PRODUCTOS;

    const data = await this.client.get(url);
    return Array.isArray(data) ? data.map(p => new Producto(p)) : [];
  }

  /**
   * Obtener un producto por ID
   * @param {number|string} id
   * @returns {Promise<Producto>}
   */
  async getById(id) {
    try {
      const data = await this.client.get(API_ENDPOINTS.PRODUCTO_BY_ID(id));
      return new Producto(data);
    } catch (error) {
      console.warn(`Endpoint GET /productos/${id} falló, usando lista completa como fallback`);
      const productos = await this.getAll();
      const found = productos.find(p => p.id_producto === parseInt(id));
      if (!found) throw error;
      return found;
    }
  }

  /**
   * Crear un nuevo producto
   * @param {Object} productoData
   * @returns {Promise<Producto>}
   */
  async create(productoData) {
    const data = await this.client.post(API_ENDPOINTS.PRODUCTOS, productoData);
    return new Producto(data);
  }

  /**
   * Actualizar un producto existente
   * @param {number|string} id
   * @param {Object} productoData
   * @returns {Promise<Producto>}
   */
  async update(id, productoData) {
    const data = await this.client.put(API_ENDPOINTS.PRODUCTO_BY_ID(id), productoData);
    return new Producto(data);
  }

  /**
   * Eliminar un producto
   * @param {number|string} id
   */
  async delete(id) {
    return await this.client.delete(API_ENDPOINTS.PRODUCTO_BY_ID(id));
  }
}

export const productoService = new ProductoService();

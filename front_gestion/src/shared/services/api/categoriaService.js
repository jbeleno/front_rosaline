import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Categoria } from '../../models/Categoria';
import { Producto } from '../../models/Producto';

export class CategoriaService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Obtener todas las categorías
   * @param {Object} params - Parámetros opcionales { skip, limit }
   * @returns {Promise<Categoria[]>}
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.CATEGORIAS}?${queryString}` : API_ENDPOINTS.CATEGORIAS;

    const data = await this.client.get(url);
    return Array.isArray(data) ? data.map(c => new Categoria(c)) : [];
  }

  /**
   * Obtener una categoría por ID
   * @param {number|string} id
   * @returns {Promise<Categoria>}
   */
  async getById(id) {
    try {
      const data = await this.client.get(API_ENDPOINTS.CATEGORIA_BY_ID(id));
      return new Categoria(data);
    } catch (error) {
      console.warn(`Endpoint GET /categorias/${id} falló, usando lista completa como fallback`);
      const categorias = await this.getAll();
      const found = categorias.find(c => c.id_categoria === parseInt(id));
      if (!found) throw error;
      return found;
    }
  }

  /**
   * Obtener productos de una categoría
   * @param {number|string} categoriaId
   * @returns {Promise<Producto[]>}
   */
  async getProductosByCategoria(categoriaId) {
    try {
      const data = await this.client.get(API_ENDPOINTS.PRODUCTOS_BY_CATEGORIA(categoriaId));
      return Array.isArray(data) ? data.map(p => new Producto(p)) : [];
    } catch (error) {
      console.warn(`Endpoint GET /categorias/${categoriaId}/productos falló, filtrando productos como fallback`);
      const productos = await this.client.get(API_ENDPOINTS.PRODUCTOS);
      return Array.isArray(productos)
        ? productos.filter(p => p.id_categoria === parseInt(categoriaId)).map(p => new Producto(p))
        : [];
    }
  }
}

export const categoriaService = new CategoriaService();


import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const categoriaService = {
  /**
   * Obtener todas las categorías
   * @param {Object} params - Parámetros opcionales { skip, limit }
   */
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.CATEGORIAS}?${queryString}` : API_ENDPOINTS.CATEGORIAS;
    
    return await apiClient.get(url);
  },

  /**
   * Obtener una categoría por ID
   * Usa el endpoint directo GET /categorias/{id}
   */
  async getById(id) {
    try {
      return await apiClient.get(API_ENDPOINTS.CATEGORIA_BY_ID(id));
    } catch (error) {
      // Fallback: obtener de la lista completa si el endpoint directo falla
      console.warn(`Endpoint GET /categorias/${id} falló, usando lista completa como fallback`);
      const categorias = await this.getAll();
      return categorias.find(c => c.id_categoria === parseInt(id));
    }
  },

  /**
   * Obtener productos de una categoría
   * Usa el endpoint GET /categorias/{id}/productos
   */
  async getProductosByCategoria(categoriaId) {
    try {
      return await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_CATEGORIA(categoriaId));
    } catch (error) {
      // Fallback: obtener todos los productos y filtrar
      console.warn(`Endpoint GET /categorias/${categoriaId}/productos falló, filtrando productos como fallback`);
      const productos = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      return productos.filter(p => p.id_categoria === parseInt(categoriaId));
    }
  },
};


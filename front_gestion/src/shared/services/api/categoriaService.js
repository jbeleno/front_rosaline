import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';

export const categoriaService = {
  /**
   * Obtener todas las categorías
   */
  async getAll() {
    return await apiClient.get(API_ENDPOINTS.CATEGORIAS);
  },

  /**
   * Obtener una categoría por ID
   */
  async getById(id) {
    const categorias = await this.getAll();
    return categorias.find(c => c.id_categoria === parseInt(id));
  },

  /**
   * Obtener productos de una categoría
   */
  async getProductosByCategoria(categoriaId) {
    try {
      // Intentar obtener productos desde el endpoint específico
      return await apiClient.get(`/categorias/${categoriaId}/productos`);
    } catch (error) {
      // Si falla, obtener todos los productos y filtrar
      const productos = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      return productos.filter(p => p.id_categoria === parseInt(categoriaId));
    }
  },
};


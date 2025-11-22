/**
 * Servicio para gestión de Carritos
 * Maneja las operaciones CRUD de carritos de compra
 */

import apiClient from './apiClient';
import { API_ENDPOINTS } from './endpoints';

/**
 * Crear un nuevo carrito
 * @param {Object} carritoData - Datos del carrito
 * @param {number} carritoData.id_cliente - ID del cliente
 * @param {string} [carritoData.estado='activo'] - Estado del carrito ('activo', 'inactivo', 'completado')
 * @returns {Promise<Object>} Carrito creado
 */
export const crearCarrito = async (carritoData) => {
  return await apiClient.post(API_ENDPOINTS.CARRITOS, carritoData);
};

/**
 * Obtener todos los carritos (Solo Admin/Super Admin)
 * @param {Object} params - Parámetros de paginación
 * @param {number} [params.skip=0] - Número de registros a saltar
 * @param {number} [params.limit=100] - Número máximo de registros
 * @returns {Promise<Array>} Lista de carritos
 */
export const obtenerCarritos = async (params = {}) => {
  const { skip = 0, limit = 100 } = params;
  return await apiClient.get(API_ENDPOINTS.CARRITOS, {
    params: { skip, limit }
  });
};

/**
 * Obtener un carrito por ID
 * @param {number} carritoId - ID del carrito
 * @returns {Promise<Object>} Carrito encontrado
 */
export const obtenerCarritoPorId = async (carritoId) => {
  return await apiClient.get(API_ENDPOINTS.CARRITO_BY_ID(carritoId));
};

/**
 * Obtener productos de un carrito
 * @param {number} carritoId - ID del carrito
 * @returns {Promise<Array>} Lista de productos en el carrito
 */
export const obtenerProductosDeCarrito = async (carritoId) => {
  return await apiClient.get(API_ENDPOINTS.PRODUCTOS_BY_CARRITO(carritoId));
};

/**
 * Actualizar un carrito
 * @param {number} carritoId - ID del carrito
 * @param {Object} carritoData - Datos a actualizar
 * @returns {Promise<Object>} Carrito actualizado
 */
export const actualizarCarrito = async (carritoId, carritoData) => {
  return await apiClient.put(API_ENDPOINTS.CARRITO_BY_ID(carritoId), carritoData);
};

/**
 * Eliminar un carrito
 * @param {number} carritoId - ID del carrito
 * @returns {Promise<Object>} Carrito eliminado
 */
export const eliminarCarrito = async (carritoId) => {
  return await apiClient.delete(API_ENDPOINTS.CARRITO_BY_ID(carritoId));
};

/**
 * Obtener carritos de un cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de carritos del cliente
 */
export const obtenerCarritosPorCliente = async (clienteId) => {
  return await apiClient.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(clienteId));
};

// Exportar todas las funciones como objeto default
export default {
  crearCarrito,
  obtenerCarritos,
  obtenerCarritoPorId,
  obtenerProductosDeCarrito,
  actualizarCarrito,
  eliminarCarrito,
  obtenerCarritosPorCliente
};

/**
 * Servicio para gestión de Detalles de Carrito
 * Maneja las operaciones CRUD de productos en el carrito
 */

import apiClient from './apiClient';
import { API_ENDPOINTS } from './endpoints';

/**
 * Agregar producto al carrito
 * @param {Object} detalleData - Datos del detalle
 * @param {number} detalleData.id_carrito - ID del carrito
 * @param {number} detalleData.id_producto - ID del producto
 * @param {number} detalleData.cantidad - Cantidad del producto (1-1000)
 * @param {number} detalleData.precio_unitario - Precio unitario del producto
 * @param {number} detalleData.subtotal - Subtotal (cantidad × precio_unitario)
 * @returns {Promise<Object>} Detalle de carrito creado
 */
export const agregarProductoAlCarrito = async (detalleData) => {
  const response = await apiClient.post(API_ENDPOINTS.DETALLE_CARRITO, detalleData);
  return response.data;
};

/**
 * Obtener todos los detalles de carrito (Solo Admin/Super Admin)
 * @param {Object} params - Parámetros de paginación
 * @param {number} [params.skip=0] - Número de registros a saltar
 * @param {number} [params.limit=100] - Número máximo de registros
 * @returns {Promise<Array>} Lista de detalles de carrito
 */
export const obtenerDetallesCarrito = async (params = {}) => {
  const { skip = 0, limit = 100 } = params;
  const response = await apiClient.get(API_ENDPOINTS.DETALLE_CARRITO, {
    params: { skip, limit }
  });
  return response.data;
};

/**
 * Obtener un detalle de carrito por ID
 * @param {number} detalleId - ID del detalle
 * @returns {Promise<Object>} Detalle encontrado
 */
export const obtenerDetallePorId = async (detalleId) => {
  const response = await apiClient.get(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId));
  return response.data;
};

/**
 * Actualizar detalle de carrito (cantidad, precio, etc.)
 * @param {number} detalleId - ID del detalle
 * @param {Object} detalleData - Datos a actualizar
 * @returns {Promise<Object>} Detalle actualizado
 */
export const actualizarDetalleCarrito = async (detalleId, detalleData) => {
  const response = await apiClient.put(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId), detalleData);
  return response.data;
};

/**
 * Eliminar producto del carrito
 * @param {number} detalleId - ID del detalle
 * @returns {Promise<Object>} Detalle eliminado
 */
export const eliminarProductoDelCarrito = async (detalleId) => {
  const response = await apiClient.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleId));
  return response.data;
};

// Exportar todas las funciones como objeto default
export default {
  agregarProductoAlCarrito,
  obtenerDetallesCarrito,
  obtenerDetallePorId,
  actualizarDetalleCarrito,
  eliminarProductoDelCarrito
};

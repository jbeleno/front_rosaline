/**
 * Servicio para gestión de Clientes
 * Maneja las operaciones CRUD de perfiles de clientes
 */

import apiClient from './apiClient';
import { API_ENDPOINTS } from './endpoints';

/**
 * Crear un nuevo cliente
 * @param {Object} clienteData - Datos del cliente
 * @param {number} clienteData.id_usuario - ID del usuario asociado
 * @param {string} clienteData.nombre - Nombre del cliente
 * @param {string} clienteData.apellido - Apellido del cliente
 * @param {string} [clienteData.telefono] - Teléfono del cliente
 * @param {string} [clienteData.direccion] - Dirección del cliente
 * @returns {Promise<Object>} Cliente creado
 */
export const crearCliente = async (clienteData) => {
  return await apiClient.post(API_ENDPOINTS.CLIENTES, clienteData);
};

/**
 * Obtener todos los clientes (Solo Admin/Super Admin)
 * @param {Object} params - Parámetros de paginación
 * @param {number} [params.skip=0] - Número de registros a saltar
 * @param {number} [params.limit=100] - Número máximo de registros
 * @returns {Promise<Array>} Lista de clientes
 */
export const obtenerClientes = async (params = {}) => {
  const { skip = 0, limit = 100 } = params;
  return await apiClient.get(API_ENDPOINTS.CLIENTES, {
    params: { skip, limit }
  });
};

/**
 * Obtener cliente por ID de usuario
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<Object>} Cliente encontrado
 */
export const obtenerClientePorUsuario = async (usuarioId) => {
  return await apiClient.get(API_ENDPOINTS.CLIENTE_BY_USUARIO(usuarioId));
};

/**
 * Obtener cliente por ID
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Object>} Cliente encontrado
 */
export const obtenerClientePorId = async (clienteId) => {
  return await apiClient.get(API_ENDPOINTS.CLIENTE_BY_ID(clienteId));
};

/**
 * Actualizar un cliente
 * @param {number} clienteId - ID del cliente
 * @param {Object} clienteData - Datos a actualizar
 * @returns {Promise<Object>} Cliente actualizado
 */
export const actualizarCliente = async (clienteId, clienteData) => {
  return await apiClient.put(API_ENDPOINTS.CLIENTE_BY_ID(clienteId), clienteData);
};

/**
 * Eliminar un cliente (Solo Admin/Super Admin)
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Object>} Cliente eliminado
 */
export const eliminarCliente = async (clienteId) => {
  return await apiClient.delete(API_ENDPOINTS.CLIENTE_BY_ID(clienteId));
};

/**
 * Obtener pedidos de un cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de pedidos del cliente
 */
export const obtenerPedidosCliente = async (clienteId) => {
  return await apiClient.get(API_ENDPOINTS.PEDIDOS_BY_CLIENTE(clienteId));
};

/**
 * Obtener carritos de un cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Array>} Lista de carritos del cliente
 */
export const obtenerCarritosCliente = async (clienteId) => {
  return await apiClient.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(clienteId));
};

// Exportar todas las funciones como objeto default
export default {
  crearCliente,
  obtenerClientes,
  obtenerClientePorUsuario,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
  obtenerPedidosCliente,
  obtenerCarritosCliente
};

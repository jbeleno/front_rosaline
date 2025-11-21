/**
 * Servicio para gestión de Auditoría
 * Maneja las operaciones de consulta de logs de auditoría
 * Solo accesible para Admin o Super Admin
 */

import apiClient from './apiClient';
import { API_ENDPOINTS } from './endpoints';

/**
 * Obtener logs de auditoría con filtros
 * @param {Object} params - Parámetros de filtrado
 * @param {number} [params.skip=0] - Número de registros a saltar
 * @param {number} [params.limit=100] - Número máximo de registros (máx: 100)
 * @param {string} [params.tabla_nombre] - Filtrar por nombre de tabla
 * @param {number} [params.registro_id] - Filtrar por ID de registro
 * @param {string} [params.accion] - Filtrar por acción (INSERT, UPDATE, DELETE)
 * @param {number} [params.usuario_id] - Filtrar por ID de usuario
 * @param {string} [params.fecha_desde] - Filtrar desde fecha (formato: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
 * @param {string} [params.fecha_hasta] - Filtrar hasta fecha (formato: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
 * @returns {Promise<Array>} Lista de logs de auditoría
 */
export const obtenerLogsAuditoria = async (params = {}) => {
  const {
    skip = 0,
    limit = 100,
    tabla_nombre,
    registro_id,
    accion,
    usuario_id,
    fecha_desde,
    fecha_hasta
  } = params;

  // Construir query params solo con valores definidos
  const queryParams = { skip, limit };
  
  if (tabla_nombre) queryParams.tabla_nombre = tabla_nombre;
  if (registro_id !== undefined) queryParams.registro_id = registro_id;
  if (accion) queryParams.accion = accion;
  if (usuario_id !== undefined) queryParams.usuario_id = usuario_id;
  if (fecha_desde) queryParams.fecha_desde = fecha_desde;
  if (fecha_hasta) queryParams.fecha_hasta = fecha_hasta;

  const response = await apiClient.get(API_ENDPOINTS.AUDIT, {
    params: queryParams
  });
  
  // Asegurar que siempre retornamos un array
  return Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
};

/**
 * Obtener historial de auditoría de un registro específico
 * @param {string} tablaNombre - Nombre de la tabla (ej: "productos", "usuarios", "pedidos")
 * @param {number} registroId - ID del registro
 * @returns {Promise<Array>} Historial de cambios del registro
 * 
 * @example
 * // Obtener historial de un producto
 * const historialProducto = await obtenerHistorialRegistro('productos', 123);
 * 
 * @example
 * // Obtener historial de un usuario
 * const historialUsuario = await obtenerHistorialRegistro('usuarios', 456);
 */
export const obtenerHistorialRegistro = async (tablaNombre, registroId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.AUDIT_BY_TABLA_REGISTRO(tablaNombre, registroId)
  );
  
  // Asegurar que siempre retornamos un array
  return Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
};

/**
 * Obtener logs de auditoría por tabla
 * @param {string} tablaNombre - Nombre de la tabla
 * @param {Object} params - Parámetros adicionales de filtrado
 * @returns {Promise<Array>} Logs de la tabla especificada
 */
export const obtenerLogsPorTabla = async (tablaNombre, params = {}) => {
  return obtenerLogsAuditoria({ ...params, tabla_nombre: tablaNombre });
};

/**
 * Obtener logs de auditoría por usuario
 * @param {number} usuarioId - ID del usuario
 * @param {Object} params - Parámetros adicionales de filtrado
 * @returns {Promise<Array>} Logs del usuario especificado
 */
export const obtenerLogsPorUsuario = async (usuarioId, params = {}) => {
  return obtenerLogsAuditoria({ ...params, usuario_id: usuarioId });
};

/**
 * Obtener logs de auditoría por acción
 * @param {string} accion - Acción (INSERT, UPDATE, DELETE)
 * @param {Object} params - Parámetros adicionales de filtrado
 * @returns {Promise<Array>} Logs de la acción especificada
 */
export const obtenerLogsPorAccion = async (accion, params = {}) => {
  return obtenerLogsAuditoria({ ...params, accion });
};

/**
 * Obtener logs de auditoría en un rango de fechas
 * @param {string} fechaDesde - Fecha de inicio (formato: YYYY-MM-DD)
 * @param {string} fechaHasta - Fecha de fin (formato: YYYY-MM-DD)
 * @param {Object} params - Parámetros adicionales de filtrado
 * @returns {Promise<Array>} Logs en el rango de fechas
 */
export const obtenerLogsPorFechas = async (fechaDesde, fechaHasta, params = {}) => {
  return obtenerLogsAuditoria({ 
    ...params, 
    fecha_desde: fechaDesde, 
    fecha_hasta: fechaHasta 
  });
};

// Exportar todas las funciones como objeto default
export default {
  obtenerLogsAuditoria,
  obtenerHistorialRegistro,
  obtenerLogsPorTabla,
  obtenerLogsPorUsuario,
  obtenerLogsPorAccion,
  obtenerLogsPorFechas
};

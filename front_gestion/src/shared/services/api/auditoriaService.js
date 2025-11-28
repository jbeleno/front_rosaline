import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { AuditLog } from '../../models/AuditLog';

export class AuditoriaService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Obtener logs de auditoría con filtros
   * @param {Object} params
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerLogsAuditoria(params = {}) {
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

    const queryParams = { skip, limit };

    if (tabla_nombre) queryParams.tabla_nombre = tabla_nombre;
    if (registro_id !== undefined) queryParams.registro_id = registro_id;
    if (accion) queryParams.accion = accion;
    if (usuario_id !== undefined) queryParams.usuario_id = usuario_id;
    if (fecha_desde) queryParams.fecha_desde = fecha_desde;
    if (fecha_hasta) queryParams.fecha_hasta = fecha_hasta;

    const response = await this.client.get(API_ENDPOINTS.AUDIT, {
      params: queryParams
    });

    const data = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    return data.map(log => new AuditLog(log));
  }

  /**
   * Obtener historial de auditoría de un registro específico
   * @param {string} tablaNombre
   * @param {number|string} registroId
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerHistorialRegistro(tablaNombre, registroId) {
    const response = await this.client.get(
      API_ENDPOINTS.AUDIT_BY_TABLA_REGISTRO(tablaNombre, registroId)
    );

    const data = Array.isArray(response.data) ? response.data : (response.data ? [response.data] : []);
    return data.map(log => new AuditLog(log));
  }

  /**
   * Obtener logs de auditoría por tabla
   * @param {string} tablaNombre
   * @param {Object} params
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerLogsPorTabla(tablaNombre, params = {}) {
    return this.obtenerLogsAuditoria({ ...params, tabla_nombre: tablaNombre });
  }

  /**
   * Obtener logs de auditoría por usuario
   * @param {number|string} usuarioId
   * @param {Object} params
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerLogsPorUsuario(usuarioId, params = {}) {
    return this.obtenerLogsAuditoria({ ...params, usuario_id: usuarioId });
  }

  /**
   * Obtener logs de auditoría por acción
   * @param {string} accion
   * @param {Object} params
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerLogsPorAccion(accion, params = {}) {
    return this.obtenerLogsAuditoria({ ...params, accion });
  }

  /**
   * Obtener logs de auditoría en un rango de fechas
   * @param {string} fechaDesde
   * @param {string} fechaHasta
   * @param {Object} params
   * @returns {Promise<AuditLog[]>}
   */
  async obtenerLogsPorFechas(fechaDesde, fechaHasta, params = {}) {
    return this.obtenerLogsAuditoria({
      ...params,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta
    });
  }
}

export const auditoriaService = new AuditoriaService();
export default auditoriaService;

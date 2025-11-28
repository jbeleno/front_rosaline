/**
 * Modelo de Log de Auditoría
 */
export class AuditLog {
    constructor(data = {}) {
        this.id_log = data.id_log;
        this.tabla_nombre = data.tabla_nombre;
        this.registro_id = data.registro_id;
        this.accion = data.accion;
        this.usuario_id = data.usuario_id;
        this.valores_anteriores = data.valores_anteriores;
        this.valores_nuevos = data.valores_nuevos;
        this.fecha = data.fecha ? new Date(data.fecha) : null;
        this.usuario = data.usuario || null; // Datos del usuario que realizó la acción
    }

    get fechaFormateada() {
        return this.fecha ? this.fecha.toLocaleString() : 'N/A';
    }

    toJSON() {
        return {
            id_log: this.id_log,
            tabla_nombre: this.tabla_nombre,
            registro_id: this.registro_id,
            accion: this.accion,
            usuario_id: this.usuario_id,
            valores_anteriores: this.valores_anteriores,
            valores_nuevos: this.valores_nuevos,
            fecha: this.fecha ? this.fecha.toISOString() : null
        };
    }
}

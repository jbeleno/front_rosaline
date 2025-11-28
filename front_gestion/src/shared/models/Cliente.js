/**
 * Modelo de Cliente
 */
export class Cliente {
    constructor(data = {}) {
        this.id_cliente = data.id_cliente;
        this.id_usuario = data.id_usuario;
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.telefono = data.telefono;
        this.direccion = data.direccion;
        this.fecha_registro = data.fecha_registro ? new Date(data.fecha_registro) : null;
        this.usuario = data.usuario || null; // Datos del usuario asociado (email, rol)
    }

    get nombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }

    toJSON() {
        return {
            id_cliente: this.id_cliente,
            id_usuario: this.id_usuario,
            nombre: this.nombre,
            apellido: this.apellido,
            telefono: this.telefono,
            direccion: this.direccion
        };
    }
}

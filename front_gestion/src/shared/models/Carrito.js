/**
 * Modelo de Carrito
 */
export class Carrito {
    constructor(data = {}) {
        this.id_carrito = data.id_carrito;
        this.id_cliente = data.id_cliente;
        this.fecha_creacion = data.fecha_creacion ? new Date(data.fecha_creacion) : new Date();
        this.estado = data.estado || 'activo';
        this.items = data.items || [];
    }

    get estaActivo() {
        return this.estado === 'activo';
    }

    toJSON() {
        return {
            id_carrito: this.id_carrito,
            id_cliente: this.id_cliente,
            fecha_creacion: this.fecha_creacion.toISOString(),
            estado: this.estado
        };
    }
}

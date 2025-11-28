/**
 * Modelo de Pedido
 */
export class Pedido {
    constructor(data = {}) {
        this.id_pedido = data.id_pedido;
        this.id_cliente = data.id_cliente;
        this.fecha_pedido = data.fecha_pedido ? new Date(data.fecha_pedido) : new Date();
        this.estado = data.estado || 'pendiente';
        this.total = Number(data.total) || 0;
        this.direccion_envio = data.direccion_envio;
        this.metodo_pago = data.metodo_pago;
        this.items = data.items || []; // Lista de productos en el pedido
    }

    get fechaFormateada() {
        return this.fecha_pedido.toLocaleDateString();
    }

    get totalFormateado() {
        return `$${this.total.toFixed(2)}`;
    }

    toJSON() {
        return {
            id_pedido: this.id_pedido,
            id_cliente: this.id_cliente,
            fecha_pedido: this.fecha_pedido.toISOString(),
            estado: this.estado,
            total: this.total,
            direccion_envio: this.direccion_envio,
            metodo_pago: this.metodo_pago
        };
    }
}

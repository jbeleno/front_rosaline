/**
 * Modelo de Producto
 */
export class Producto {
    constructor(data = {}) {
        this.id_producto = data.id_producto;
        this.nombre = data.nombre;
        this.descripcion = data.descripcion;
        this.precio = Number(data.precio) || 0;
        this.cantidad = Number(data.cantidad) || 0;
        this.id_categoria = data.id_categoria;
        this.imagen_url = data.imagen_url;
        this.estado = data.estado || 'activo';
        this.fecha_creacion = data.fecha_creacion ? new Date(data.fecha_creacion) : null;
    }

    get precioFormateado() {
        return `$${this.precio.toFixed(2)}`;
    }

    get estaDisponible() {
        return this.cantidad > 0 && this.estado === 'activo';
    }

    toJSON() {
        return {
            id_producto: this.id_producto,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            cantidad: this.cantidad,
            id_categoria: this.id_categoria,
            imagen_url: this.imagen_url,
            estado: this.estado
        };
    }
}

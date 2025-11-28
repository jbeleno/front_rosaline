/**
 * Modelo de Categoría
 */
export class Categoria {
    constructor(data = {}) {
        this.id_categoria = data.id_categoria;
        this.nombre = data.nombre;
        this.descripcion_corta = data.descripcion_corta;
        this.descripcion_larga = data.descripcion_larga;
        this.estado = data.estado || 'activo';
        this.fecha_creacion = data.fecha_creacion ? new Date(data.fecha_creacion) : null;
    }

    get esActiva() {
        return this.estado === 'activo';
    }

    toJSON() {
        return {
            id_categoria: this.id_categoria,
            nombre: this.nombre,
            descripcion_corta: this.descripcion_corta,
            descripcion_larga: this.descripcion_larga,
            estado: this.estado
        };
    }
}

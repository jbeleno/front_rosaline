/**
 * Modelo de Usuario
 */
export class Usuario {
    constructor(data = {}) {
        this.id_usuario = data.id_usuario;
        this.correo = data.correo;
        this.rol = data.rol || 'cliente';
        this.email_verificado = data.email_verificado || 'N';
        this.fecha_creacion = data.fecha_creacion ? new Date(data.fecha_creacion) : null;
    }

    get esAdmin() {
        return this.rol === 'admin' || this.rol === 'super_admin';
    }

    get esSuperAdmin() {
        return this.rol === 'super_admin';
    }

    get estaVerificado() {
        return this.email_verificado === 'S';
    }

    toJSON() {
        return {
            id_usuario: this.id_usuario,
            correo: this.correo,
            rol: this.rol,
            email_verificado: this.email_verificado
        };
    }
}

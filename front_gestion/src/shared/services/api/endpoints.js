/**
 * Endpoints centralizados de la API
 * Facilita el mantenimiento y la refactorización de URLs
 */

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/login',
  LOGOUT: '/logout',
  USUARIO_ME: '/usuarios/me',
  
  // Usuarios
  USUARIOS: '/usuarios/',
  USUARIO_BY_ID: (id) => `/usuarios/${id}`,
  
  // Confirmación de cuenta
  CONFIRMAR_CUENTA: '/usuarios/confirmar-cuenta',
  REENVIAR_CONFIRMACION: '/usuarios/reenviar-confirmacion',
  
  // Recuperación de contraseña
  SOLICITAR_RECUPERACION: '/usuarios/solicitar-recuperacion',
  VALIDAR_PIN: '/usuarios/validar-pin',
  CAMBIAR_CONTRASEÑA: '/usuarios/cambiar-contraseña',
  CAMBIAR_CONTRASEÑA_AUTENTICADO: '/usuarios/cambiar-contraseña-autenticado',
  
  // Clientes
  CLIENTES: '/clientes/',
  CLIENTE_BY_ID: (id) => `/clientes/${id}`,
  CLIENTE_BY_USUARIO: (userId) => `/clientes/usuario/${userId}`,
  CARRITOS_BY_CLIENTE: (clienteId) => `/clientes/${clienteId}/carritos`,
  PEDIDOS_BY_CLIENTE: (clienteId) => `/clientes/${clienteId}/pedidos`,
  
  // Carritos
  CARRITOS: '/carritos/',
  CARRITO_BY_ID: (id) => `/carritos/${id}`,
  PRODUCTOS_BY_CARRITO: (carritoId) => `/carritos/${carritoId}/productos`,
  
  // Detalles de Carrito
  DETALLE_CARRITO: '/detalle_carrito/',
  DETALLE_CARRITO_BY_ID: (id) => `/detalle_carrito/${id}`,
  
  // Productos
  PRODUCTOS: '/productos/',
  PRODUCTO_BY_ID: (id) => `/productos/${id}`,
  
  // Categorías
  CATEGORIAS: '/categorias/',
  CATEGORIA_BY_ID: (id) => `/categorias/${id}`,
  PRODUCTOS_BY_CATEGORIA: (categoriaId) => `/categorias/${categoriaId}/productos`,
  
  // Pedidos
  PEDIDOS: '/pedidos/',
  PEDIDO_BY_ID: (id) => `/pedidos/${id}`,
  PEDIDOS_BY_ESTADO: (estado) => `/pedidos/estado/${estado}`,
  PRODUCTOS_BY_PEDIDO: (pedidoId) => `/pedidos/${pedidoId}/productos`,
  
  // Detalles de Pedido
  DETALLE_PEDIDOS: '/detalle_pedidos/',
  DETALLE_PEDIDO_BY_ID: (id) => `/detalle_pedidos/${id}`,
};


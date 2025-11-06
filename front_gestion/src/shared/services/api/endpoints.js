/**
 * Endpoints centralizados de la API
 * Facilita el mantenimiento y la refactorización de URLs
 */

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // Usuarios
  USUARIOS: '/usuarios/',
  USUARIO_BY_ID: (id) => `/usuarios/${id}`,
  
  // Clientes
  CLIENTES: '/clientes/',
  CLIENTE_BY_ID: (id) => `/clientes/${id}`,
  CLIENTE_BY_USUARIO: (userId) => `/clientes/usuario/${userId}`,
  CARRITOS_BY_CLIENTE: (clienteId) => `/clientes/${clienteId}/carritos`,
  
  // Carritos
  CARRITOS: '/carritos/',
  CARRITO_BY_ID: (id) => `/carritos/${id}`,
  
  // Detalles de Carrito
  DETALLE_CARRITO: '/detalle_carrito/',
  DETALLE_CARRITO_BY_ID: (id) => `/detalle_carrito/${id}`,
  
  // Productos
  PRODUCTOS: '/productos/',
  PRODUCTO_BY_ID: (id) => `/productos/${id}`,
  
  // Categorías
  CATEGORIAS: '/categorias/',
  CATEGORIA_BY_ID: (id) => `/categorias/${id}`,
  
  // Pedidos
  PEDIDOS: '/pedidos/',
  PEDIDO_BY_ID: (id) => `/pedidos/${id}`,
  PEDIDOS_BY_ESTADO: (estado) => `/pedidos/estado/${estado}`,
  
  // Detalles de Pedido
  DETALLE_PEDIDOS: '/detalle_pedidos/',
  DETALLE_PEDIDO_BY_ID: (id) => `/detalle_pedidos/${id}`,
};


/**
 * Constantes compartidas de la aplicación
 */

export const APP_CONFIG = {
  API_BASE_URL: 'https://api.rosalinebakery.me',
  APP_NAME: 'Rosaline Bakery',
};

export const ROUTES = {
  HOME: '/',
  PRODUCTOS: '/productos',
  PRODUCTO: (id) => `/producto/${id}`,
  CATEGORIA: (id) => `/categoria/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  MI_CUENTA: '/micuenta',
  ADMIN: '/admin',
  CARRITO: '/carrito',
  PEDIDO_CONFIRMADO: (id) => `/pedido-confirmado/${id}`,
  SOBRE_NOSOTROS: '/sobrenosotros',
};

export const ESTADOS_PEDIDO = [
  'Pago confirmado',
  'En preparación',
  'En domicilio',
  'Listo para recoger',
  'Entregado'
];

export const ROLES = {
  CLIENTE: 'cliente',
  ADMIN: 'admin',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USUARIO: 'usuario',
};


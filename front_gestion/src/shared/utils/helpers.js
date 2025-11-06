/**
 * Funciones auxiliares compartidas
 */

/**
 * Formatear precio a formato de moneda
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Normalizar URL de imagen
 */
export function normalizeImageUrl(url, baseUrl = 'https://back-rosaline.onrender.com') {
  if (!url) return null;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Debounce function para búsquedas
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validar email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calcular total de items en carrito
 */
export function calculateCartTotal(items, products) {
  return items.reduce((total, item, index) => {
    const product = products[index];
    if (product) {
      return total + (product.precio * item.cantidad);
    }
    return total;
  }, 0);
}


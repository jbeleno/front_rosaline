/**
 * Hook personalizado para gestionar el carrito
 * Proporciona acceso al store del carrito y métodos útiles
 */
import { useEffect } from 'react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../../auth/store/authStore';

export function useCart() {
  const { cliente, isAuthenticated } = useAuthStore();
  const cartStore = useCartStore();

  // Cargar carrito cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && cliente?.id_cliente && !cartStore.cart) {
      cartStore.fetchCart(cliente.id_cliente);
    }
  }, [isAuthenticated, cliente?.id_cliente, cartStore.cart]);

  return {
    ...cartStore,
    isEmpty: cartStore.cartItems.length === 0,
    itemCount: cartStore.getTotalItems(),
  };
}


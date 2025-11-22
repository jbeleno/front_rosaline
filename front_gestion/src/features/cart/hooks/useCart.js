/**
 * Hook personalizado para gestionar el carrito
 * Proporciona acceso al store del carrito y métodos útiles
 */
import { useEffect, useRef } from 'react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../../auth/store/authStore';

export function useCart() {
  const { cliente, isAuthenticated } = useAuthStore();
  const cartStore = useCartStore();
  const prevClienteIdRef = useRef(null);

  // Cargar carrito cuando el usuario está autenticado o cuando cambia el cliente
  useEffect(() => {
    if (!isAuthenticated) {
      // Si no está autenticado, limpiar el carrito
      if (cartStore.cart || cartStore.cartItems.length > 0) {
        cartStore.resetCart();
      }
      prevClienteIdRef.current = null;
      return;
    }

    if (cliente?.id_cliente) {
      // Si cambió el cliente (diferente id_cliente), recargar el carrito
      if (prevClienteIdRef.current !== cliente.id_cliente) {
        prevClienteIdRef.current = cliente.id_cliente;
        cartStore.fetchCart(cliente.id_cliente);
      }
    } else if (prevClienteIdRef.current !== null) {
      // Si había un cliente antes pero ahora no (cambio de cuenta a admin sin perfil)
      prevClienteIdRef.current = null;
      cartStore.resetCart();
    }
  }, [isAuthenticated, cliente?.id_cliente, cartStore]);

  return {
    ...cartStore,
    isEmpty: cartStore.cartItems.length === 0,
    itemCount: cartStore.getTotalItems(),
  };
}


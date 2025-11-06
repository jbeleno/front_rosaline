/**
 * Store del carrito con Zustand
 * Gestiona el estado del carrito de compras
 */
import { create } from 'zustand';
import { apiClient } from '../../../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../../../shared/services/api/endpoints';

const useCartStore = create((set, get) => ({
  // Estado
  cart: null,
  cartItems: [],
  products: [], // Cache de productos del carrito
  total: 0,
  loading: false,
  error: null,

  // Acciones
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  // Obtener carrito activo
  fetchCart: async (clienteId) => {
    set({ loading: true, error: null });
    try {
      const carritos = await apiClient.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(clienteId));
      const carritosArray = Array.isArray(carritos) ? carritos : [];
      const carritoActivo = carritosArray.find(c => c.estado === 'activo');
      
      set({ cart: carritoActivo || null, loading: false });
      
      if (carritoActivo) {
        await get().fetchCartItems(carritoActivo.id_carrito);
      } else {
        set({ cartItems: [], products: [], total: 0 });
      }
    } catch (error) {
      set({ error: error.message, loading: false, cart: null });
    }
  },

  // Obtener items del carrito
  fetchCartItems: async (cartId) => {
    set({ loading: true });
    try {
      const detallesAll = await apiClient.get(API_ENDPOINTS.DETALLE_CARRITO);
      const detallesCarrito = detallesAll.filter(d => d.id_carrito === cartId);
      
      if (detallesCarrito.length === 0) {
        set({ cartItems: [], products: [], total: 0, loading: false });
        return;
      }

      // Obtener productos en paralelo
      const productosAll = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      const productosSeleccionados = detallesCarrito.map(d => 
        productosAll.find(p => p.id_producto === d.id_producto)
      ).filter(Boolean);

      // Calcular total
      const total = detallesCarrito.reduce((sum, item, index) => {
        const product = productosSeleccionados[index];
        return sum + (product?.precio || 0) * item.cantidad;
      }, 0);

      set({ 
        cartItems: detallesCarrito, 
        products: productosSeleccionados,
        total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Agregar producto al carrito
  addToCart: async (producto, cantidad, clienteId) => {
    set({ loading: true, error: null });
    try {
      // Obtener o crear carrito activo
      let cart = get().cart;
      if (!cart && clienteId) {
        const nuevoCarrito = await apiClient.post(API_ENDPOINTS.CARRITOS, {
          id_cliente: clienteId,
          estado: 'activo'
        });
        cart = nuevoCarrito;
        set({ cart });
      }

      if (!cart) {
        throw new Error('No se pudo obtener o crear el carrito');
      }

      // Verificar si el producto ya existe en el carrito
      const detallesAll = await apiClient.get(API_ENDPOINTS.DETALLE_CARRITO);
      const detalleExistente = detallesAll.find(
        d => d.id_carrito === cart.id_carrito && d.id_producto === producto.id_producto
      );

      if (detalleExistente) {
        // Actualizar cantidad
        const nuevaCantidad = detalleExistente.cantidad + Number(cantidad);
        await apiClient.put(
          API_ENDPOINTS.DETALLE_CARRITO_BY_ID(detalleExistente.id_detalle_carrito),
          {
            id_carrito: cart.id_carrito,
            id_producto: producto.id_producto,
            cantidad: nuevaCantidad,
            precio_unitario: producto.precio,
            subtotal: nuevaCantidad * producto.precio
          }
        );
      } else {
        // Crear nuevo detalle
        await apiClient.post(API_ENDPOINTS.DETALLE_CARRITO, {
          id_carrito: cart.id_carrito,
          id_producto: producto.id_producto,
          cantidad: Number(cantidad),
          precio_unitario: producto.precio,
          subtotal: Number(cantidad) * producto.precio
        });
      }

      // Actualizar items
      await get().fetchCartItems(cart.id_carrito);
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Actualizar cantidad de un item
  updateItemQuantity: async (itemId, nuevaCantidad) => {
    set({ loading: true });
    try {
      const item = get().cartItems.find(i => i.id_detalle_carrito === itemId);
      if (!item) throw new Error('Item no encontrado');

      const product = get().products.find(p => p.id_producto === item.id_producto);
      if (!product) throw new Error('Producto no encontrado');

      await apiClient.put(
        API_ENDPOINTS.DETALLE_CARRITO_BY_ID(itemId),
        {
          ...item,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * product.precio
        }
      );

      await get().fetchCartItems(get().cart?.id_carrito);
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Eliminar item del carrito
  removeFromCart: async (itemId) => {
    set({ loading: true });
    try {
      await apiClient.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(itemId));
      await get().fetchCartItems(get().cart?.id_carrito);
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Vaciar carrito
  clearCart: async () => {
    if (!get().cart) return;
    
    set({ loading: true });
    try {
      for (const item of get().cartItems) {
        await apiClient.delete(API_ENDPOINTS.DETALLE_CARRITO_BY_ID(item.id_detalle_carrito));
      }
      set({ 
        cart: null, 
        cartItems: [], 
        products: [], 
        total: 0,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Obtener cantidad total de items
  getTotalItems: () => {
    return get().cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  }
}));

export default useCartStore;


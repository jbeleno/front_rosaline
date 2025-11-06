/**
 * Hook personalizado para obtener un producto específico
 */
import { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../../../shared/services/api/endpoints';
import { normalizeImageUrl } from '../../../shared/utils/helpers';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const productos = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
        const productData = productos.find(p => p.id_producto === parseInt(productId));

        if (!productData) {
          throw new Error('Producto no encontrado');
        }

        // Normalizar URL de imagen
        if (productData.imagen_url) {
          productData.imagen_url = normalizeImageUrl(productData.imagen_url);
        }

        if (!cancelled) {
          setProduct(productData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar el producto');
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const refetch = async () => {
    setLoading(true);
    try {
      const productos = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      const productData = productos.find(p => p.id_producto === parseInt(productId));
      
      if (productData?.imagen_url) {
        productData.imagen_url = normalizeImageUrl(productData.imagen_url);
      }
      
      setProduct(productData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { product, loading, error, refetch };
}


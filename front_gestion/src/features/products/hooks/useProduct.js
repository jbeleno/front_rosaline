/**
 * Hook personalizado para obtener un producto específico
 */
import { useState, useEffect } from 'react';
import { productoService } from '../../../shared/services/api/productoService';
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
        // Usar el endpoint directo GET /productos/{id}
        const productData = await productoService.getById(productId);

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
      const productData = await productoService.getById(productId);
      
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


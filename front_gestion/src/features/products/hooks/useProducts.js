/**
 * Hook personalizado para obtener productos
 * Usa React Query para caché y gestión de estado
 */
import { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/services/api/apiClient';
import { API_ENDPOINTS } from '../../../shared/services/api/endpoints';

export function useProducts(filters = {}) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
        
        if (!cancelled) {
          // Aplicar filtros locales si es necesario
          let filteredData = data;
          
          if (filters.categoria) {
            filteredData = filteredData.filter(p => 
              p.id_categoria === parseInt(filters.categoria)
            );
          }

          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredData = filteredData.filter(p =>
              p.nombre.toLowerCase().includes(searchLower) ||
              p.descripcion?.toLowerCase().includes(searchLower)
            );
          }

          setProductos(filteredData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error al cargar productos');
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(filters)]);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get(API_ENDPOINTS.PRODUCTOS);
      setProductos(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { productos, loading, error, refetch };
}


import React from 'react';
import { useProducts } from '../features/products/hooks/useProducts';
import { LoadingSpinner } from '../shared/components/UI/LoadingSpinner';
import { ErrorMessage } from '../shared/components/UI/ErrorMessage';
import '../styles/ProductosList.css';

export default function ProductosList() {
  const { productos, loading, error, refetch } = useProducts();

  if (loading) {
    return (
      <div className="productos-list-container">
        <LoadingSpinner message="Cargando productos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-list-container">
        <ErrorMessage 
          message="Error al cargar productos" 
          error={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="productos-list-container">
      <h1 className="productos-title">Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id_producto} className="producto-card">
            <h2 className="producto-nombre">{producto.nombre}</h2>
            <p className="producto-precio">${producto.precio}</p>
            {/* Aquí puedes agregar botón para agregar al carrito */}
          </div>
        ))}
      </div>
      {productos.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
          No hay productos disponibles
        </p>
      )}
    </div>
  );
}

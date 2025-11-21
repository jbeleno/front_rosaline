import React, { useState, useEffect } from 'react';
import auditoriaService from '../shared/services/api/auditoriaService';
import useAuthStore from '../features/auth/store/authStore';
import { LoadingSpinner } from '../shared/components/UI/LoadingSpinner';
import { ErrorMessage } from '../shared/components/UI/ErrorMessage';
import '../styles/Auditoria.css';

export default function Auditoria() {
  const { isAdmin } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    tabla_nombre: '',
    registro_id: '',
    accion: '',
    usuario_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    skip: 0,
    limit: 50
  });

  // Paginación
  const [totalLogs, setTotalLogs] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    if (isAdmin) {
      cargarLogs();
    }
  }, [isAdmin, filtros.skip]);

  const cargarLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filtrar parámetros vacíos
      const params = Object.entries(filtros).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await auditoriaService.obtenerLogsAuditoria(params);
      
      // Manejar diferentes formatos de respuesta
      const logsArray = Array.isArray(data) ? data : [];
      setLogs(logsArray);
      setTotalLogs(logsArray.length);
    } catch (err) {
      console.error('Error al cargar logs:', err);
      setError(err.message || 'Error al cargar logs de auditoría');
      setLogs([]);
      setTotalLogs(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      skip: 0 // Resetear paginación al cambiar filtros
    }));
    setPaginaActual(1);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarLogs();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      tabla_nombre: '',
      registro_id: '',
      accion: '',
      usuario_id: '',
      fecha_desde: '',
      fecha_hasta: '',
      skip: 0,
      limit: 50
    });
    setPaginaActual(1);
  };

  const handlePaginaSiguiente = () => {
    setFiltros(prev => ({
      ...prev,
      skip: prev.skip + prev.limit
    }));
    setPaginaActual(prev => prev + 1);
  };

  const handlePaginaAnterior = () => {
    setFiltros(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit)
    }));
    setPaginaActual(prev => Math.max(1, prev - 1));
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '-';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAccionColor = (accion) => {
    switch (accion?.toUpperCase()) {
      case 'INSERT': return '#27ae60';
      case 'UPDATE': return '#f39c12';
      case 'DELETE': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (!isAdmin) {
    return (
      <div className="auditoria-container">
        <div className="auditoria-error">
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a los logs de auditoría.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auditoria-container">
      <h1 className="auditoria-title">📊 Auditoría del Sistema</h1>
      <p className="auditoria-subtitle">
        Registro completo de todas las acciones realizadas en el sistema
      </p>

      {/* Filtros */}
      <form className="auditoria-filtros" onSubmit={handleBuscar}>
        <div className="filtros-grid">
          <div className="filtro-campo">
            <label htmlFor="tabla_nombre">Tabla</label>
            <select
              id="tabla_nombre"
              name="tabla_nombre"
              value={filtros.tabla_nombre}
              onChange={handleFiltroChange}
            >
              <option value="">Todas las tablas</option>
              <option value="usuarios">Usuarios</option>
              <option value="clientes">Clientes</option>
              <option value="productos">Productos</option>
              <option value="categorias">Categorías</option>
              <option value="carritos">Carritos</option>
              <option value="pedidos">Pedidos</option>
              <option value="detalle_carrito">Detalle Carrito</option>
              <option value="detalle_pedidos">Detalle Pedidos</option>
            </select>
          </div>

          <div className="filtro-campo">
            <label htmlFor="accion">Acción</label>
            <select
              id="accion"
              name="accion"
              value={filtros.accion}
              onChange={handleFiltroChange}
            >
              <option value="">Todas las acciones</option>
              <option value="INSERT">INSERT (Crear)</option>
              <option value="UPDATE">UPDATE (Actualizar)</option>
              <option value="DELETE">DELETE (Eliminar)</option>
            </select>
          </div>

          <div className="filtro-campo">
            <label htmlFor="registro_id">ID Registro</label>
            <input
              type="number"
              id="registro_id"
              name="registro_id"
              value={filtros.registro_id}
              onChange={handleFiltroChange}
              placeholder="ID del registro"
            />
          </div>

          <div className="filtro-campo">
            <label htmlFor="usuario_id">ID Usuario</label>
            <input
              type="number"
              id="usuario_id"
              name="usuario_id"
              value={filtros.usuario_id}
              onChange={handleFiltroChange}
              placeholder="ID del usuario"
            />
          </div>

          <div className="filtro-campo">
            <label htmlFor="fecha_desde">Desde</label>
            <input
              type="datetime-local"
              id="fecha_desde"
              name="fecha_desde"
              value={filtros.fecha_desde}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-campo">
            <label htmlFor="fecha_hasta">Hasta</label>
            <input
              type="datetime-local"
              id="fecha_hasta"
              name="fecha_hasta"
              value={filtros.fecha_hasta}
              onChange={handleFiltroChange}
            />
          </div>
        </div>

        <div className="filtros-botones">
          <button type="submit" className="btn-buscar">
            🔍 Buscar
          </button>
          <button 
            type="button" 
            onClick={handleLimpiarFiltros}
            className="btn-limpiar"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
      </form>

      {/* Resultados */}
      {loading ? (
        <LoadingSpinner message="Cargando logs de auditoría..." />
      ) : error ? (
        <ErrorMessage message="Error al cargar logs" error={error} onRetry={cargarLogs} />
      ) : (
        <>
          <div className="auditoria-info">
            <p>
              Mostrando {logs.length} registros 
              {filtros.skip > 0 && ` (desde el registro ${filtros.skip + 1})`}
            </p>
          </div>

          <div className="auditoria-tabla-container">
            <table className="auditoria-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha y Hora</th>
                  <th>Tabla</th>
                  <th>Registro ID</th>
                  <th>Acción</th>
                  <th>Usuario ID</th>
                  <th>Datos Anteriores</th>
                  <th>Datos Nuevos</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="tabla-vacia">
                      No se encontraron registros de auditoría
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id_auditoria}>
                      <td>{log.id_auditoria}</td>
                      <td>{formatearFecha(log.fecha_hora)}</td>
                      <td>
                        <span className="tabla-badge">
                          {log.tabla_nombre}
                        </span>
                      </td>
                      <td>{log.registro_id}</td>
                      <td>
                        <span 
                          className="accion-badge"
                          style={{ backgroundColor: getAccionColor(log.accion) }}
                        >
                          {log.accion}
                        </span>
                      </td>
                      <td>{log.usuario_id || '-'}</td>
                      <td>
                        <pre className="datos-json">
                          {log.datos_anteriores 
                            ? JSON.stringify(JSON.parse(log.datos_anteriores), null, 2)
                            : '-'}
                        </pre>
                      </td>
                      <td>
                        <pre className="datos-json">
                          {log.datos_nuevos 
                            ? JSON.stringify(JSON.parse(log.datos_nuevos), null, 2)
                            : '-'}
                        </pre>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="auditoria-paginacion">
            <button
              onClick={handlePaginaAnterior}
              disabled={filtros.skip === 0}
              className="btn-paginacion"
            >
              ← Anterior
            </button>
            <span className="paginacion-info">
              Página {paginaActual}
            </span>
            <button
              onClick={handlePaginaSiguiente}
              disabled={logs.length < filtros.limit}
              className="btn-paginacion"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './shared/components/Layout/ProtectedRoute';
import { LoadingSpinner } from './shared/components/UI/LoadingSpinner';
import { SchemaMarkup } from './shared/components/SEO/SchemaMarkup';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// ============================================
// LAZY LOADING DE COMPONENTES
// ============================================

// Páginas públicas (carga ligera)
const Home = React.lazy(() => import('./components/Home'));
const ProductosList = React.lazy(() => import('./components/ProductosList'));
const CategoriaProductos = React.lazy(() => import('./components/CategoriaProductos'));
const VistaProducto = React.lazy(() => import('./components/VistaProducto'));
const LoginRegister = React.lazy(() => import('./components/LoginRegister'));
const SobreNosotros = React.lazy(() => import('./components/SobreNosotros'));
const ConfirmarCuenta = React.lazy(() => import('./components/ConfirmarCuenta'));
const RecuperarContraseña = React.lazy(() => import('./components/RecuperarContraseña'));

// Páginas protegidas (carga solo cuando se necesita)
const ClienteCuenta = React.lazy(() => import('./components/ClienteCuenta'));
const Carrito = React.lazy(() => import('./components/Carrito'));
const PedidoConfirmado = React.lazy(() => import('./components/PedidoConfirmado'));
const CambiarContraseña = React.lazy(() => import('./components/CambiarContraseña'));

// Página de admin (carga solo para administradores)
const AdminCuenta = React.lazy(() => import('./components/AdminCuenta'));

// Componente de fallback mejorado
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    flexDirection: 'column'
  }}>
    <LoadingSpinner message="Cargando página..." />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <SchemaMarkup />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductosList />} />
          <Route path="/categoria/:id" element={<CategoriaProductos />} />
          <Route path="/producto/:id" element={<VistaProducto />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/sobrenosotros" element={<SobreNosotros />} />
          <Route path="/confirmar-cuenta" element={<ConfirmarCuenta />} />
          <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />

          {/* Rutas protegidas */}
          <Route 
            path="/micuenta" 
            element={
              <ProtectedRoute>
                <ClienteCuenta />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/carrito" 
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pedido-confirmado/:id" 
            element={
              <ProtectedRoute>
                <PedidoConfirmado />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cambiar-contraseña" 
            element={
              <ProtectedRoute>
                <CambiarContraseña />
              </ProtectedRoute>
            } 
          />

          {/* Ruta protegida para admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminCuenta />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

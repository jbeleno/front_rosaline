import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductosList from './components/ProductosList';
import CategoriaProductos from './components/CategoriaProductos';
import VistaProducto from './components/VistaProducto';
import LoginRegister from './components/LoginRegister';
import ClienteCuenta from './components/ClienteCuenta';
import AdminCuenta from './components/AdminCuenta';
import Carrito from './components/Carrito';
import PedidoConfirmado from './components/PedidoConfirmado';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductosList />} />
        <Route path="/categoria/:id" element={<CategoriaProductos />} />
        <Route path="/producto/:id" element={<VistaProducto />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/micuenta" element={<ClienteCuenta />} />
        <Route path="/admin" element={<AdminCuenta />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedido-confirmado/:id" element={<PedidoConfirmado />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

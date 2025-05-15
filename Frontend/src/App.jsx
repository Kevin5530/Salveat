import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes para usuarios
import Login from './components/Login';
import Registro from './components/Registro';
import Home from './components/Home';
import HomeUsuario from './components/HomeUsuario';
import OrdenCard from './components/OrdenCard';
import DetalleOrden from './components/Restaurante/DetalleOrden';


// Componentes para restaurante
import LoginRestaurante from './components/Restaurante/LoginRestaurante';
import RegistroRestaurante from './components/Restaurante/RegistroRestaurante';
import RestaurantDashboard from './components/Restaurante/RestaurantDashboard';
import ProtectedRoute from './components/Restaurante/ProtectedRoute';
import PublicarOrden from './components/Restaurante/PublicarOrden';
import VerOrden from './components/Restaurante/VerOrden';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de usuario */}
        <Route path='/' element={<Home />} />
        <Route path='/HomeUsuario' element={<HomeUsuario />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Registro' element={<Registro />} />
        <Route path='/OrdenCard' element={<OrdenCard />} />
        <Route path='/DetalleOrden/:ordenId' element={<DetalleOrden />} />

        {/* Rutas de restaurante (área protegida) */}
        <Route path='/Login-Restaurante' element={<LoginRestaurante />} />
        <Route path='/Registro-Restaurante' element={<RegistroRestaurante />} />
        <Route
          path='/restaurant-dashboard'
          element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/publish-orders'
          element={
            <ProtectedRoute>
              <PublicarOrden />
            </ProtectedRoute>
          }
        />
        <Route
          path='/view-orders'
          element={
            <ProtectedRoute>
              <VerOrden />
            </ProtectedRoute>
          }
        />

        {/* Ruta para 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;

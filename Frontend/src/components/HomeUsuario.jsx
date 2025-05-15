import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import './HomeUsuario.css';
import OrdenCard from './OrdenCard';

function HomeUsuario() {
  const [ordenes, setOrdenes] = useState([]);
  const [user, setUser] = useState({
    name: 'Usuario Genérico',
    email: 'usuario@example.com',
    imageUrl: 'https://via.placeholder.com/150'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Si guardaste los datos del usuario en localStorage, se recuperan aquí
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetch('http://localhost:3001/api/orden/buscar')
      .then(res => res.json())
      .then(data => {
        console.log('Órdenes recibidas:', data); 
        setOrdenes(data);
      })
      .catch(err => console.error('Error al cargar órdenes', err));

  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const verDetalles = (ordenId) => {
    navigate(`/DetalleOrden/${ordenId}`);
  };

  return (
    <div className="home-container">
      {/* Barra de navegación */}
      <nav className="home-nav">
        <div className="logo">
        <img src="/images/logo.jpg" alt="SalvEat" className="mx-auto mb-4 h-12" />
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
      </nav>

      {/* Encabezado */}
      <header className="home-header">
        <h1>¡Bienvenido, {user.name}!</h1>
        <p >Explora las ofertas especiales de hoy antes de que se agoten 🍽️</p>
      </header>

      <div className="contenedor-ordenes">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de Órdenes</h2>
      

      {ordenes.length === 0 ? (
        <p>No hay órdenes disponibles</p>
      ) : (
        <div className="ordenes-grid">
          {ordenes.map((orden) => (
            <OrdenCard key={orden.orden_id} orden={orden} verDetalles={verDetalles} />
          ))}
        </div>
      )}
    </div>


    </div>
  );
}

export default HomeUsuario;

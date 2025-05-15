import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalleOrden.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DetalleOrden() {
  const { ordenId } = useParams();
  const [orden, setOrden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('orden_id:', ordenId); // Verificar el ordenId recibido
    fetch(`http://localhost:3001/api/orden/detalle/${ordenId}`)
      .then(res => {
        console.log('Response status:', res.status); // Verificar el código de estado
        return res.json();
      })
      .then(data => {
        console.log('Datos de la orden:', data); // Verificar los datos recibidos
        setOrden(data);
      })
      .catch(err => console.error('Error:', err));
  }, [ordenId]);

  if (!orden) {
    return <p>Cargando orden...</p>;
  }

  const handleComprar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.success('Debes iniciar sesión para comprar.');
      return;
    }
  
    fetch('http://localhost:3001/api/orden/comprar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comprador_id: user.id,
        orden_id: orden.orden_id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Compra realizada con éxito');
          setTimeout(() => navigate('/HomeUsuario'), 2000); 
        } else {
          toast.error('Error: ' + (data.error || 'No se pudo completar la compra'));
        }
      })
      .catch(err => {
        toast.error('Error de red al realizar la compra');
        console.error(err);
        
      });
  };
  


  return (
    <div className="detalle-container">
  <button className="btn-volver" onClick={() => navigate(-1)}>← Volver</button>

  <div className="detalle-card">
    <div className="detalle-flex">
      <img
        src={orden.imagen_url || 'https://via.placeholder.com/300'}
        alt={orden.nombre_platillo}
        className="detalle-img"
      />

      <div className="detalle-info">
        <h2 className="detalle-title">{orden.nombre_platillo}</h2>
        <p className="precio-original">Precio Original: ${parseFloat(orden.precio_original).toFixed(2)}</p>
        <p className="precio-descuento">Precio Descuento: ${parseFloat(orden.precio_descuento).toFixed(2)}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
        <p><strong>Publicado:</strong> {new Date(orden.fecha_publicacion).toLocaleString()}</p>
      </div>
    </div>
  </div>

      <div className="restaurante-info">
      <h3>Información del Restaurante</h3>
        <p>Nombre: {orden.nombre_restaurante}</p>
        <p>Dirección: {orden.direccion}</p>
        <p>Teléfono: {orden.telefono}</p>
        <p>Email: {orden.email}</p>
        <button className="btn-comprar" onClick={handleComprar}>Comprar</button>
      <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default DetalleOrden;

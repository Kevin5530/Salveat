import React from 'react';
import './OrdenCard.css';

function OrdenCard({ orden, verDetalles }) {
  return (
    <div className="orden-card" onClick={() => verDetalles(orden.orden_id)}>
      <img src={orden.imagen_url || 'https://via.placeholder.com/200'} alt={orden.nombre_platillo} className="orden-img" />
      <div className="orden-info">
        <h3>{orden.nombre_platillo}</h3>
        <p className="precio-original">${parseFloat(orden.precio_original).toFixed(2)}</p>
        <p className="precio-descuento">${parseFloat(orden.precio_descuento).toFixed(2)}</p>
        <p className="estado">{orden.estado}</p>
        <p className="fecha">{new Date(orden.fecha_publicacion).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default OrdenCard;

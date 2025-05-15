import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Oval } from 'react-loader-spinner';

export default function VerOrden() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para obtener las órdenes del restaurante
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const storedRestauranteId = localStorage.getItem('restaurante_id');
      const restaurante_id = storedRestauranteId ? parseInt(storedRestauranteId, 10) : null;

      if (!restaurante_id || isNaN(restaurante_id)) {
        setError('Error: Restaurante no válido. Por favor inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/orden/${restaurante_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordenadas = response.data.sort((a, b) =>
        new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
      );
      setOrders(ordenadas);

      toast.success('Órdenes cargadas correctamente', {
        toastId: 'ordenes-cargadas',
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      setError('Error al cargar tus órdenes');
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Función para actualizar el estado de una orden
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/orden/estado/${orderId}`,
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orden_id === orderId ? { ...order, estado: newStatus } : order
        )
      );
      toast.success('Estado actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      setError('Error al actualizar el estado de la orden');
      toast.error('Error al actualizar la orden');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto mt-8 max-w-7xl p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Órdenes ({orders.length})</h1>
          <button
            onClick={() => navigate('/restaurant-dashboard')}
            className="rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Regresar al Dashboard
          </button>
        </div>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {loading ? (
          <div className="flex justify-center">
            <Oval height={50} width={50} color="gray" />
          </div>
        ) : orders.length === 0 ? (
          <p>No hay órdenes disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((orden) => (
              <div
                key={orden.orden_id}
                className="flex flex-col rounded bg-white p-4 shadow hover:shadow-lg transition-shadow"
              >
                {orden.imagen_url ? (
                  <img
                    src={orden.imagen_url}
                    alt={orden.nombre_platillo}
                    className="h-48 w-full object-contain p-2 rounded transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {orden.nombre_platillo}
                  </h2>
                  <p className="text-sm text-gray-500 line-through">
                    ${orden.precio_original}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${orden.precio_descuento}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Publicado: {new Date(orden.fecha_publicacion).toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-1 text-sm ${
                      orden.estado === 'Disponible'
                        ? 'text-green-700 bg-green-100 px-2 py-1 rounded'
                        : orden.estado === 'Vendido'
                        ? 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded'
                        : 'text-red-700 bg-red-100 px-2 py-1 rounded'
                    }`}
                  >
                    Estado: {orden.estado}
                  </p>
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-600">
                      Cambiar Estado
                    </label>
                    <select
                      value={orden.estado}
                      disabled={orden.estado !== 'Disponible'}
                      onChange={(e) => updateOrderStatus(orden.orden_id, e.target.value)}
                      className="mt-1 block w-full rounded border-gray-300 p-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PublicarOrden() {
  const [nombrePlatillo, setNombrePlatillo] = useState('');
  const [precioOriginal, setPrecioOriginal] = useState('');
  const [precioDescuento, setPrecioDescuento] = useState('');
  const [imagen, setImagen] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [restauranteName, setRestauranteName] = useState('');
  const navigate = useNavigate();

  // Efecto de fade-in al cargar la página
  useEffect(() => {
    setFadeIn(true);
    // Obtener el nombre del restaurante del localStorage
    const name = localStorage.getItem('name');
    if (name) {
      setRestauranteName(name);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(precioDescuento) >= parseFloat(precioOriginal)) {
      setMessage('El precio descuento debe ser menor que el precio original');
      return;
    }
    setShowConfirmation(true);
  };

  const handleSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      // Obtener el restaurante_id de manera individual
      const storedRestauranteId = localStorage.getItem('restaurante_id');
      const restaurante_id = storedRestauranteId ? parseInt(storedRestauranteId, 10) : null;
  
      if (!restaurante_id || isNaN(restaurante_id)) {
        setMessage('Error: No se encontró un restaurante válido. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('restaurante_id', restaurante_id);
      formData.append('nombre_platillo', nombrePlatillo);
      formData.append('precio_original', precioOriginal);
      formData.append('precio_descuento', precioDescuento);
      if (imagen) {
        formData.append('imagen', imagen);
      }
  
      const response = await axios.post('/api/orden/crear', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setMessage(`¡Platillo publicado exitosamente! (ID: ${response.data.orden_id})`);
      setNombrePlatillo('');
      setPrecioOriginal('');
      setPrecioDescuento('');
      setImagen(null);
      setPreviewImage(null);
  
      // Redirige a la vista de órdenes tras un breve retraso
      setTimeout(() => {
        navigate('/view-orders');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('Error al publicar la orden');
    }
    setLoading(false);
  };

  // Calcular el porcentaje de descuento
  const calcularPorcentajeDescuento = () => {
    if (precioOriginal && precioDescuento) {
      const original = parseFloat(precioOriginal);
      const descuento = parseFloat(precioDescuento);
      if (original > 0 && descuento < original) {
        return Math.round(((original - descuento) / original) * 100);
      }
    }
    return 0;
  };

  const porcentajeDescuento = calcularPorcentajeDescuento();

  return (
    <div className={`min-h-screen bg-gradient-to-b from-indigo-50 to-white transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <img
            src="/images/logo.jpg"
            alt="SalvEat"
            className="mx-auto h-12 w-auto drop-shadow-md transition-transform duration-300 hover:scale-110"
          />
          
          {/* Título con efecto de gradiente */}
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Publicar Nuevo Platillo
          </h2>
          
          {/* Subtítulo con nombre del restaurante */}
          {restauranteName && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Restaurante: <span className="font-semibold">{restauranteName}</span>
            </p>
          )}
          
          {/* Mensaje de estado con animación */}
          {message && (
            <div className={`mt-4 rounded-md p-3 transition-all duration-500 ease-in-out ${
              message.startsWith('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <p className="text-center text-sm font-medium">
                {message.startsWith('Error') && (
                  <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {!message.startsWith('Error') && (
                  <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <form onSubmit={handlePreSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Nombre del Platillo */}
              <div>
                <label htmlFor="nombrePlatillo" className="flex items-center text-sm font-medium text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nombre del Platillo
                </label>
                <div className="mt-1">
                  <input
                    id="nombrePlatillo"
                    name="nombrePlatillo"
                    type="text"
                    required
                    placeholder="Ej: Hamburguesa Especial"
                    value={nombrePlatillo}
                    onChange={(e) => setNombrePlatillo(e.target.value)}
                    className="block w-full rounded-md bg-white px-4 py-2 text-gray-900 
                               placeholder:text-gray-400 outline outline-1 outline-gray-300
                               focus:outline-2 focus:outline-indigo-600 sm:text-sm transition-all
                               duration-200 focus:shadow-md"
                  />
                </div>
              </div>

              {/* Precios - Dos columnas */}
              <div className="grid grid-cols-2 gap-4">
                {/* Precio Original */}
                <div>
                  <label htmlFor="precioOriginal" className="flex items-center text-sm font-medium text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Precio Original
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="precioOriginal"
                      name="precioOriginal"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={precioOriginal}
                      onChange={(e) => setPrecioOriginal(e.target.value)}
                      className="block w-full pl-7 pr-3 py-2 rounded-md bg-white text-gray-900 
                                placeholder:text-gray-400 outline outline-1 outline-gray-300
                                focus:outline-2 focus:outline-indigo-600 sm:text-sm transition-all
                                duration-200 focus:shadow-md"
                    />
                  </div>
                </div>

                {/* Precio Descuento */}
                <div>
                  <label htmlFor="precioDescuento" className="flex items-center text-sm font-medium text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                    Precio con Descuento
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="precioDescuento"
                      name="precioDescuento"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={precioDescuento}
                      onChange={(e) => setPrecioDescuento(e.target.value)}
                      className="block w-full pl-7 pr-3 py-2 rounded-md bg-white text-gray-900 
                                placeholder:text-gray-400 outline outline-1 outline-gray-300
                                focus:outline-2 focus:outline-indigo-600 sm:text-sm transition-all
                                duration-200 focus:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Descuento calculado */}
              {porcentajeDescuento > 0 && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-100 transition-all duration-300">
                  <p className="text-sm text-green-700 font-semibold text-center">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                      -{porcentajeDescuento}%
                    </span>
                    ¡Gran descuento para tus clientes!
                  </p>
                </div>
              )}

              {/* Imagen del Platillo */}
              <div>
                <label htmlFor="imagen" className="flex items-center text-sm font-medium text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Imagen del Platillo
                </label>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="imagen" className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-100 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-sm text-indigo-500 font-semibold">
                          {imagen ? imagen.name : "Clic para subir una imagen"}
                        </p>
                        <p className="text-xs text-indigo-400">PNG, JPG o JPEG (MAX. 2MB)</p>
                      </div>
                      <input 
                        id="imagen" 
                        name="imagen" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange} 
                      />
                    </label>
                  </div>
                  {previewImage && (
                    <div className="mt-4 relative">
                      <img
                        src={previewImage}
                        alt="Vista previa"
                        className="w-full h-auto max-h-60 object-contain rounded-md border border-gray-200 shadow-md transition-transform duration-300 hover:scale-105"
                      />
                      <button 
                        type="button"
                        onClick={() => {setImagen(null); setPreviewImage(null);}}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Separador decorativo */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Información del platillo</span>
                </div>
              </div>

              {/* Botón de envío */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-md bg-indigo-600 
                          px-4 py-2.5 text-sm font-semibold text-white shadow-md
                          hover:bg-indigo-500 focus:outline-none focus:ring-2 
                          focus:ring-indigo-500 focus:ring-offset-2 transition-all
                          duration-200 hover:shadow-lg disabled:opacity-70"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {loading ? 'Publicando...' : 'Publicar Platillo'}
                </button>
              </div>
            </form>
          </div>

          {/* Botón para regresar al Dashboard */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/restaurant-dashboard')}
              className="inline-flex items-center justify-center rounded-md bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700
                        hover:bg-gray-200 focus:outline-none focus:ring-2 
                        focus:ring-gray-400 focus:ring-offset-2 transition-all
                        duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Regresar al Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-100 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar publicación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas publicar este platillo?</p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="font-semibold text-gray-800">{nombrePlatillo}</p>
              <div className="flex justify-between mt-2">
                <p className="text-gray-500">Precio original: <span className="line-through">${precioOriginal}</span></p>
                <p className="text-green-600 font-bold">Ahora: ${precioDescuento}</p>
              </div>
              {porcentajeDescuento > 0 && (
                <p className="text-xs text-indigo-600 mt-1">Descuento del {porcentajeDescuento}%</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
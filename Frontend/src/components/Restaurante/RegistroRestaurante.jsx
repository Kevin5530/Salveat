import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegistroRestauranteTailwind() {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/restaurante/registro', formData);
      toast.success('Restaurante registrado exitosamente');
      setTimeout(() => navigate('/login-restaurante'), 2000);
    } catch (err) {
      toast.error('Error al registrar el restaurante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Imagen lateral */}
        <div
          className="hidden lg:flex w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/register-restaurant.jpg')" }}
        />

        {/* Formulario */}
        <div className="flex flex-col justify-center w-full max-w-md mx-auto p-6">
          <div className="mb-6 text-center">
            <img src="/images/logo.jpg" alt="SalvEat" className="mx-auto h-10" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Registro de Restaurante</h2>
            <p className="text-sm text-gray-500">Crea tu cuenta y comienza a publicar tus ofertas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {['nombre', 'direccion', 'telefono', 'email', 'password', 'confirmPassword'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field === 'confirmPassword' ? 'Confirmar contraseña' : field}
                </label >
                <input
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                             placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md py-2 px-4 text-white text-sm font-semibold 
                          ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login-restaurante" className="text-indigo-600 font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-indigo-500 hover:underline">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

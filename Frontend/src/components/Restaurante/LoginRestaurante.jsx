import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginRestaurante() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/restaurante/login', { email, password });
      const { token, restaurante_id, nombre } = response.data;

      if (!token) throw new Error('Token inválido');

      localStorage.setItem('token', token);
      localStorage.setItem('restaurante_id', restaurante_id.toString());
      localStorage.setItem('name', nombre);
      localStorage.setItem('email', email);

      toast.success('¡Inicio de sesión exitoso!');
      setTimeout(() => navigate('/restaurant-dashboard'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Credenciales inválidas';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ToastContainer />

      {/* Imagen lateral (solo visible en pantallas grandes) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src="/images/login-restaurant.jpg"
          alt="Login visual"
          className="object-cover max-h-[85%] rounded-lg shadow-lg"
        />
      </div>

      {/* Formulario de inicio de sesión */}
      <div className="flex flex-col justify-center items-center min-h-screen w-full max-w-md mx-auto p-8">
        <img src="/images/logo.jpg" alt="SalvEat" className="mx-auto mb-4 h-12" />
        <h2 className="text-center text-2xl font-bold text-gray-900">Iniciar Sesión - Restaurante</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Ingresa con tu correo y contraseña registrados</p>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro-restaurante" className="text-indigo-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>

        {/* Enlace al inicio */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

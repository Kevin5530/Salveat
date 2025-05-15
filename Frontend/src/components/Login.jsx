import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom'; // Importar hook para navegación
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook de navegación

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error('Correo inválido. Ejemplo: usuario@dominio.com');
        return;
      }

    try {
      const response = await fetch('http://localhost:3001/api/clientes/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          imageUrl: 'https://via.placeholder.com/150'
        };

        localStorage.setItem('user', JSON.stringify(user));
        toast.success('¡Inicio de sesión exitoso! Redirigiendo...');
        setTimeout(() => navigate('/HomeUsuario'), 2000);
      } else {
        toast.error(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.error(error);
    }
  };

  return (
    <>
    
    <ToastContainer/>
    <div className="flex h-screen overflow-hidden bg-gray-50">

    {/* Imagen lateral (solo visible en pantallas grandes) */}
    <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src="/images/login-usuario2.jpg"
          alt="Login visual"
          className="object-cover max-h-[85%] rounded-lg shadow-lg"
        />
      </div>

    <div className='flex w-full lg:w-1/2 items-center justify-center px-8'>
      <div className="login-card">
      <img src="/images/logo.jpg" alt="SalvEat" className="mx-auto mb-4 h-12" />
      <h2 className="login-title">Iniciar Sesión - Usuario</h2>
      <form onSubmit={handleLogin}>
      <div className="form-group">
            <label className="label" htmlFor="email">Correo Electrónico</label>
            <input
              className="input"
              placeholder='Email'
              id="email"
              name="email"
              type="email"
              required
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
      <div className="form-group">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              className="input"
              placeholder='Contraseña'
              id="password"
              name="password"
              type="password"
              required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
      <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 transition">Iniciar sesión</button>
      </form>
      <p className="register-text">
          ¿Aún no tienes cuenta? <Link to="/Registro">Registrarse</Link>
        </p>
         <Link to="/" className="text-sm text-gray-500 hover:underline">← Volver al inicio</Link>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
    </>
  );
}

export default Login;
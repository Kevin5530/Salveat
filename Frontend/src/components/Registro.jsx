import React, { useState } from 'react';
import './Registro.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [clienteId, setClienteId] = useState(null);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    toast.error('Correo inválido. Ejemplo: usuario@dominio.com');
    return;
  }

    try {
      const response = await fetch('http://localhost:3001/api/clientes/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, telefono, password }),
      });

      const data = await response.json();
      if (data.success) {
        setClienteId(data.id); // Guardamos ID para futuras acciones
        toast.success('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error('Error al registrar cliente');
      }
    } catch (error) {
      toast.error('Error en el registro:', error);
      console.error(error);
    }
  };        

  return (
<div className="flex h-screen overflow-hidden bg-gray-50">

{/* Imagen lateral (solo visible en pantallas grandes) */}
   <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src="/images/registro-usuario.jpg"
          alt="Login visual"
          className="object-cover max-h-[85%] rounded-lg shadow-lg"
        />
      </div>
    <div className='flex w-full lg:w-1/2 items-center justify-center px-8'>
      <div className="register-card">
      <img src="/images/logo.jpg" alt="SalvEat" className="mx-auto mb-4 h-12" />
      <h2 className="register-title">Registro - Usuario</h2>
      <form onSubmit={handleRegistro}>
      <div className="form-group"> 
      <label className="label" htmlFor="nombre">Nombre completo</label>
      <input 
      className="input" 
      type='text'
      id='nombre'
      name='nombre'
      required 
      placeholder='Nombre completo'
      value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="form-group"> 
      <label className="label" htmlFor="email">Correo Electrónico</label>
      <input 
      className="input" 
      type='email'
      id='email'
      name='email'
      required
      placeholder='Email'
      value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group"> 
      <label className="label" htmlFor="telefono">Teléfono</label>
      <input 
      className="input" 
      type='tel'
      id='telefono'
      name='telefono'
      required
      pattern='[0-9]{10}' 
      placeholder='Teléfono'
      value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div className="form-group"> 
      <label className="label" htmlFor="password">Contraseña</label>
      <input 
      className="input" 
      type='password'
      id='password'
      name='password'
      required
      placeholder='Contraseña' 
      value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 transition">Registrarse</button>
      </form>
      <p className="register-text">
        ¿Ya tienes cuenta? <Link to="/Login">Iniciar Sesión</Link>
        </p>
        <Link to="/" className="text-sm text-gray-500 hover:underline">← Volver al inicio</Link>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </div>
  );
}


export default Registro;
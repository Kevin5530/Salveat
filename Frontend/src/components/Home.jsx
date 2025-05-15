// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpTrayIcon, ShoppingCartIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex flex-1 items-center justify-center bg-cover bg-center px-4 py-24"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative z-10 text-center max-w-2xl text-white">
          <img src="/images/logo.jpg" alt="SalvEat logo" className="mx-auto mb-6 h-12" />
          <h1 className="mb-4 text-5xl font-extrabold leading-tight">
            Conecta Restaurantes con Clientes y Evita el Desperdicio
          </h1>
          <p className="mb-8 text-lg">
            Compra comida a menor precio o publica platos próximos a caducar. Todos ganan, nada se desperdicia.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto rounded bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 transition duration-300"
            >
              Soy Cliente
            </Link>
            <Link
              to="/login-restaurante"
              className="w-full sm:w-auto rounded bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 transition duration-300"
            >
              Soy Restaurante
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-12 text-3xl font-bold text-gray-800">¿Cómo funciona?</h2>
          <div className="grid gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <ArrowUpTrayIcon className="mb-4 h-16 w-16 text-indigo-600 transition-transform duration-300 hover:scale-110" />
              <h3 className="text-xl font-semibold">Publicar Pedidos</h3>
              <p className="text-gray-600 mt-2">Sube tus platos y aplica un descuento para reducir el desperdicio.</p>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingCartIcon className="mb-4 h-16 w-16 text-blue-600 transition-transform duration-300 hover:scale-110" />
              <h3 className="text-xl font-semibold">Clientes Compran</h3>
              <p className="text-gray-600 mt-2">Permite que los usuarios vean tus ofertas y compren al instante.</p>
            </div>
            <div className="flex flex-col items-center">
              <ChartBarIcon className="mb-4 h-16 w-16 text-indigo-600 transition-transform duration-300 hover:scale-110" />
              <h3 className="text-xl font-semibold">Optimiza Recursos</h3>
              <p className="text-gray-600 mt-2">Reduce el desperdicio y mejora tus ingresos con información en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-10 px-4 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h4 className="mb-6 text-2xl font-bold">¿Listo para empezar? Elige cómo deseas participar en SalvEat</h4>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/registro"
              className="inline-block rounded bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 transition duration-300"
            >
              Registrarse como Cliente
            </Link>
            <Link
              to="/registro-restaurante"
              className="inline-block rounded bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 transition duration-300"
            >
              Registrarse como Restaurante
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

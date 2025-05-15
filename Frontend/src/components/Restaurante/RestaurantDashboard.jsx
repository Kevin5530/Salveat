import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const navigation = [
  { name: 'Salpicadero', path: '/restaurant-dashboard' },
  { name: 'Publicar Pedidos', path: '/publish-orders' },
  { name: 'Ver Pedidos', path: '/view-orders' },
];

export default function RestaurantDashboard() {
  const [user] = useState(() => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedRestauranteId = localStorage.getItem('restaurante_id');
    const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    return {
      name: storedName || 'Restaurante Genérico',
      email: storedEmail || 'restaurante@example.com',
      restaurante_id: storedRestauranteId || '',
      imageUrl: defaultImageUrl,
    };
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login-restaurante');
  };

  const userNavigation = [
    { name: 'Perfil', path: '/perfil' },
    { name: 'Ajustes', path: '/ajustes' },
    { name: 'Cerrar sesión', onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.jpg"
                alt="SalvEat"
                className="h-8 w-auto"
              />
              <span className="text-white font-semibold text-lg">SalvEat</span>
              <div className="hidden md:flex space-x-4 ml-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              <Menu as="div" className="ml-3 relative">
                <div>
                  <MenuButton className="flex items-center rounded-full text-sm focus:outline-none">
                    <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="User avatar" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  {userNavigation.map((item) =>
                    item.onClick ? (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block w-full px-4 py-2 text-left text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </button>
                        )}
                      </MenuItem>
                    ) : (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.path}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </MenuItem>
                    )
                  )}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard del Restaurante</h1>
          <p className="text-gray-600 text-lg mt-1">Bienvenido, <span className="font-medium">{user.name}</span>.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="rounded-lg bg-white shadow p-6 flex items-start space-x-4">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" />
            </svg>
            <p className="text-gray-700 text-base">
              Aquí podrás gestionar tus <strong>pedidos</strong>, ver <strong>estadísticas</strong> y realizar otras acciones importantes para tu restaurante.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">Pedidos Activos</h3>
              <p className="text-gray-500 text-sm">Gestión de los pedidos actuales.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">Estadísticas</h3>
              <p className="text-gray-500 text-sm">Rendimiento y datos de tus ventas.</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800">Historial</h3>
              <p className="text-gray-500 text-sm">Consulta pedidos anteriores.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

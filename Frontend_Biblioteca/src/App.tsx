import { useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { MisSolicitudes } from './components/MisSolicitudes';
import { GridDisponibilidad } from './components/GridDisponibilidad';

function App() {
  // Estado para alternar entre las vistas del sistema
  const [vistaActiva, setVistaActiva] = useState<'mis-solicitudes' | 'disponibilidad' | 'admin'>('mis-solicitudes');
  
  // DNI de prueba para el docente
  const [docenteDniPrueba] = useState<string>('30123456');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Barra de navegación superior para alternar vistas */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex flex-wrap justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Sistema de Gestión de Biblioteca - Módulo Docente</h1>
        <nav className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setVistaActiva('mis-solicitudes')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              vistaActiva === 'mis-solicitudes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mis Solicitudes
          </button>
          <button
            onClick={() => setVistaActiva('disponibilidad')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              vistaActiva === 'disponibilidad'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Grilla de Disponibilidad
          </button>
          <button
            onClick={() => setVistaActiva('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              vistaActiva === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Dashboard
          </button>
        </nav>
      </header>

      {/* Contenido principal según la pestaña activa */}
      <main className="py-6">
        {vistaActiva === 'mis-solicitudes' && (
          <MisSolicitudes docenteDni={docenteDniPrueba} />
        )}
        {vistaActiva === 'disponibilidad' && (
          <GridDisponibilidad recursoIdDefault={1} />
        )}
        {vistaActiva === 'admin' && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
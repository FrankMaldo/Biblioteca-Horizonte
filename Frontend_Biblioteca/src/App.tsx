import { useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { MisSolicitudes } from './components/MisSolicitudes';
import { GridDisponibilidad } from './components/GridDisponibilidad';
import { CatalogoYSolicitud } from './components/CatalogoYSolicitud';

function App() {
  // HU-11: Simulación de Identificación y Rol del Usuario
  const [rol, setRol] = useState<'DOCENTE' | 'BIBLIOTECARIA'>('DOCENTE');
  const [vistaActiva, setVistaActiva] = useState<'catalogo' | 'mis-solicitudes' | 'disponibilidad' | 'admin'>('catalogo');
  
  // Datos del docente autenticado
  const [docenteDni] = useState<string>('30123456');
  const [docenteNombre] = useState<string>('Prof. Carlos Gómez');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header con Control de Rol y Navegación */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Sistema Biblioteca Horizonte</h1>
          <p className="text-xs text-gray-500">
            Usuario actual: <span className="font-semibold">{rol === 'DOCENTE' ? `${docenteNombre} (${docenteDni})` : 'Lucía (Bibliotecaria)'}</span>
          </p>
        </div>

        {/* HU-11: Selector de Rol de Prueba */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-lg text-xs font-semibold">
          <span className="text-gray-500 px-2">Rol:</span>
          <button
            onClick={() => { setRol('DOCENTE'); setVistaActiva('catalogo'); }}
            className={`px-3 py-1.5 rounded-md transition ${rol === 'DOCENTE' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Docente
          </button>
          <button
            onClick={() => { setRol('BIBLIOTECARIA'); setVistaActiva('admin'); }}
            className={`px-3 py-1.5 rounded-md transition ${rol === 'BIBLIOTECARIA' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Bibliotecaria
          </button>
        </div>

        {/* Navegación Según Rol */}
        <nav className="flex space-x-2">
          {rol === 'DOCENTE' ? (
            <>
              <button
                onClick={() => setVistaActiva('catalogo')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  vistaActiva === 'catalogo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Catálogo & Solicitar
              </button>
              <button
                onClick={() => setVistaActiva('mis-solicitudes')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  vistaActiva === 'mis-solicitudes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mis Solicitudes
              </button>
              <button
                onClick={() => setVistaActiva('disponibilidad')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  vistaActiva === 'disponibilidad' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grilla Disponibilidad
              </button>
            </>
          ) : (
            <button
              onClick={() => setVistaActiva('admin')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white"
            >
              Panel de Administración
            </button>
          )}
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="py-6">
        {rol === 'DOCENTE' && vistaActiva === 'catalogo' && (
          <CatalogoYSolicitud
            docenteDni={docenteDni}
            docenteNombre={docenteNombre}
            onSolicitudCreada={() => setVistaActiva('mis-solicitudes')}
          />
        )}
        {rol === 'DOCENTE' && vistaActiva === 'mis-solicitudes' && (
          <MisSolicitudes docenteDni={docenteDni} />
        )}
        {rol === 'DOCENTE' && vistaActiva === 'disponibilidad' && (
          <GridDisponibilidad recursoIdDefault={1} />
        )}
        {rol === 'BIBLIOTECARIA' && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
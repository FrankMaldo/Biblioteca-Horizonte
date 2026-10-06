import React, { useEffect, useState } from 'react';
import type { Solicitud } from '../types/solicitud';
import { solicitudService } from '../services/solicitudService';

interface Props {
  docenteDni: string;
}

export const MisSolicitudes: React.FC<Props> = ({ docenteDni }) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [solicitudACancelar, setSolicitudACancelar] = useState<Solicitud | null>(null);
  const [cancelando, setCancelando] = useState<boolean>(false);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await solicitudService.obtenerMisSolicitudes(docenteDni);
      setSolicitudes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docenteDni) {
      cargarSolicitudes();
    }
  }, [docenteDni]);

  const confirmarCancelacion = async () => {
    if (!solicitudACancelar) return;

    try {
      setCancelando(true);
      await solicitudService.cancelarSolicitud(solicitudACancelar.id);
      setSolicitudACancelar(null);
      cargarSolicitudes();
    } catch (err: any) {
      alert(err.message || 'Error al cancelar la solicitud');
    } finally {
      setCancelando(false);
    }
  };

  const renderBadge = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">PENDIENTE</span>;
      case 'CONFIRMADA':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">CONFIRMADA</span>;
      case 'RECHAZADA':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">RECHAZADA</span>;
      case 'CANCELADA':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">CANCELADA</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{estado}</span>;
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando mis solicitudes...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Solicitudes de Recursos</h2>

      {solicitudes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tienes solicitudes registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-3">ID</th>
                <th className="p-3">Recurso</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Módulo</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {solicitudes.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-700">#{sol.id}</td>
                  <td className="p-3 text-gray-800">{sol.recurso?.nombre || 'Recurso ' + sol.recurso?.id}</td>
                  <td className="p-3 text-gray-600">{sol.fecha}</td>
                  <td className="p-3 text-gray-600">Módulo {sol.moduloHorario}</td>
                  <td className="p-3">{renderBadge(sol.estado)}</td>
                  <td className="p-3 text-center">
                    {sol.estado === 'PENDIENTE' ? (
                      <button
                        onClick={() => setSolicitudACancelar(sol)}
                        className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No disponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {solicitudACancelar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar solicitud #{solicitudACancelar.id}?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Estás a punto de cancelar la reserva para el recurso <span className="font-semibold">{solicitudACancelar.recurso?.nombre}</span> en la fecha <span className="font-semibold">{solicitudACancelar.fecha}</span> (Módulo {solicitudACancelar.moduloHorario}). Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSolicitudACancelar(null)}
                disabled={cancelando}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={confirmarCancelacion}
                disabled={cancelando}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
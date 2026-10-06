import React, { useState } from 'react';
import type { RecursoDisponibilidadResponse } from '../types/solicitud';
import { solicitudService } from '../services/solicitudService';

interface Props {
  recursoIdDefault: number;
}

export const GridDisponibilidad: React.FC<Props> = ({ recursoIdDefault }) => {
  const [recursoId, setRecursoId] = useState<number>(recursoIdDefault);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dataDisponibilidad, setDataDisponibilidad] = useState<RecursoDisponibilidadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const consultar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resultado = await solicitudService.consultarDisponibilidad(recursoId, fecha);
      setDataDisponibilidad(resultado);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al consultar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Consulta de Disponibilidad de Recursos</h2>

      <form onSubmit={consultar} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ID de Recurso</label>
          <input
            type="number"
            value={recursoId}
            onChange={(e) => setRecursoId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Ver Disponibilidad'}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {dataDisponibilidad && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Módulos para el recurso #{dataDisponibilidad.recursoId} en fecha {dataDisponibilidad.fecha}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dataDisponibilidad.disponibilidad.map((mod) => {
              const isLibre = mod.estado === 'LIBRE';
              const isPendiente = mod.estado === 'PENDIENTE';

              return (
                <div
                  key={mod.moduloHorario}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isLibre
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isPendiente
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Módulo {mod.moduloHorario}</p>
                  <p className={`text-sm font-extrabold ${isLibre ? 'text-emerald-700' : isPendiente ? 'text-amber-700' : 'text-red-700'}`}>
                    {mod.estado}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
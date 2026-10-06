import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import type { Solicitud, EstadoSolicitud } from '../types/solicitud';

export const HistoricoReservas: React.FC = () => {
  const [historico, setHistorico] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorico = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.obtenerHistorico();
      setHistorico(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el histórico de reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorico();
  }, []);

  const getBadgeColor = (estado: EstadoSolicitud) => {
    switch (estado) {
      case 'CONFIRMADA': return 'bg-green-100 text-green-800 border-green-300';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELADA': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Cargando histórico de reservas...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b text-gray-700 text-xs uppercase tracking-wider">
            <th className="p-4">ID</th>
            <th className="p-4">Docente</th>
            <th className="p-4">Recurso</th>
            <th className="p-4">Fecha Uso</th>
            <th className="p-4">Módulo</th>
            <th className="p-4">Estado Final</th>
            <th className="p-4">Motivo / Detalle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {historico.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500">
                No hay registros históricos de solicitudes finalizadas.
              </td>
            </tr>
          ) : (
            historico.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-600">#{h.id}</td>
                <td className="p-4 font-medium text-gray-800">{h.docenteNombre}</td>
                <td className="p-4">{h.recurso.nombre}</td>
                <td className="p-4">{h.fecha}</td>
                <td className="p-4">Módulo {h.moduloHorario}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeColor(h.estado)}`}>
                    {h.estado}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-600">
                  {h.motivoRechazo ? (
                    <span className="text-red-600 italic">Motivo: {h.motivoRechazo}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};